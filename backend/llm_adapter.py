import os
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

KB_TEXT = ""
try:
    kb_path = os.path.join(os.path.dirname(__file__), "data", "rules_and_guide.txt")
    if os.path.exists(kb_path):
        with open(kb_path, "r", encoding="utf-8") as f:
            KB_TEXT = f.read()
except Exception as e:
    print("Warning: Failed to load KB_TEXT:", e)

KB_INSTRUCTION = f"\n\nUse the following Wealth Management Rules and Guide as a general reference for investment principles, adapting it flexibly based on the customer's specific persona. It is not a strict rulebook but a guiding philosophy:\n{KB_TEXT}\n" if KB_TEXT else ""

def get_llm(model_type="reasoning"):
    groq_api_key = os.getenv("GROQ_API_KEY")
    gemini_api_key = os.getenv("GEMINI_API_KEY")

    # MVP: try Groq, fallback to Gemini if Groq fails or is not configured
    try:
        if groq_api_key and groq_api_key != "your_groq_api_key_here":
            if model_type == "heavy":
                return ChatGroq(model_name="llama-3.3-70b-versatile", groq_api_key=groq_api_key)
            else:
                return ChatGroq(model_name="llama-3.1-8b-instant", groq_api_key=groq_api_key)
    except Exception as e:
        print(f"Groq initialization failed: {e}")

    # Fallback to Gemini
    if gemini_api_key and gemini_api_key != "your_gemini_api_key_here":
        return ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key)
    
    # If no keys, return None so we can mock the output in the agents for the MVP demo
    return None

def get_cerebras_llm():
    cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
    if cerebras_api_key and cerebras_api_key != "your_cerebras_api_key_here":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model="llama3.1-8b", 
            api_key=cerebras_api_key, 
            base_url="https://api.cerebras.ai/v1"
        )
    return None
