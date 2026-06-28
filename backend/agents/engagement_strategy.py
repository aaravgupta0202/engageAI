import json
from llm_adapter import get_llm

def engagement_strategy_node(state):
    print("Running Engagement Strategy...")
    opportunities = state.get("opportunities", [])
    persona = state.get("persona", {})
    
    plan = {}
    messages = state.get("messages", [])
    
    if opportunities:
        top_opp = opportunities[0]
        product_name = top_opp.get('product', 'Product')
        goals = " ".join(persona.get("goals", [])).lower()
        
        llm = get_llm("reasoning")
        message_draft = ""
        
        if llm:
            prompt = f"""You are an SBI customer engagement AI.
Draft a short, natural in-app message (1 sentence) offering the product "{product_name}" to the customer based on their goals.
Customer Goals: {goals}

Do NOT use placeholders like [Name]. Output just the message text.
"""
            try:
                res = llm.invoke(prompt)
                message_draft = str(res.content).strip().replace('"', '')
            except Exception as e:
                print(f"LLM Error in Engagement Strategy: {e}")
                
        if not message_draft:
            if goals:
                message_draft = f"Based on your long-term goals of {goals}, here is a financial opportunity that may be relevant: {product_name}."
            else:
                message_draft = f"Noticed your recent activity — want to explore {product_name}?"
                
        plan = {
            "opportunity": product_name,  # Fix: pass string instead of object
            "channel": "in-app chat-initiated card",
            "tone": "advisory",
            "timing": "next app open",
            "message_draft": message_draft
        }
        
    messages.append("Agent 4 (Engagement Strategy) completed: Drafted engagement plan.")
    
    return {"engagement_plan": plan, "messages": messages}
