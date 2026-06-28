"""
FastAPI Backend Application

Orchestrates the engageAI backend services, exposing endpoints for:
- Persona generation (via Cerebras)
- Agent execution (LangGraph streamed via SSE)
- Chat interactions and recommendations
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
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
    if db.query(models.ProductCatalog).count() < 10:
        print("Auto-seeding database because catalog has less than 10 products...")
        import seed
        seed.seed_data()

graph_app = create_graph()

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sbiengageai.netlify.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ProductUpdate(BaseModel):
    name: str
    category: str
    description: str
    eligibility_rules: dict

@app.get("/personas")
def get_personas(db: Session = Depends(get_db)):
    personas = db.query(models.Persona).all()
    return [{"id": p.id, "archetype": p.archetype, "profile": p.profile, "embedded_events": p.embedded_events} for p in personas]

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
    api_key = os.getenv("CEREBRAS_API_KEY")
    if not api_key or api_key == "your_cerebras_api_key_here":
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
        res = requests.post(
            "https://api.cerebras.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "gpt-oss-120b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ]
            }
        )
        if not res.ok:
            raise Exception(f"Cerebras API error: {res.text}")
            
        response = res.json()["choices"][0]["message"]["content"].strip()
        
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

@app.get("/customers/{customer_id}/graph")
def get_customer_graph(customer_id: str, db: Session = Depends(get_db)):
    persona = db.query(models.Persona).filter(models.Persona.id == customer_id).first()
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")
        
    return {
        "archetype": persona.archetype,
        "profile": persona.profile,
        "life_events": persona.embedded_events,
        "transactions": [],
        "recommendations": []
    }

@app.get("/customers/{customer_id}/run-agents")
async def run_agents_sse(customer_id: str, db: Session = Depends(get_db)):
    persona_row = db.query(models.Persona).filter(models.Persona.id == customer_id).first()
    persona_dict = {}
    if persona_row:
        persona_dict = {
            "archetype": persona_row.archetype,
            "profile": persona_row.profile,
            "embedded_events": persona_row.embedded_events
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

    system_prompt = f"""You are engageAI, a proactive, helpful financial copilot for the State Bank of India.
You provide intelligent, context-aware answers to user queries.

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
