import json
import uuid
import datetime
from database import SessionLocal
from models import ProductCatalog
from llm_adapter import get_llm, KB_INSTRUCTION

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

    llm = get_llm("reasoning")
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
        import os
        catalog_path = os.path.join(os.path.dirname(__file__), "..", "catalog.json")
        try:
            with open(catalog_path, "r") as f:
                products = json.load(f)
        except Exception as e:
            print("Failed to load live catalog, using empty list:", e)
            products = []
            
        catalog_summary = []
        for p in products:
            desc = p.get("description", "")
            url = p.get("url", "")
            catalog_summary.append(f"- Name: {p.get('name')} | Category: {p.get('category')} | Desc: {desc} | URL: {url}")
            
        verve_path = os.path.join(os.path.dirname(__file__), "..", "..", "verve_investment_guide.txt")
        try:
            with open(verve_path, "r") as f:
                verve_rules = f.read()
        except Exception:
            verve_rules = "No Verve rules found."
            
        catalog_text = "\n".join(catalog_summary)
        
        # Goal Dependency Logic
        profile_data = persona.get("profile", {})
        
        try:
            income = float(profile_data.get("income") or 0)
            expenses = float(profile_data.get("cost_of_living_estimate") or (income * 0.5) or 0)
            
            assets = 0
            raw_assets = profile_data.get("assets", [])
            if isinstance(raw_assets, list):
                import re
                for a in raw_assets:
                    match = re.search(r'\d+', str(a))
                    if match:
                        assets += float(match.group())
            elif isinstance(raw_assets, str) or isinstance(raw_assets, int) or isinstance(raw_assets, float):
                import re
                match = re.search(r'\d+', str(raw_assets))
                if match:
                    assets = float(match.group())
            else:
                assets = income * 2
                
            emergency_fund_complete = expenses > 0 and assets >= (expenses * 6)
        except:
            emergency_fund_complete = True
            
        goal_dependency_rules = ""
        if not emergency_fund_complete:
            goal_dependency_rules = "CRITICAL GOAL DEPENDENCY: The customer's Emergency Fund is NOT complete (less than 6 months of expenses). You MUST prioritize liquid savings and fixed deposit products over aggressive equity investments or long-term lock-ins, regardless of their other goals."
        else:
            goal_dependency_rules = "GOAL DEPENDENCY: The customer's Emergency Fund IS complete. You may freely recommend aggressive investments and long-term products based on their goals."
        
        prompt = f"""You are an expert banking recommendation engine for State Bank of India (SBI).
Given the customer's financial graph, their persona, and recent life events, select the top 3-5 best product recommendations from the catalog.

You MUST STRICTLY adhere to the Verve Investment Rules provided below.
Prioritize your recommendations in this order:
1. Goal Dependencies (e.g. Emergency Fund)
2. Verve Investment Rules (Age-based % allocations and limits)
3. Customer Goals
4. Detected Life Events
5. Income & Affordability

{goal_dependency_rules}

VERVE INVESTMENT RULES:
{verve_rules}

The LLM should NEVER invent products, ONLY use the ones from the catalog provided. Ensure you include the exact URL of the product.

Customer Persona: {json.dumps(persona)}
Customer Graph: {json.dumps(graph)}
Life Events: {json.dumps(actual_events)}

Available Products:
{catalog_text}

Output EXACTLY a JSON array of objects with these keys:
- "product": (string) the exact name of the product chosen from the catalog.
- "url": (string) the exact URL of the product from the catalog.
- "fit_score": (float) a score between 0.0 and 1.0 representing how well it fits based on Verve Rules and persona.
- "rationale": (string) Short overview.
- "why_this": (string) Explaining why we recommend this product specifically based on Verve Rules.
- "benefits": (string) Key benefits for them.
- "why_now": (string) Why they should act on it now.
- "eligibility": (string) Brief eligibility criteria.
- "impact": (string) Estimated financial impact.
- "factors": (array of strings) An array of 3-5 bullet points proving explainability (e.g., ["✓ Fits Verve Rule for 31-35 Age Health 4%", "✓ Life Event Detected", "✓ Meets Home Goal"]).
- "urgency": (string) Low, Medium, or High

Do NOT wrap the output in markdown blocks. Just pure JSON array.
""" + KB_INSTRUCTION
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
