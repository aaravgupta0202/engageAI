def life_event_detection_node(state):
    print("Running Life Event Detection...")
    persona = state.get("persona", {})
    events = persona.get("embedded_events", {})
    
    detected = []
    if "salary_hike" in events:
        detected.append({"event_type": "Salary Hike", "confidence": 0.88, "reasoning": "Increase confidence above the single-month noise threshold."})
    elif "new_job" in events:
        detected.append({"event_type": "New Job", "confidence": 0.92, "reasoning": "Treat as employer change, not income loss."})
    else:
        detected.append({"event_type": "None", "confidence": 1.0, "reasoning": "No significant life events detected."})
        
    messages = state.get("messages", [])
    messages.append(f"Agent 2 (Life Event Detection) completed: Detected {len(detected)} events.")
    
    return {"life_events": detected, "messages": messages}
