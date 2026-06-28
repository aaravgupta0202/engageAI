import json
from database import SessionLocal
from models import ProductCatalog
from llm_adapter import get_llm

def opportunity_discovery_node(state):
    print("Running Opportunity Discovery...")
    life_events = state.get("life_events", [])
    graph = state.get("graph", {})
    persona = state.get("persona", {})
    
    opportunities = []
    
    # Filter out "None" events
    actual_events = [e for e in life_events if e.get("event_type") != "None"]
    
    if not actual_events:
        messages = state.get("messages", [])
        messages.append("Agent 3 (Opportunity Discovery): No significant life events detected. Recommending general baseline products based on demographic and income profile.")
        state["messages"] = messages

    llm = get_llm("reasoning")
    if not llm:
        # Fallback if no LLM - use persona to make a smart guess
        occupation = persona.get("demographics", {}).get("occupation", "").lower()
        age = int(persona.get("demographics", {}).get("age", 30))
        goals = " ".join(persona.get("goals", [])).lower()
        
        for event in actual_events:
            event_type = event.get("event_type", "").lower()
            if "hike" in event_type or "job" in event_type:
                opportunities.append({
                    "product": "SBI Mutual Fund SIP",
                    "fit_score": 0.88,
                    "rationale": f"Detected {event_type}. Great time to increase wealth accumulation.",
                    "urgency": "Medium"
                })
        
        if not opportunities:
            if "business" in occupation or "owner" in occupation or "expand business" in goals:
                opportunities.append({
                    "product": "SME Business Loan",
                    "fit_score": 0.92,
                    "rationale": "Based on your business ownership and expansion goals, this can provide necessary capital.",
                    "urgency": "High"
                })
            elif age > 50 or "retirement" in goals:
                opportunities.append({
                    "product": "SBI Retirement Benefit Fund",
                    "fit_score": 0.89,
                    "rationale": "Aligned with your focus on securing a comfortable retirement.",
                    "urgency": "High"
                })
            else:
                opportunities.append({
                    "product": "SBI Mutual Fund SIP",
                    "fit_score": 0.75,
                    "rationale": "General baseline recommendation for wealth accumulation based on your profile.",
                    "urgency": "Low"
                })
    else:
        # Fetch catalog from DB
        db = SessionLocal()
        products = db.query(ProductCatalog).all()
        db.close()
        
        catalog_summary = []
        for p in products:
            catalog_summary.append(f"- ID: {p.id} | Name: {p.name} | Category: {p.category} | Desc: {p.description}")
            
        catalog_text = "\n".join(catalog_summary)
        
        prompt = f"""You are an expert banking recommendation engine for State Bank of India (SBI).
Given the customer's financial graph, their persona (including goals and demographics), and recent life events (if any), select the top 1-3 best product recommendations from the catalog.
If there are no life events, suggest the best baseline products based on their age, income, and specifically their STATED GOALS.

Customer Persona: {json.dumps(persona)}
Customer Graph: {json.dumps(graph)}
Life Events: {json.dumps(actual_events)}

Available Products:
{catalog_text}

Output EXACTLY a JSON array of objects with these keys:
- "product": (string) the exact name of the product chosen
- "fit_score": (float) a score between 0.0 and 1.0 representing how well it fits
- "rationale": (string) a short explanation of why this fits based on graph and events
- "urgency": (string) Low, Medium, or High

Do NOT wrap the output in markdown blocks. Just pure JSON array.
"""
        try:
            res = llm.invoke(prompt)
            content = str(res.content).strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            opportunities = json.loads(content.strip())
            
            # Sort by fit_score descending
            opportunities = sorted(opportunities, key=lambda x: float(x.get("fit_score", 0)), reverse=True)
        except Exception as e:
            print(f"LLM Error in Opportunity Discovery: {e}")
            opportunities = []

    messages = state.get("messages", [])
    
    if not opportunities:
        opportunities.append({
            "product": "SBI Mutual Fund SIP",
            "fit_score": 0.75,
            "rationale": "General baseline recommendation for wealth accumulation based on your demographic profile.",
            "urgency": "Low"
        })
        messages.append("Agent 3 (Opportunity Discovery): Appended baseline recommendation.")

    messages.append(f"Agent 3 (Opportunity Discovery) completed: Found {len(opportunities)} opportunities using LLM.")
    
    return {"opportunities": opportunities, "messages": messages}
