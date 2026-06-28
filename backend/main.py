"""
FastAPI Backend Application

Orchestrates the engageAI backend services, exposing endpoints for:
- Persona generation (via Cerebras)
- Agent execution (LangGraph streamed via SSE)
- Chat interactions and recommendations
"""
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import requests
from typing import List, Optional
import json
import asyncio
from database import engine, Base, get_db
import models
from graph import create_graph
from llm_adapter import get_llm

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="engageAI API")

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    from sqlalchemy import text
    try:
        db.execute(text("ALTER TABLE product_catalog ADD COLUMN link VARCHAR(500)"))
        db.commit()
    except Exception:
        db.rollback()
        
    if db.query(models.Persona).count() < 15:
        print("Auto-seeding database because there are less than 15 personas...")
        import seed
        seed.seed_data()

graph_app = create_graph()

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def call_llm_with_fallback(messages: list):
    import os, requests, json, re
    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    
    def extract_and_parse_json(text):
        if not text:
            raise Exception("Empty text")
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            text = json_match.group(0)
        json.loads(text) # validate it parses
        return text

    # Try Groq
    try:
        if groq_api_key and groq_api_key != "your_GROQ_API_KEY_here":
            res = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {groq_api_key}", "Content-Type": "application/json"},
                json={"model": "llama-3.1-8b-instant", "messages": messages},
                timeout=10
            )
            if res.ok:
                response_text = res.json()["choices"][0]["message"]["content"].strip()
                return extract_and_parse_json(response_text)
            print(f"Groq API error: {res.text}")
    except Exception as e:
        print(f"Groq exception: {e}")
        
    # Fallback to Gemini
    print("Falling back to Gemini...")
    try:
        if gemini_api_key and gemini_api_key != "your_gemini_api_key_here":
            gemini_contents = []
            sys_prompt = ""
            for m in messages:
                if m["role"] == "system":
                    sys_prompt = m["content"]
                else:
                    role = "model" if m["role"] == "assistant" else "user"
                    gemini_contents.append({"role": role, "parts": [{"text": m["content"]}]})
            
            payload = {"contents": gemini_contents}
            if sys_prompt:
                payload["systemInstruction"] = {"parts": [{"text": sys_prompt}]}
                
            res = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=10
            )
            if res.ok:
                data = res.json()
                if "candidates" in data and len(data["candidates"]) > 0:
                    response_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    return extract_and_parse_json(response_text)
            print(f"Gemini API error: {res.text}")
    except Exception as e:
        print(f"Gemini exception: {e}")
        
    raise Exception("Both Groq and Gemini API calls failed.")

CUSTOM_PERSONA_CACHE = {}

class ChatRequest(BaseModel):
    message: str
    intent: Optional[str] = None

class ProductUpdate(BaseModel):
    name: str
    category: str
    description: str
    eligibility_rules: dict

@app.get("/")
@app.head("/")
@app.get("/health")
@app.head("/health")
def health_check():
    return {"status": "ok", "message": "engageAI backend is running"}

@app.get("/personas")
def get_personas(db: Session = Depends(get_db)):
    personas = db.query(models.Persona).all()
    db_personas = [{"id": p.id, "archetype": p.archetype, "profile": p.profile, "embedded_events": p.embedded_events} for p in personas]
    cached_personas = list(CUSTOM_PERSONA_CACHE.values())
    return db_personas + cached_personas

@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.ProductCatalog).all()
    return [{"id": p.id, "name": p.name, "category": p.category, "description": p.description, "eligibility_rules": p.eligibility_rules} for p in products]

