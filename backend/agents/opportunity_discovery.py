import json
from database import SessionLocal
from models import ProductCatalog
from llm_adapter import get_llm

def opportunity_discovery_node(state):
    print("Running Opportunity Discovery...")
    life_events = state.get("life_events", [])
    graph = state.get("graph", {})
    persona = state.get("persona", {})
    
    opportunities = []
    
    # Filter out "None" events
    actual_events = [e for e in life_events if e.get("event_type") != "None"]
    
    if not actual_events:
        messages = state.get("messages", [])
        messages.append("Agent 3 (Opportunity Discovery): No significant life events detected. Recommending general baseline products based on demographic and income profile.")
        state["messages"] = messages

    if not llm:
        # Fallback if no LLM - use persona to make a smart guess
        occupation = persona.get("demographics", {}).get("occupation", "").lower()
        age = int(persona.get("demographics", {}).get("age", 30))
        goals = " ".join(persona.get("goals", [])).lower()
        income_str = persona.get("demographics", {}).get("income", "0")
        
        base_factors = [
            f"✓ Occupation: {occupation.title()}",
            f"✓ Goals: {goals}",
            f"✓ Age: {age}",
        ]
        
        for event in actual_events:
            event_type = event.get("event_type", "").lower()
            if "hike" in event_type or "job" in event_type:
                opportunities.append({
                    "product": "SBI Mutual Fund SIP",
                    "fit_score": 0.88,
                    "rationale": f"Detected {event_type}. Great time to increase wealth accumulation.",
                    "why_this": "A SIP allows you to steadily build wealth with your increased cash flow.",
                    "benefits": "Disciplined saving, rupee cost averaging, and long-term compounding.",
                    "why_now": f"Because you recently experienced a {event_type}.",
                    "eligibility": "Resident Indian, KYC compliant.",
                    "impact": "Potential for significant long-term wealth generation.",
                    "factors": base_factors + [f"✓ Event: {event_type}"],
                    "urgency": "Medium"
                })
        
        if not opportunities:
            if "business" in occupation or "owner" in occupation or "expand business" in goals:
                opportunities.append({
                    "product": "SME Business Loan",
                    "fit_score": 0.94,
                    "rationale": "Based on your business ownership and expansion goals, this can provide necessary capital.",
                    "why_this": "Because your primary goal is business expansion and you maintain a strong income, this loan is well suited.",
                    "benefits": "Flexible repayment, quick disbursement, preserves working capital.",
                    "why_now": "Capitalizing on current market stability to scale your business.",
                    "eligibility": "Business vintage > 3 years, healthy credit score.",
                    "impact": "Can boost business operational capacity by up to 40%.",
                    "factors": base_factors + ["✓ Strong Cash Flow", "✓ High Income"],
                    "urgency": "High"
                })
            elif age > 50 or "retirement" in goals:
                opportunities.append({
                    "product": "SBI Retirement Benefit Fund",
                    "fit_score": 0.89,
                    "rationale": "Aligned with your focus on securing a comfortable retirement.",
                    "why_this": "Tailored specifically for individuals aiming for long-term retirement corpus creation.",
                    "benefits": "Tax benefits under 80C, diversified low-risk portfolio.",
                    "why_now": "The earlier you invest, the larger your retirement corpus will compound.",
                    "eligibility": "Age < 60, valid PAN.",
                    "impact": "Ensures financial independence post-retirement.",
                    "factors": base_factors + ["✓ Nearing Retirement Age"],
                    "urgency": "High"
                })
            else:
                opportunities.append({
                    "product": "SBI Mutual Fund SIP",
                    "fit_score": 0.75,
                    "rationale": "General baseline recommendation for wealth accumulation.",
                    "why_this": "An easy and effective way to start investing in the equity market.",
                    "benefits": "Professional management, liquidity, flexibility.",
                    "why_now": "Market conditions are favorable for long-term SIP initiation.",
                    "eligibility": "KYC verified account.",
                    "impact": "Helps beat inflation over the long term.",
                    "factors": base_factors,
                    "urgency": "Low"
                })
    else:
        # Fetch catalog from DB
        db = SessionLocal()
        products = db.query(ProductCatalog).all()
        db.close()
        
        catalog_summary = []
        for p in products:
            catalog_summary.append(f"- ID: {p.id} | Name: {p.name} | Category: {p.category} | Desc: {p.description}")
            
        catalog_text = "\n".join(catalog_summary)
        
        prompt = f"""You are an expert banking recommendation engine for State Bank of India (SBI).
Given the customer's financial graph, their persona, and recent life events (if any), select the top 3-5 best product recommendations from the catalog.

You MUST prioritize and rank your recommendations strictly in this order of importance:
1. Customer Goals
2. Detected Life Events
3. Occupation
4. Income & Affordability
5. Risk Appetite
6. Existing Products
7. Spending Behaviour
8. Age

Do NOT recommend products simply because they exist. Every recommendation must be justified.
The LLM should NEVER invent products, ONLY use the ones from the catalog provided.

Customer Persona: {json.dumps(persona)}
Customer Graph: {json.dumps(graph)}
Life Events: {json.dumps(actual_events)}

Available Products:
{catalog_text}

Output EXACTLY a JSON array of objects with these keys:
- "product": (string) the exact name of the product chosen from the catalog.
- "fit_score": (float) a score between 0.0 and 1.0 representing how well it fits based on weighted priority.
- "rationale": (string) Short overview.
- "why_this": (string) Explaining why we recommend this product specifically.
- "benefits": (string) Key benefits for them.
- "why_now": (string) Why they should act on it now.
- "eligibility": (string) Brief eligibility criteria.
- "impact": (string) Estimated financial impact.
- "factors": (array of strings) An array of 3-5 bullet points proving explainability (e.g., ["✓ Business Owner", "✓ Goal: Business Expansion", "✓ Annual Income ₹18L"]).
- "urgency": (string) Low, Medium, or High

Do NOT wrap the output in markdown blocks. Just pure JSON array.
"""
        try:
            res = llm.invoke(prompt)
            content = str(res.content).strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            opportunities = json.loads(content.strip())
            
            # Sort by fit_score descending
            opportunities = sorted(opportunities, key=lambda x: float(x.get("fit_score", 0)), reverse=True)
        except Exception as e:
            print(f"LLM Error in Opportunity Discovery: {e}")
            opportunities = []

    messages = state.get("messages", [])
    
    if not opportunities:
        opportunities.append({
            "product": "SBI Mutual Fund SIP",
            "fit_score": 0.75,
            "rationale": "General baseline recommendation for wealth accumulation based on your demographic profile.",
            "why_this": "An easy and effective way to start investing in the equity market.",
            "benefits": "Professional management, liquidity, flexibility.",
            "why_now": "Market conditions are favorable for long-term SIP initiation.",
            "eligibility": "KYC verified account.",
            "impact": "Helps beat inflation over the long term.",
            "factors": ["✓ Baseline Recommendation", "✓ Wealth Accumulation"],
            "urgency": "Low"
        })
        messages.append("Agent 3 (Opportunity Discovery): Appended baseline recommendation.")

    messages.append(f"Agent 3 (Opportunity Discovery) completed: Found {len(opportunities)} opportunities using LLM.")
    
    return {"opportunities": opportunities, "messages": messages}
