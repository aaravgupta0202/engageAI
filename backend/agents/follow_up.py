def follow_up_node(state):
    print("Running Follow-Up...")
    steps = state.get("action_steps", [])
    
    schedule = {}
    if steps:
        schedule = {
            "due_at": "30 days from now",
            "status": "scheduled",
            "reason": "Check if top-up holds."
        }
        
    messages = state.get("messages", [])
    messages.append("Agent 6 (Follow-Up) completed: Scheduled future check-in.")
    
    return {"follow_up_schedule": schedule, "messages": messages}
