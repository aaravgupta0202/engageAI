import json
from llm_adapter import get_llm

def behavior_analyzer_node(state):
    print("Running Behavior Analyzer...")
    persona = state.get("persona", {})
    graph = state.get("graph", {})
    
    deltas = []
    messages = state.get("messages", [])
    
    llm = get_llm("reasoning")
    if llm:
        prompt = f"""You are a financial behavior analyst.
Given the customer persona and their financial graph, identify 1 to 2 key behavioral insights or 'deltas' (changes in behavior).
Focus on their occupation, income level, and stated goals.

Persona: {json.dumps(persona)}
Graph: {json.dumps(graph)}

Output EXACTLY a JSON array of strings representing the behavior deltas. Keep them concise (1 sentence each).
Do NOT wrap the output in markdown blocks. Just pure JSON array.
"""
        try:
            res = llm.invoke(prompt)
            content = str(res.content).strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            deltas = json.loads(content.strip())
        except Exception as e:
            print(f"LLM Error in Behavior Analyzer: {e}")
            deltas = []

    if not deltas:
        # Smart fallback based on persona
        occupation = persona.get("demographics", {}).get("occupation", "").lower()
        income_str = persona.get("demographics", {}).get("income", "0")
        income = int(str(income_str).replace('₹', '').replace(',', '').strip() or 0)
        
        if "business" in occupation or "owner" in occupation:
            if income > 1000000:
                deltas.append("Monthly business revenue is stable with high disposable income.")
                deltas.append("Strong saving capacity and consistent surplus detected.")
            else:
                deltas.append("Business cash flow shows seasonal variance but steady baseline.")
        else:
            if income > 1500000:
                deltas.append("Consistent high salary credits with increasing discretionary spend.")
            elif income > 500000:
                deltas.append("Regular salary credits with steady savings rate.")
            else:
                deltas.append("Stable monthly income with tight budget optimization.")

    messages.append("Agent 1 (Behavior Analyzer) completed: Identified behavior deltas.")
    
    return {"behavior_deltas": deltas, "messages": messages}
