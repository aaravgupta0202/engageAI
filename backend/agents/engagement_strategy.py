def engagement_strategy_node(state):
    print("Running Engagement Strategy...")
    opportunities = state.get("opportunities", [])
    
    plan = {}
    if opportunities:
        top_opp = opportunities[0]
        plan = {
            "opportunity": top_opp,
            "channel": "in-app chat-initiated card",
            "tone": "advisory",
            "timing": "next app open",
            "message_draft": f"Noticed your recent change — want to put part of that toward {top_opp['product']}?"
        }
        
    messages = state.get("messages", [])
    messages.append("Agent 4 (Engagement Strategy) completed: Drafted engagement plan.")
    
    return {"engagement_plan": plan, "messages": messages}
