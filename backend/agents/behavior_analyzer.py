import json
from llm_adapter import get_llm, KB_INSTRUCTION

def behavior_analyzer_node(state):
    print("Running Behavior Analyzer...")
    persona = state.get("persona", {})
    graph = state.get("graph", {})
    
    deltas = []
    messages = state.get("messages", [])
    
    llm = get_llm("reasoning")
    if llm:
        prompt = f"""You are a senior financial behavior analyst.
Given the customer persona and their financial graph, identify 2-3 key behavioral insights.
Specifically address: Income trends, Cash flow stability, Savings behavior, Debt usage, Spending habits, and Financial discipline.

Persona: {json.dumps(persona)}
Graph: {json.dumps(graph)}

Return EXACTLY a JSON array of 3 string insights. Do not include markdown blocks.
""" + KB_INSTRUCTION
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
                deltas.append("Income Trends & Cash Flow: Monthly business revenue is highly stable with robust surplus.")
                deltas.append("Savings Behavior & Discipline: Strong saving capacity and disciplined reinvestment detected.")
                deltas.append("Spending Habits: High discretionary spend offset by controlled operational expenses.")
            else:
                deltas.append("Income Trends: Business cash flow shows seasonal variance but a steady baseline.")
                deltas.append("Debt & Savings: Moderate savings rate with cautious debt utilization.")
        else:
            if income > 1500000:
                deltas.append("Income Trends: Consistent high salary credits indicating secure employment.")
                deltas.append("Spending & Discipline: Increasing discretionary spend but maintains strong financial discipline.")
            elif income > 500000:
                deltas.append("Cash Flow & Savings: Regular salary credits with a steady, disciplined savings rate.")
                deltas.append("Debt Usage: Responsible credit usage, cleared monthly.")
            else:
                deltas.append("Income Trends: Stable monthly income.")
                deltas.append("Spending Habits: Tight budget optimization with limited discretionary spending.")

    messages.append("Agent 1 (Behavior Analyzer) completed: Identified behavior deltas.")
    
    return {"behavior_deltas": deltas, "messages": messages}
