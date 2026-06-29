import json
from llm_adapter import get_llm, KB_INSTRUCTION

def follow_up_node(state):
    print("Running Follow-up...")
    plan = state.get("engagement_plan", {})
    
    follow_up = {}
    messages = state.get("messages", [])
    
    if plan:
        product = plan.get("opportunity", "Product")
        
        llm = get_llm("reasoning")
        condition = ""
        if llm:
            prompt = f"Given the product '{product}', write a short (5-10 word) condition for the follow-up check. E.g. for Retirement Fund: 'Review retirement investment progress after 30 days.' Do not wrap in quotes." + KB_INSTRUCTION
            try:
                res = llm.invoke(prompt)
                condition = str(res.content).strip().replace('"', '')
            except Exception:
                pass
                
        if not condition:
            condition = f"Review {product} progress after 30 days"
            
        follow_up = {
            "due_at": "30 days from now",
            "status": "scheduled",
            "reason": condition
        }
        
    messages.append("Agent 6 (Follow-up) completed: Scheduled follow-up logic.")
    
    return {"follow_up_schedule": follow_up, "messages": messages}
