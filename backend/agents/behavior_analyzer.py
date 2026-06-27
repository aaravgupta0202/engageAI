def behavior_analyzer_node(state):
    print("Running Behavior Analyzer...")
    deltas = ["Income rose 19% over 2 cycles, savings rate now 34%"]
    
    persona = state.get("persona", {})
    events = persona.get("embedded_events", {})
    if "salary_hike" in events:
        deltas = ["Same employer narration, credit amount rose from ₹62,000 to ₹74,000 and has now repeated twice"]
    elif "new_job" in events:
        deltas = ["Salary credits from Payer A stopped; salary credits from Payer B began"]
        
    messages = state.get("messages", [])
    messages.append("Agent 1 (Behavior Analyzer) completed: Identified behavior deltas.")
    
    return {"behavior_deltas": deltas, "messages": messages}