@app.put("/products/{product_id}")
def update_product(product_id: str, request: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(models.ProductCatalog).filter(models.ProductCatalog.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.name = request.name
    product.category = request.category
    product.description = request.description
    product.eligibility_rules = request.eligibility_rules
    
    db.commit()
    return {"status": "success", "product": {"id": product.id, "name": product.name, "category": product.category, "description": product.description, "eligibility_rules": product.eligibility_rules}}

from fastapi import Request

@app.post("/personas/generate")
async def generate_persona(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    prompt = data.get("prompt", "Generate a random realistic financial persona.")
    
    import os, requests
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_GROQ_API_KEY_here":
        raise HTTPException(status_code=500, detail="Cerebras API key not configured")
        
    system_prompt = f"""You are a synthetic financial data generator for the State Bank of India.
Create a realistic financial persona based on this prompt: {prompt}

Return EXACTLY this JSON structure, with no markdown formatting or extra text:
{{
  "archetype": "Short 2-word description (e.g. Young Professional)",
  "profile": {{
    "age": 30,
    "income": 1200000,
    "occupation": "Software Engineer",
    "location": "Bangalore",
    "goals": ["Buy a house", "Save for retirement"]
  }},
  "embedded_events": {{
    "salary_hike": true,
    "new_dependent": false,
    "large_deposit": false
  }}
}}"""
    try:
        response = call_llm_with_fallback([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ])
        
        if response.startswith("```json"):
            response = response[7:-3]
        elif response.startswith("```"):
            response = response[3:-3]
        
        parsed = json.loads(response.strip())
        
        import uuid
        new_persona = models.Persona(
            id=str(uuid.uuid4()),
            archetype=parsed.get("archetype", "Custom Persona"),
            profile=parsed.get("profile", {}),
            embedded_events=parsed.get("embedded_events", {})
        )
        db.add(new_persona)
        db.commit()
        
        return {"id": new_persona.id, "archetype": new_persona.archetype, "profile": new_persona.profile, "embedded_events": new_persona.embedded_events}
    except Exception as e:
        print("Cerebras Generation Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

class CustomPersonaRequest(BaseModel):
    occupation: str
    income: str
    assets: str
    city: str
    expenses: str
    demographics: str
    notes: str

@app.post("/personas/generate_custom")
async def generate_custom_persona(req: CustomPersonaRequest, db: Session = Depends(get_db)):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    # Simple simulated web scrape for cost of living (in a real app, use BeautifulSoup + requests)
    try:
        col_res = requests.get(f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&titles={req.city}&format=json").json()
        city_context = str(col_res)[:500] # just grab a snippet to prove the scrape happened
    except:
        city_context = "Could not scrape city data."

    system_prompt = """You are an expert synthetic data generator for banking personas. 
You will be provided with custom user inputs from a conversational onboarding chat and a scraped snippet about their city. 
Synthesize a comprehensive, realistic JSON persona graph. 
CRITICAL RULE: You MUST intelligently process the user's raw chat inputs into proper numeric or text data (e.g., parse "15 lakhs" into 1500000). 
CRITICAL RULE 2: If the user explicitly says 'Unknown' or leaves out a detail (e.g., they didn't provide their expenses or assets), you MUST intelligently assume a highly realistic baseline value for a person with their given occupation, income, and city. 
CRITICAL RULE 3: For ANY field where you have made an assumption or estimate that the user did not explicitly provide, you MUST append " (Assumed)" to the string value (if it's a number, convert it to a string and append it, e.g., "40000 (Assumed)").
Follow this EXACT JSON structure, adding new fields if necessary to capture their notes/assets:
{
  "archetype": "Short 2-word summary",
  "profile": {
    "age": 30,
    "income": "1200000",
    "occupation": "...",
    "location": "...",
    "cost_of_living_estimate": "40000 (Assumed)",
    "assets": ["..."],
    "goals": ["..."],
    "notes": "..."
  },
  "embedded_events": {
    "salary_hike": false
  }
}
Do not include markdown blocks, just raw JSON."""

    prompt = f"Occupation: {req.occupation}\nIncome: {req.income}\nAssets: {req.assets}\nCity: {req.city}\nScraped City Context: {city_context}\nExpenses: {req.expenses}\nDemographics: {req.demographics}\nNotes: {req.notes}"

    try:
        response = call_llm_with_fallback([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ])
        
        if response.startswith("```json"):
            response = response[7:-3]
        elif response.startswith("```"):
            response = response[3:-3]
        
        parsed = json.loads(response.strip())
        
        import uuid
        new_persona_id = str(uuid.uuid4())
        new_persona_dict = {
            "id": new_persona_id,
            "archetype": parsed.get("archetype", "Custom Persona"),
            "profile": parsed.get("profile", {}),
            "embedded_events": parsed.get("embedded_events", {})
        }
        CUSTOM_PERSONA_CACHE[new_persona_id] = new_persona_dict
        
        return new_persona_dict
    except Exception as e:
        print("Custom Generation Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

class OnboardingMessage(BaseModel):
    role: str
    content: str

class OnboardingChatRequest(BaseModel):
    messages: List[OnboardingMessage]

@app.post("/personas/onboarding-chat")
async def onboarding_chat(req: OnboardingChatRequest, db: Session = Depends(get_db)):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    system_prompt = """You are a highly conversational and polite onboarding agent for SBI EngageAI. 
Your goal is to collect the following information from the user to build their Digital Financial Twin:
1. Primary Occupation
2. Approximate Yearly Income
3. Major Assets
4. Current City
5. Estimated Monthly Expenses
6. Demographics (age, marital status, dependents)
7. Specific Financial Goals or Notes

Ask ONE question at a time. Be natural, conversational, and encouraging. If the user changes their mind or updates previous info, adapt seamlessly.

If you have collected ALL the necessary information (or if the user explicitly says they are done or don't know the rest), you MUST output a JSON object in this EXACT format and nothing else:
{
  "is_complete": true,
  "collected_data": {
    "occupation": "...",
    "income": "...",
    "assets": "...",
    "city": "...",
    "expenses": "...",
    "demographics": "...",
    "notes": "..."
  }
}

If you still need more information, output a JSON object in this EXACT format:
{
  "is_complete": false,
  "next_question": "Your conversational next question here."
}

Do not include markdown blocks, just raw JSON."""

    cerebras_messages = [{"role": "system", "content": system_prompt}]
    for m in req.messages:
        role = "assistant" if m.role == "ai" else m.role
        cerebras_messages.append({"role": role, "content": m.content})

    try:
        response_text = call_llm_with_fallback(cerebras_messages)
        if True:
            
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                response = json_match.group(0)
            else:
                response = response_text
                
            parsed = json.loads(response.strip())
        else:
            raise Exception(f"Groq API error: {res.text}")
        
        if parsed.get("is_complete"):
            # Generate the persona immediately using the gathered data
            data = parsed.get("collected_data", {})
            return await generate_custom_persona(CustomPersonaRequest(
                occupation=str(data.get("occupation", "Unknown")),
                income=str(data.get("income", "Unknown")),
                assets=str(data.get("assets", "Unknown")),
                city=str(data.get("city", "Unknown")),
                expenses=str(data.get("expenses", "Unknown")),
                demographics=str(data.get("demographics", "Unknown")),
                notes=str(data.get("notes", "Unknown"))
            ), db)
        else:
            return {"status": "asking", "question": parsed.get("next_question", "Could you tell me a bit more?")}
            
    except Exception as e:
        print("Onboarding Chat Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

class ScenarioRequest(BaseModel):
    customer_id: str
    scenario: str

@app.post("/personas/simulate")
async def simulate_scenario(req: ScenarioRequest, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == req.customer_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
        
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    system_prompt = """You are a financial twin simulator. You will receive a customer's current financial profile and a 'What if...' scenario.
Output a NEW modified JSON profile predicting the financial impact of the scenario on their income, assets, expenses, goals, and demographics.
Only output the raw JSON profile object (no markdown). Keep the structure identical to the input profile."""

    prompt = f"Current Profile: {json.dumps(persona.profile)}\nScenario: {req.scenario}"
    
    try:
        response_text = call_llm_with_fallback([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ])
        if True:
            
            # Robust JSON extraction
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                response = json_match.group(0)
            else:
                response = response_text
                
            simulated_profile = json.loads(response.strip())
            return {"original": persona.profile, "simulated": simulated_profile}
        else:
            raise Exception(f"Groq API error: {res.text}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/customers/{customer_id}/graph")
def get_customer_graph(customer_id: str, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == customer_id).first()
    
    if persona:
        archetype = persona.archetype
        profile = persona.profile
        embedded_events = persona.embedded_events
    elif customer_id in CUSTOM_PERSONA_CACHE:
        p = CUSTOM_PERSONA_CACHE[customer_id]
        archetype = p["archetype"]
        profile = p["profile"]
        embedded_events = p["embedded_events"]
    else:
        raise HTTPException(status_code=404, detail="Persona not found")
        
    return {
        "archetype": archetype,
        "profile": profile,
        "life_events": embedded_events,
        "transactions": [],
        "recommendations": []
    }

@app.put("/customers/{customer_id}/graph")
async def update_customer_graph(customer_id: str, request: Request, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == customer_id).first()
    cached_persona = CUSTOM_PERSONA_CACHE.get(customer_id)
    
    if not persona and not cached_persona:
        raise HTTPException(status_code=404, detail="Persona not found")
    
    data = await request.json()
    
    # We will operate on a dict for cached, or the object for DB
    profile = persona.profile if persona else cached_persona["profile"]
    archetype = persona.archetype if persona else cached_persona["archetype"]
    embedded_events = persona.embedded_events if persona else cached_persona["embedded_events"]
    
    if "profile" in data:
        profile = data["profile"]
        
        # Trigger an AI Re-evaluation
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            system_prompt = """You are an expert synthetic data evaluator. 
The user has manually edited their financial profile. Based ONLY on their updated profile, generate a new 'archetype' (a short 2-word summary, e.g. "Young Professional", "High Net-Worth Individual") and determine realistic 'embedded_events' (boolean flags).
CRITICAL INSTRUCTION: If the user updated their 'goals' and provided a compound goal (e.g. 'buy a bike and start a small company'), you MUST split it into distinct individual string items in a 'goals' array.
Follow this EXACT JSON structure:
{
  "archetype": "...",
  "goals": ["Buy a bike", "Start a small company"],
  "embedded_events": {
    "salary_hike": false,
    "new_dependent": false,
    "large_deposit": false
  }
}
Do not include markdown blocks, just raw JSON."""
            prompt = f"Updated Profile: {json.dumps(profile)}"
            try:
                response_text = call_llm_with_fallback([
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ])
                if True:
                    import re
                    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                    if json_match:
                        parsed = json.loads(json_match.group(0))
                        if "archetype" in parsed:
                            archetype = parsed["archetype"]
                        if "embedded_events" in parsed:
                            embedded_events = parsed["embedded_events"]
                        if "goals" in parsed:
                            profile = {**profile, "goals": parsed["goals"]}
            except Exception as e:
                print("Failed to recalculate persona:", e)

    if "life_events" in data:
        embedded_events = data["life_events"]
    if "archetype" in data:
        archetype = data["archetype"]
        
    if persona:
        persona.profile = profile
        persona.embedded_events = embedded_events
        persona.archetype = archetype
        db.commit()
    else:
        CUSTOM_PERSONA_CACHE[customer_id]["profile"] = profile
        CUSTOM_PERSONA_CACHE[customer_id]["embedded_events"] = embedded_events
        CUSTOM_PERSONA_CACHE[customer_id]["archetype"] = archetype
        
    return {"status": "success", "archetype": archetype, "life_events": embedded_events, "profile": profile}

@app.get("/customers/{customer_id}/run-agents")
async def run_agents_sse(customer_id: str, db: Session = Depends(get_db)):
    persona_row = db.query(models.Persona).filter(models.Persona.id == customer_id).first()
    cached_persona = CUSTOM_PERSONA_CACHE.get(customer_id)
    
    persona_dict = {}
    if persona_row:
        persona_dict = {
            "archetype": persona_row.archetype,
            "profile": persona_row.profile,
            "embedded_events": persona_row.embedded_events
        }
    elif cached_persona:
        persona_dict = {
            "archetype": cached_persona["archetype"],
            "profile": cached_persona["profile"],
            "embedded_events": cached_persona["embedded_events"]
        }

    async def event_generator():
        initial_state = {
            "customer_id": customer_id,
            "persona": persona_dict,
            "behavior_deltas": [],
            "life_events": [],
            "opportunities": [],
            "engagement_plan": {},
            "action_steps": [],
            "follow_up_schedule": {},
            "messages": []
        }
        
        try:
            for output in graph_app.stream(initial_state):
                for node_name, state_update in output.items():
                    messages = state_update.get("messages", [])
                    latest_msg = messages[-1] if messages else f"{node_name} completed"
                    
                    event_data = {
                        "agent": node_name,
                        "message": latest_msg,
                        "state_summary": {k: v for k, v in state_update.items() if k != "messages"}
                    }
                    yield f"data: {json.dumps(event_data)}\n\n"
                    await asyncio.sleep(1) # simulate think time
            yield f"data: {json.dumps({'agent': 'system', 'message': 'Workflow Complete'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/customers/{customer_id}/chat")
async def chat_endpoint(customer_id: str, request: ChatRequest, db: Session = Depends(get_db)):
    # Save user message
    user_msg = models.ChatMessage(customer_id=customer_id, role="user", message=request.message)
    db.add(user_msg)
    db.commit()

    persona = db.query(models.Persona).filter(models.Persona.id == customer_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    # In MVP, transactions and recommendations are mocked empty unless we seed them
    transactions = "No recent transactions found."
    recommendations = "No active recommendations."
    # Fetch catalog so AI can reference other products
    products = db.query(models.ProductCatalog).all()
    catalog_summary = "\n".join([f"- {p.name} ({p.category}): {p.description}" for p in products])

    intent_text = f"\nCurrent Conversation Intent: {request.intent.upper() if request.intent else 'GENERAL ADVICE'}\nYou must shift your personality and focus to strictly answer based on this intent."

    system_prompt = f"""You are engageAI, a proactive, helpful financial Relationship Manager for the State Bank of India.
You provide highly intelligent, context-aware answers to user queries based on their full profile.

Customer Profile:
{json.dumps(persona.profile, indent=2)}

Detected Life Events:
{json.dumps(persona.embedded_events, indent=2)}

Recent Transactions:
{transactions}

Current Recommendations:
{recommendations}

Available Product Catalog (use these if the user asks for other options):
{catalog_summary}

Before answering, you must internally consider:
1. Customer Goals
2. Detected Events
3. Current Recommendations
4. Current Products & History

{intent_text}

Every answer MUST be highly personalised to their specific demographics, income, goals, and risk appetite. NEVER give generic financial advice.

User Question:
{request.message}

IMPORTANT: You MUST respond with a valid JSON object in EXACTLY this format:
{{
  "response": "Your conversational reply to the user.",
  "reasoning": [
    "A short bullet point of why you suggested this based on their context",
    "Another point..."
  ]
}}
Ensure the output is parseable JSON (no markdown block wrappers around the JSON if possible).
"""

    llm = get_llm()
    if llm:
        try:
            # We enforce JSON output formatting
            ai_message = llm.invoke(system_prompt).content
            # Clean up markdown code blocks if the LLM adds them
            clean_json = ai_message.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:-3]
            elif clean_json.startswith("```"):
                clean_json = clean_json[3:-3]
            
            clean_json = clean_json.strip()
            result = json.loads(clean_json)
        except Exception as e:
            print("LLM parsing error:", e)
            result = {
                "response": "I encountered an error connecting to my reasoning engine.",
                "reasoning": [str(e)]
            }
    else:
        result = {
            "response": f"I am a mockup in this MVP. Once connected to Groq/Gemini, I will answer using your graph context. I see your archetype is {persona.archetype}.",
            "reasoning": [
                "Mocked reasoning execution",
                "No API keys detected in .env"
            ]
        }

    # Save assistant message
    asst_msg = models.ChatMessage(customer_id=customer_id, role="assistant", message=json.dumps(result))
    db.add(asst_msg)
    db.commit()

    return result

@app.post("/public/chat")
async def public_chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    # Fetch catalog so AI can reference products
    products = db.query(models.ProductCatalog).all()
    catalog_summary = "\n".join([f"- {p.name} ({p.category}): {p.description}" for p in products])

    system_prompt = f"""You are engageAI, a proactive, helpful financial copilot for the State Bank of India.
You provide intelligent, context-aware answers to user queries for prospective public customers who are not yet logged in.

Available Product Catalog (use these to suggest SBI products naturally when relevant):
{catalog_summary}

User Question:
{request.message}

IMPORTANT: You MUST respond with a valid JSON object in EXACTLY this format:
{{
  "response": "Your conversational reply to the user. Gently guide them towards suitable SBI products.",
  "reasoning": [
    "A short bullet point of why you suggested this",
    "Another point..."
  ]
}}
Ensure the output is parseable JSON (no markdown block wrappers around the JSON if possible).
"""

    llm = get_llm()
    if llm:
        try:
            ai_message = llm.invoke(system_prompt).content
            clean_json = ai_message.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:-3]
            elif clean_json.startswith("```"):
                clean_json = clean_json[3:-3]
            
            clean_json = clean_json.strip()
            result = json.loads(clean_json)
        except Exception as e:
            print("LLM parsing error:", e)
            result = {
                "response": "I encountered an error connecting to my reasoning engine.",
                "reasoning": [str(e)]
            }
    else:
        result = {
            "response": "I am a mockup in this MVP. Once connected to Groq/Gemini, I will answer using the public knowledge base.",
            "reasoning": [
                "Mocked reasoning execution",
                "No API keys detected in .env"
            ]
        }

    return result

@app.get("/customers/{customer_id}/chat")
def get_chat_history(customer_id: str, db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).filter(models.ChatMessage.customer_id == customer_id).order_by(models.ChatMessage.created_at.asc()).all()
    history = []
    for msg in messages:
        if msg.role == "assistant":
            try:
                parsed = json.loads(msg.message)
                history.append({
                    "role": msg.role,
                    "content": parsed.get("response", ""),
                    "reasoning": parsed.get("reasoning", [])
                })
            except:
                history.append({"role": msg.role, "content": msg.message, "reasoning": []})
        else:
            history.append({"role": msg.role, "content": msg.message})
    return history

@app.get("/health")
def health_check():
    return {"status": "ok"}
