import json
import uuid
import os

catalog = []

categories_map = {
    "save": [
        "Savings Account", "Savings Plus", "Salary Account", "Minor Account", "BSBDA", "NRE", "NRO", "Current Account",
        "MOD", "Annuity Deposit", "Tax Saver FD", "Amrit Vrishti", "Sarvottam", "WeCare", "Green Deposit", "Bulk Deposit",
        "RD", "Har Ghar Lakhpati RD", "PPF", "Sukanya", "SCSS"
    ],
    "borrow": [
        "Regular Home Loan", "MaxGain", "Shaurya", "Privilege", "Realty", "Home Top-Up", "Home Renovation", "Plot Loan", "Balance Transfer",
        "Xpress Credit", "Xpress Power", "Pension Loan", "Pre-approved PL", "Gold Loan",
        "Car Loan", "Green Car Loan", "Two Wheeler", "EV Loan", "Loyalty Scheme",
        "Scholar Loan", "Student Loan", "Overseas Education", "Skill Loan",
        "Loan Against FD", "Loan Against Securities", "Loan Against Mutual Funds", "Loan Against Property"
    ],
    "invest": [
        "SIP", "Mutual Funds", "Large Cap Fund", "Mid Cap Fund", "Bluechip Fund", "Contra Fund", "ELSS", "Hybrid Fund", "Debt Fund", "Liquid Fund",
        "NPS", "RBI Bonds", "SGB", "Demat", "Trading Account"
    ],
    "protect": [
        "Health Insurance", "Life Insurance", "Travel Insurance", "Motor Insurance", "Home Insurance", "Accident Insurance"
    ],
    "cards": [
        "SBI Cashback Card", "SBI SimplySAVE", "SBI SimplyCLICK", "SBI Elite", "SBI Aurum", "SBI Prime", "SBI BPCL Octane", "SBI IRCTC", "SBI Vistara", "SBI Miles"
    ],
    "digital": [
        "YONO", "YONO Cash", "UPI", "NEFT", "RTGS", "IMPS", "Bill Pay"
    ]
}

for cat_id, products in categories_map.items():
    for prod_name in products:
        prod_id = f"p_{str(uuid.uuid4())[:8]}"
        
        # Simple rule generation based on name
        rules = {}
        if "Home" in prod_name or "Property" in prod_name:
            rules["min_income"] = 40000
            rules["min_age"] = 21
        if "Student" in prod_name or "Scholar" in prod_name or "Education" in prod_name or "Minor" in prod_name or "Sukanya" in prod_name:
            rules["max_age"] = 25
        if "Retiree" in prod_name or "Senior" in prod_name or "SCSS" in prod_name or "WeCare" in prod_name:
            rules["min_age"] = 60
        if "Salary" in prod_name or "Xpress" in prod_name:
            rules["salaried"] = True
            
        desc = f"SBI {prod_name}. A premium {cat_id} product offering competitive rates and benefits."
        if cat_id == "invest":
            desc += " Grow your wealth with our expert-managed funds and bonds."
        elif cat_id == "protect":
            desc += " Comprehensive coverage for you and your family."
        elif cat_id == "borrow":
            desc += " Flexible repayment options and fast disbursal."
            
        catalog.append({
            "id": prod_id,
            "name": prod_name if "SBI" in prod_name else f"SBI {prod_name}",
            "category": cat_id,
            "eligibility_rules": rules,
            "description": desc
        })

output_path = os.path.join(os.path.dirname(__file__), "catalog.json")
with open(output_path, "w") as f:
    json.dump(catalog, f, indent=2)

print(f"Generated {output_path} with {len(catalog)} products.")
