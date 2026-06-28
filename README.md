# SBI EngageAI - Living Financial Twin

<div align="center">
  <img src="images/logo.png" alt="SBI EngageAI" width="150"/>
  <h3>Hyper-Personalised, Agentic Banking for the Next Generation</h3>
</div>

---

## 🌟 Overview

**SBI EngageAI** transforms passive digital banking into an active, intelligent **Living Financial Twin**. Traditional banking apps require users to search for products and interpret financial data themselves. EngageAI flips the model: it uses a multi-agent LLM architecture to proactively monitor a customer's profile, detect life events, and intelligently push highly personalized recommendations.

Built for the **SBI Hackathon**, this MVP demonstrates how state-of-the-art AI can act as a dedicated Relationship Manager for every customer.

---

## ✨ Core Features

1. **Digital Financial Twin**
   - Automatically builds and maintains a comprehensive profile of a user's income, assets, goals, and demographics.
   - Instantly splits and parses complex compound goals (e.g., "buy a bike and save for a house") into actionable individual targets.

2. **Conversational Onboarding (Groq Llama 3.1 8B)**
   - No boring forms! Users chat with an AI that dynamically extracts JSON data from natural conversation to build their profile.

3. **"What If" Simulator**
   - Users can simulate major life events ("What if I lose my job?", "What if I get married?").
   - The AI predicts the ripple effect on their entire financial graph instantly.

4. **Agentic Workflow Engine (LangGraph)**
   - **6 Specialized Agents** run asynchronously to analyze the user:
     - 🔍 *Behavior Analyzer*: Spots spending patterns.
     - 🧬 *Life Event Detection*: Flags major transitions (e.g., marriage, new job).
     - 💡 *Opportunity Discovery*: Matches needs to the exact SBI product catalog.
     - 🎯 *Engagement Strategy*: Determines the right time and tone for outreach.
     - 📋 *Action Planning*: Formulates a concrete next step.
     - ✍️ *Follow-up*: Generates the final personalized push notification.

5. **Robust AI Fallback Architecture**
   - Built to handle free-tier API rate limits gracefully.
   - Primary: **Groq (Llama 3.1 8B)** for lightning-fast inference.
   - Fallback: **Gemini 1.5 Flash** takes over automatically if Groq limits are hit.

---

## 🛠️ Technology Stack

### Frontend
- **React + Vite** (TypeScript)
- **Tailwind CSS** (for styling and glassmorphism UI)
- **Framer Motion** (for micro-interactions and smooth animations)

### Backend
- **FastAPI** (Python 3)
- **SQLAlchemy** (PostgreSQL on Render / SQLite locally)
- **LangChain & LangGraph** (Agentic Workflow orchestration)
- **Groq & Google Gemini** (LLM APIs)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js & npm
- Python 3.10+
- A Groq API Key and/or Gemini API Key

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Create a `.env` file in the `backend` folder:
```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./sbi_engageai.db
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
*Note: The server will automatically seed 15 sample personas and the SBI product catalog on first startup.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
├── backend/                  # Python FastAPI Backend
│   ├── agents/               # LangGraph Agent definitions
│   ├── catalog.json          # Scraped SBI Product Catalog
│   ├── graph.py              # LangGraph workflow orchestration
│   ├── main.py               # API Endpoints (Chat, Simulation, SSE)
│   ├── llm_adapter.py        # Groq/Gemini LLM unified wrapper
│   └── seed.py               # DB Seeding logic
├── frontend/                 # React UI
│   ├── src/pages/            # Dashboard, Persona Generator, Catalog
│   └── src/components/       # Reusable UI components
├── EngageAI PRD.pdf          # Initial Product Requirement Document
└── EngageAI PRD Fixes.pdf    # V2 Updates and Architecture Refinements
```

---

## 💡 Real-World SBI Product Integration
The recommendation engine is wired up to a static snapshot of real SBI products (`catalog.json`), including:
- SBI Cashback Credit Card
- SBI Small Cap Fund
- SBI Regular Home Loan
- *Clicking "Apply Now" dynamically redirects to the official SBI portal!*

---

<div align="center">
  <i>Built with ❤️ for the SBI Hackathon.</i>
</div>