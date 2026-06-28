import json
from llm_adapter import get_llm

def action_planning_node(state):
    print("Running Action Planning...")
    plan = state.get("engagement_plan", {})
    
    steps = []
    messages = state.get("messages", [])
    
    if plan:
        product = plan.get("opportunity", "Product")
        
        llm = get_llm("reasoning")
        if llm:
            prompt = f"""You are an SBI customer action planner.
Given the target product "{product}", generate exactly 3-4 actionable steps for the customer to finalize the setup.
Output EXACTLY a JSON array of objects with keys: "step_number" (int), "description" (string), "status" (string, always "pending").
Do NOT wrap the output in markdown blocks. Just pure JSON array.
"""
            try:
                res = llm.invoke(prompt)
                content = str(res.content).strip()
                if content.startswith("```json"):
                    content = content[7:-3]
                elif content.startswith("```"):
                    content = content[3:-3]
                steps = json.loads(content.strip())
            except Exception as e:
                print(f"LLM Error in Action Planning: {e}")
                steps = []
                
        if not steps:
            steps = [
                {"step_number": 1, "description": f"Explore {product} eligibility", "status": "pending"},
                {"step_number": 2, "description": "Review terms and confirm amount", "status": "pending"},
                {"step_number": 3, "description": "Execute via Action Center", "status": "pending"},
                {"step_number": 4, "description": "Schedule confirmation", "status": "pending"}
            ]
        
    messages.append("Agent 5 (Action Planning) completed: Generated action steps.")
    
    return {"action_steps": steps, "messages": messages}
