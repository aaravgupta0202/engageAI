<div align="center">
  <img src="./frontend/public/favicon.png" alt="engageAI Logo" height="150" />
</div>

# 🏦 engageAI - Your Financial Copilot
**Built by Aarav Gupta for the SBI Hackathon @ GFF 2026**
*Theme: Agentic AI & Emerging Tech | Problem Statement: Digital Engagement*

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/LangGraph-0A1931?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
</p>

🔗 **[Try the Live Demo Here!](https://sbiengageai.netlify.app/)**

---

## 🚀 The Vision: Shifting Banking from Reactive to Proactive
Banking today is fundamentally reactive. Customers look at their accounts, determine their own needs, and initiate transactions. 

**engageAI** flips this model entirely. It is an autonomous, multi-agent AI layer that continuously analyzes customer financial behavior, detects life events as they happen, and proactively engages customers with reasoned, relevant recommendations. We turn every customer interaction from a request-response transaction into an ongoing, advisory relationship.

---

## 📱 Platform Interface

Here is a glimpse of the powerful features provided by engageAI, showcasing transparent reasoning and autonomous action pipelines:

- **AI-Powered Conversational Onboarding**: Instead of boring web forms, the system uses a seamless conversational AI flow to collect the user's financial context (occupation, city, income, expenses) dynamically. 
- **Explainable Health Score & Net Worth Tracking**: Live breakdown of what impacts the user's financial health, tracked out of 100 points based on savings, goals, and debt ratios.
- **Goal Dependencies & Real-Life Rule Engine**: The recommendation engine actively blocks aggressive investment advice if fundamental goals (e.g. 6 months Emergency Fund) are not met.
- **Financial Simulation & "What If" Planner**: Customers can ask "What if I get married and buy a car next year?" and the platform dynamically computes and visualizes the future state of their Financial Twin, projecting the exact impact on their Health Score and Cash Flow.
- **Intent-Driven AI Chat**: The integrated Financial Assistant shifts its personality and reasoning strictly based on the user's selected intent (Advice vs Planning vs Comparison).

(Note: UI screenshots will be added soon!)

## 🧠 The Architecture: 6 Autonomous Agents

A six-agent LangGraph system operates on a continuously evolving Financial Life Graph per customer. The system detects events such as salary hikes, marriage, child birth, relocation, and home-purchase intent from transaction patterns.

```mermaid
graph TD;
    A[Transaction Stream] --> B[Behavior Analyzer Agent];
    B --> C[Life Event Detection Agent];
    C -->|If Event Found| D[Opportunity Discovery Agent];
    D --> E[Engagement Strategy Agent];
    E --> F[Customer Touchpoint];
    F -->|On Acceptance| G[Action Planning Agent];
    G --> H[Follow-Up Agent];
```

A **FastAPI backend** orchestrates this six-node LangGraph against a **PostgreSQL-backed** Financial Life Graph. The **React frontend** streams live agent reasoning via **Server-Sent Events** into a dedicated Agent Activity Center, making the system’s reasoning auditable and highly explainable.

---

## 📈 Commercial Potential & Business Impact

Revenue is generated indirectly through:
- **Increased Cross-Sell Conversion**: Highly targeted, contextual product recommendations.
- **CLV Uplift**: Higher Customer Lifetime Value on SBI’s existing product catalog.
- **Cost Reduction**: Secondary value comes from reduced call-center and branch load for routine advisory queries.
- **Internal Utilization**: The Synthetic Customer Generator can be used independently for QA and staff training.

---

## 🛠️ Technology Stack

- **Frontend:** React + TypeScript + Tailwind CSS (Component-driven architecture)
- **Backend:** FastAPI (Python) with Server-Sent Events (SSE) for live streaming
- **Orchestration:** LangGraph (Six-node sequential agent graph)
- **LLM Provider:** Groq / Gemini (used for rapid reasoning, synthetic generation, and contextual chat)
- **Database:** PostgreSQL (Customer graph stored as JSONB, transactions, audit trails)
- **Deployment:** Netlify (Frontend) / Render (Backend)

---

## ⚙️ Running Locally

### Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. Create a `.env` file referencing `.env.example` (Add your Groq API key).
6. `uvicorn main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env` file with `VITE_API_URL=http://localhost:8000`
4. `npm run dev`

---