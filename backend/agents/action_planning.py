def action_planning_node(state):
    print("Running Action Planning...")
    plan = state.get("engagement_plan", {})
    
    steps = []
    if plan:
        steps = [
            {"step_number": 1, "description": "Confirm amount", "status": "pending"},
            {"step_number": 2, "description": "Select existing fund or open new", "status": "pending"},
            {"step_number": 3, "description": "Mock execute via Action Center", "status": "pending"},
            {"step_number": 4, "description": "Schedule confirmation", "status": "pending"}
        ]
        
    messages = state.get("messages", [])
    messages.append("Agent 5 (Action Planning) completed: Generated action steps.")
    
    return {"action_steps": steps, "messages": messages}
