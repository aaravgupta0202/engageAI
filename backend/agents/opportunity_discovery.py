def opportunity_discovery_node(state):
    print("Running Opportunity Discovery...")
    life_events = state.get("life_events", [])
    
    opportunities = []
    for event in life_events:
        if event["event_type"] == "Salary Hike":
            opportunities.append({
                "product": "Mutual Fund SIP",
                "fit_score": 0.81,
                "rationale": "Higher surplus capacity, no current SIP top-up",
                "urgency": "Medium"
            })
        elif event["event_type"] == "New Job":
            opportunities.append({
                "product": "EPF Transfer",
                "fit_score": 0.95,
                "rationale": "Possible break in EPF continuity",
                "urgency": "High"
            })
            
    messages = state.get("messages", [])
    messages.append(f"Agent 3 (Opportunity Discovery) completed: Found {len(opportunities)} opportunities.")
    
    return {"opportunities": opportunities, "messages": messages}
