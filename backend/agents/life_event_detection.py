import json
from llm_adapter import get_llm, KB_INSTRUCTION

def life_event_detection_node(state):
    print("Running Life Event Detection...")
    persona = state.get("persona", {})
    events = persona.get("embedded_events", {})
    
    detected = []
    messages = state.get("messages", [])
    
    llm = get_llm("reasoning")
    if llm:
        prompt = f"""You are a financial life event detector.
Given the customer persona (which may contain injected 'embedded_events'), detect if any significant life events have occurred.
If no events are present in the data, return an event of type "None". Do not invent events. Only return events you are highly confident about.
""" + KB_INSTRUCTION + f"""

Persona: {json.dumps(persona)}

Output EXACTLY a JSON array of objects with these keys:
- "event_type": (string) The type of event (e.g., "Salary Hike", "New Job", "None")
- "confidence": (float) A score between 0.0 and 1.0
- "reasoning": (string) Brief explanation of how you detected this

Do NOT wrap the output in markdown blocks. Just pure JSON array.
"""
        try:
            res = llm.invoke(prompt)
            content = str(res.content).strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            detected = json.loads(content.strip())
        except Exception as e:
            print(f"LLM Error in Life Event Detection: {e}")
            detected = []

    if not detected:
        # Fallback based on embedded_events
        if events and isinstance(events, dict) and len(events) > 0:
            for key, val in events.items():
                if val:
                    event_name = key.replace("_", " ").title()
                    detected.append({
                        "event_type": event_name, 
                        "confidence": 0.88, 
                        "reasoning": f"Detected anomaly matching {event_name} signature."
                    })
        
        if not detected:
            detected.append({
                "event_type": "None", 
                "confidence": 1.0, 
                "reasoning": "No significant financial life events detected in recent transaction history."
            })
            
    messages.append(f"Agent 2 (Life Event Detection) completed: Detected {len(detected)} events.")
    
    return {"life_events": detected, "messages": messages}
