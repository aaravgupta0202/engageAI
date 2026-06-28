# SBI Hackathon Submission Materials

## 1. Brief Description of the Idea

SBI EngageAI is an autonomous, multi-agent AI platform that continuously analyzes customer financial behavior, detects meaningful life events, and proactively engages customers with personalized, explainable financial recommendations. Instead of waiting for customers to seek financial guidance, EngageAI transforms banking from reactive customer service into an ongoing advisory relationship powered by Agentic AI.

---

## 2. Proposed Solution

SBI EngageAI is powered by a six-agent LangGraph workflow consisting of:

- Financial Behavior Analyzer
- Life Event Detection
- Opportunity Discovery
- Engagement Strategy
- Action Planning
- Follow-Up

Each customer is represented by a continuously evolving Financial Life Graph that captures financial behavior, transaction history, goals, detected events, recommendations, and engagement history.

The system identifies meaningful financial life events such as salary hikes, marriage, new dependents, relocation, business expansion, retirement planning, and home-buying intent from transaction patterns and customer context. It then reasons about the most relevant SBI products, explains every recommendation, creates a personalized action plan, and proactively follows up after customer engagement.

The solution is demonstrated using a Synthetic Customer Generator that creates realistic customer personas with embedded financial histories and ground-truth life events, enabling safe, privacy-preserving evaluation without using real banking data.

---

## 3. Business Model / Commercial Potential

SBI EngageAI generates business value by increasing adoption of SBI's existing financial products rather than creating new ones.

Key benefits include:

- Increased cross-sell and upsell conversion
- Improved Customer Lifetime Value (CLV)
- Higher digital engagement
- Reduced branch and call-center advisory workload
- More personalized customer journeys
- Better customer retention through proactive engagement

The Synthetic Customer Generator can also be reused internally for employee training, AI testing, and quality assurance without exposing sensitive customer information.

---

## 4. Technology Stack Details

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Real-Time Communication:** Server-Sent Events (SSE)
- **Agent Orchestration:** LangGraph
- **LLM Providers:** Groq, Cerebras, Google Gemini
- **Database:** Neon PostgreSQL
- **Vector Search:** Local ChromaDB with Sentence Transformers for semantic product matching
- **Deployment:** Netlify (Frontend), Render (Backend)

---

## 5. Process Flow / Architecture

Synthetic Customer Generator

↓

Financial Life Graph

↓

Behavior Analyzer Agent

↓

Life Event Detection Agent

↓

Opportunity Discovery Agent

↓

Engagement Strategy Agent

↓

Customer Touchpoint

↓

Action Planning Agent

↓

Follow-Up Agent

↓

Continuous Engagement Cycle

The FastAPI backend orchestrates the six-agent LangGraph workflow while Neon PostgreSQL stores customer profiles, financial graphs, recommendations, and audit history. The React frontend streams live agent reasoning through Server-Sent Events into the Agent Activity Center, making every AI decision transparent, explainable, and auditable.

---

## 6. GitHub Repository

https://github.com/aaravgupta0202/engageAI

---

## 7. Demo Video

[INSERT YOUR YOUTUBE/VIMEO LINK HERE]

---

# Idea Deck (Claude Prompt)

Prompt:

> I am participating in the SBI Agentic AI Hackathon @ GFF 2026. The theme is "Agentic AI & Emerging Tech" under the Digital Engagement problem statement.
>
> I built a project called **SBI EngageAI – Your Financial Copilot**.
>
> SBI EngageAI is an autonomous multi-agent AI platform that continuously analyzes customer financial behavior, detects meaningful life events, reasons about personalized SBI product opportunities, explains every recommendation, creates action plans, and proactively follows up.
>
> The solution is built around six LangGraph agents:
>
> • Financial Behavior Analyzer
> • Life Event Detection
> • Opportunity Discovery
> • Engagement Strategy
> • Action Planning
> • Follow-Up
>
> Since real banking data cannot be used, the demo uses a Synthetic Customer Generator that creates realistic personas with embedded financial histories and life events.
>
> The architecture consists of React, FastAPI, LangGraph, Neon PostgreSQL, Groq, Cerebras, Gemini, and Server-Sent Events for live reasoning visualization.
>
> Generate a professional 12-slide investor/hackathon pitch deck covering:
>
> 1. Title
> 2. Problem
> 3. Market Insight
> 4. Solution
> 5. Customer Journey
> 6. Six-Agent Architecture
> 7. Synthetic Customer Generator
> 8. Live Demo
> 9. Technical Architecture
> 10. Business Impact
> 11. Competitive Differentiators
> 12. Closing

---

# Demo Video Script (3 Minutes)

## 0:00–0:25 — Introduction

Display the landing page.

Explain:

> "Banking today is largely reactive. Customers only receive advice when they ask for it. SBI EngageAI changes that by proactively understanding customer financial behavior and delivering personalized recommendations before customers even know they need them."

Click **Try Demo**.

---

## 0:25–0:50 — Generate Customer

Display the Synthetic Customer Generator.

Explain:

> "For privacy and security, we demonstrate our platform using AI-generated synthetic customers rather than real banking data."

Generate a Young Professional persona.

---

## 0:50–1:25 — Customer Dashboard

Open the dashboard.

Highlight:

- Financial Life Graph
- Goals
- Income
- Timeline
- Transaction History

Explain how customer context is constructed.

---

## 1:25–2:00 — Run AI Engagement Cycle

Open the Agent Activity Center.

Click **Run AI Engagement Cycle**.

Explain how each of the six autonomous agents contributes to the reasoning process while the workflow executes.

---

## 2:00–2:30 — Recommendations

Open Recommendations.

Show:

- Top recommendation
- Fit score
- Why this?
- Why now?
- Estimated impact
- Explainability

Accept one recommendation.

---

## 2:30–2:50 — AI Chat

Ask:

> "Why are you recommending this instead of a Fixed Deposit?"

Demonstrate the personalized explanation grounded in the customer's profile.

---

## 2:50–3:00 — Action & Follow-Up

Show the Action Center.

Complete the mock execution.

Fast-forward to the Follow-Up Agent.

Close with:

> "SBI EngageAI transforms banking from reactive service into proactive, explainable financial guidance through autonomous multi-agent AI."
