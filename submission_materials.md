# SBI Hackathon Submission Materials

## 1. Brief Description of the Idea
SBI EngageAI is an autonomous, multi-agent AI layer that continuously analyzes customer financial behavior, detects life events as they happen, and proactively engages customers with reasoned, relevant recommendations — turning every customer interaction from a request-response transaction into an ongoing, advisory relationship.

## 2. Proposed Solution
A six-agent LangGraph system (Financial Behavior Analyzer, Life Event Detection, Opportunity Discovery, Engagement Strategy, Action Planning, and Follow-Up agents) operates on a continuously evolving Financial Life Graph per customer. The system detects events such as salary hikes, marriage, child birth, relocation, and home-purchase intent from transaction patterns, reasons about the resulting financial opportunity, and proactively delivers a recommendation through the right channel and tone — with every step of that reasoning visible and explainable to the customer. Demonstrated on a Synthetic Customer Generator producing six realistic personas with embedded, ground-truth life events.

## 3. Business Model / Commercial Potential
Revenue is generated indirectly through increased cross-sell conversion and CLV (Customer Lifetime Value) uplift on SBI’s existing product catalog (no new product manufacturing required). Secondary value comes from reduced call-center/branch load for routine advisory queries and reuse of the Synthetic Customer Generator for internal QA and staff training.

## 4. Technology Stack Details
- **Frontend:** React + TypeScript + Tailwind CSS (Component-driven architecture)
- **Backend:** FastAPI (Python) with Server-Sent Events (SSE) for live streaming
- **Orchestration:** LangGraph (Six-node sequential agent graph)
- **LLM Provider:** Groq/Cerebras/Gemini (used for reasoning, synthetic generation, and chat)
- **Database:** PostgreSQL (Customer graph stored as JSONB, transactions, audit trails)
- **Vector Database:** Local/Chroma (Embeddings of product catalog for semantic opportunity matching)
- **Deployment:** Netlify (Frontend) / Render/AWS (Backend)

## 5. Process Flow / Architecture
Transaction stream → Behavior Analyzer Agent → Life Event Detection Agent → Opportunity Discovery Agent → Engagement Strategy Agent → Customer Touchpoint → Action Planning Agent (on acceptance) → Follow-Up Agent (closes the loop, re-enters the cycle). 

A FastAPI backend orchestrates this six-node LangGraph against a PostgreSQL-backed Financial Life Graph. The React frontend streams live agent reasoning via Server-Sent Events into a dedicated Agent Activity Center, making the system’s reasoning auditable and demo-able in real time.

## 6. GitHub Repo Link
https://github.com/aaravgupta0202/engageAI

## 7. Demo Video Link
[INSERT YOUR YOUTUBE/VIMEO LINK HERE]

---

# Idea Deck (Instructions for Claude)
**Prompt to give Claude to generate your pitch deck:**

> "I am participating in the SBI Agentic AI Hackathon @ GFF 2026. The theme is 'Agentic AI & Emerging Tech' and the problem statement is 'Digital Engagement'. I built a project called 'SBI EngageAI - Your Financial Copilot'. It's an autonomous AI layer that monitors banking data, detects life events (like salary hikes), and triggers a 6-agent LangGraph pipeline to proactively recommend SBI products and create action plans. It shifts banking from 'reactive' to 'proactive'. Please generate a 12-slide Pitch Deck presentation script/outline based on this. The slides should cover: 1. Title, 2. The Problem (Banking is reactive), 3. Our Insight, 4. The Product (6 autonomous agents), 5. Life Event Detection, 6. The 6 Agents Pipeline, 7. Demo Transition, 8. Engagement/Adoption, 9. Architecture (FastAPI, React, LangGraph, Postgres), 10. Business Impact (Cross-sell, Retention), 11. Differentiators (Why it beats a normal chatbot), 12. Ask/Close."

---

# Demo Video Script & Guide (3 Minutes)

**0:00–0:25 — Setup & Intro**
- **What to display:** The Landing Page.
- **What to do:** Briefly show the landing page, scroll to "Architecture" or "Capabilities" to show depth, then click "Try Demo" and land on the Customer Generator page.
- **What to say:** "This is SBI EngageAI. We’re not showing you a simple chatbot — we’re showing you an autonomous AI that notices things about customers before they even open the app. Let's select the 'Young Professional' persona."

**0:25–0:50 — Customer Context**
- **What to display:** Customer Dashboard.
- **What to do:** Point at the income trend tile and the Financial Life Graph. Quickly scroll through the transaction ledger, pausing on the recent salary credits.
- **What to say:** "Eight months into her first job, here’s her transaction history and Financial Graph. Notice these larger recent salary credits. Let's see what the AI makes of it."

**0:50–1:30 — Launch & Life Event Detection**
- **What to display:** Agent Activity Center.
- **What to do:** Click “Run AI Engagement Cycle.” Watch the agents stream their reasoning.
- **What to say:** "When we run the pipeline, 6 specialized LangGraph agents sequence together. Agent 1 summarizes the behavior. Agent 2 detects a 'Salary Hike' with high confidence. The system just did, in seconds, what a human relationship manager would do when reviewing a printed statement."

**1:30–2:05 — Reasoning Chain & Recommendation**
- **What to display:** Agent Activity Center finishing -> Recommendations Center.
- **What to do:** Let the full reasoning chain render. Click into the Recommendations Center to show the SIP top-up card.
- **What to say:** "Because income increased, Agent 3 calculates savings capacity, Agent 4 decides the best engagement strategy, and it delivers a highly relevant recommendation: A Mutual Fund SIP Top-up."

**2:05–2:35 — Chat & Action**
- **What to display:** AI Chat -> Action Center.
- **What to do:** Open the Chat interface, ask: "Why are you suggesting this instead of a fixed deposit?" Let the AI answer. Then click "Accept" on the recommendation and step through the Action Center.
- **What to say:** "The customer can interrogate the AI directly. Because it's grounded in the customer's graph, it knows exactly why it suggested the SIP. We accept the recommendation, and Agent 5 builds an autonomous execution plan."

**2:35–3:00 — Close the Loop**
- **What to display:** Action Center completion -> Follow-up Schedule.
- **What to do:** Click the final step, then click the "Fast Forward 30 Days" button to show Agent 6 triggering.
- **What to say:** "Finally, Agent 6 schedules a follow-up. When we fast-forward 30 days, the AI proactively checks in to see if the new SIP amount is comfortable. Detect, reason, engage, follow up — fully autonomous, fully explainable. Thank you."
