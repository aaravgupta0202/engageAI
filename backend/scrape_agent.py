import os
import json
import requests
import uuid
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
api_key = os.getenv("CEREBRAS_API_KEY")

if not api_key:
    print("Error: CEREBRAS_API_KEY not found in environment.")
    exit(1)

URLS = [
    {"url": "https://www.sbimf.com/mutual-fund", "category": "invest"},
    {"url": "https://sbi.bank.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits", "category": "save"}
]

def fetch_and_clean_text(url):
    print(f"Fetching {url}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()
            
        text = soup.get_text(separator=' ', strip=True)
        # Collapse whitespace
        clean_text = ' '.join(text.split())
        return clean_text[:20000] # Limit to 20k chars for LLM context
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def extract_products_with_llm(text, category, url):
    if not text: return []
    print(f"Extracting products using Cerebras API for {category}...")
    
    system_prompt = f"""You are a financial data extraction AI. 
Extract all specific banking/financial products mentioned in the provided text.
The category of these products is '{category}'.
Return a JSON array of objects with the following EXACT structure. 
DO NOT wrap in markdown blocks, return ONLY raw JSON.

[
  {{
    "name": "Product Name",
    "description": "Short description of rates, returns, or features",
    "category": "{category}",
    "url": "{url}",
    "eligibility_rules": {{
      "min_age": 18,
      "max_age": 60,
      "min_income": 0
    }}
  }}
]

If eligibility rules aren't explicitly mentioned, omit those keys or set reasonable defaults based on the product type.
"""
    
    try:
        res = requests.post(
            "https://api.cerebras.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "gpt-oss-120b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Text to extract from:\n\n{text}"}
                ],
                "temperature": 0.1
            }
        )
        if not res.ok:
            print(f"API Error: {res.text}")
            return []
            
        response_text = res.json()["choices"][0]["message"]["content"].strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
            response_text = response_text[3:-3]
            
        products = json.loads(response_text)
        
        # Inject UUIDs
        for p in products:
            p["id"] = f"p_{str(uuid.uuid4())[:8]}"
            
        return products
    except Exception as e:
        print(f"Extraction error: {e}")
        return []

def main():
    all_products = []
    
    for item in URLS:
        text = fetch_and_clean_text(item["url"])
        extracted = extract_products_with_llm(text, item["category"], item["url"])
        print(f"Found {len(extracted)} products from {item['url']}")
        all_products.extend(extracted)
        
    # Also add standard loans and insurance from the Verve PDF / local knowledge
    # (Since we aren't scraping loan pages right now, we inject some base products to ensure coverage)
    base_products = [
        {
            "id": f"p_{str(uuid.uuid4())[:8]}",
            "name": "SBI Regular Home Loan",
            "description": "Low interest home loans with flexible repayment options up to 30 years.",
            "category": "borrow",
            "url": "https://sbi.co.in/web/personal-banking/loans/home-loans/regular-home-loan",
            "eligibility_rules": {"min_age": 18, "max_age": 70, "min_income": 30000}
        },
        {
            "id": f"p_{str(uuid.uuid4())[:8]}",
            "name": "SBI Life - eShield Next",
            "description": "Comprehensive term life insurance protecting your family's future.",
            "category": "protect",
            "url": "https://www.sbilife.co.in/en/individual-life-insurance/traditional/eshield-next",
            "eligibility_rules": {"min_age": 18, "max_age": 65}
        },
        {
            "id": f"p_{str(uuid.uuid4())[:8]}",
            "name": "SBI General Health Insurance",
            "description": "Extensive health coverage for you and your family.",
            "category": "protect",
            "url": "https://www.sbigeneral.in/health-insurance",
            "eligibility_rules": {"min_age": 18, "max_age": 65}
        }
    ]
    all_products.extend(base_products)

    output_path = os.path.join(os.path.dirname(__file__), "sbi_product_catalog_live.json")
    with open(output_path, "w") as f:
        json.dump(all_products, f, indent=2)
        
    print(f"\nSuccess! Total products saved to {output_path}: {len(all_products)}")

if __name__ == "__main__":
    main()
