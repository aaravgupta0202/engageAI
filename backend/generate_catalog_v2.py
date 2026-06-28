import json
import uuid
import os

catalog = []

detailed_products = [
    # SAVE & DEPOSITS
    {"cat": "save", "name": "SBI Savings Account", "url": "https://sbi.co.in/web/personal-banking/accounts/saving-account", "desc": "Basic savings account with secure digital banking access."},
    {"cat": "save", "name": "SBI Salary Account", "url": "https://sbi.co.in/web/personal-banking/accounts/salary-account", "desc": "Zero balance salary account with complimentary insurance benefits.", "rules": {"salaried": True}},
    {"cat": "save", "name": "SBI Retail Domestic Term Deposit (FD)", "url": "https://sbi.bank.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits", "desc": "Secure fixed deposits with attractive interest rates and flexible tenures.", "rules": {"min_age": 18}},
    {"cat": "save", "name": "SBI Tax Savings Scheme", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/deposits/sbi-tax-savings-scheme-2006", "desc": "Tax saving fixed deposit under section 80C with a 5-year lock-in."},
    {"cat": "save", "name": "SBI WeCare Senior Citizen FD", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/deposits/sbi-wecare", "desc": "Special FD scheme for senior citizens offering additional interest rates.", "rules": {"min_age": 60}},
    {"cat": "save", "name": "SBI Amrit Vrishti", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/deposits/amrit-vrishti", "desc": "Special 444 days term deposit with high yields."},
    {"cat": "save", "name": "SBI Recurring Deposit (RD)", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/deposits/recurring-deposit", "desc": "Save a fixed amount monthly and earn interest like an FD."},
    {"cat": "save", "name": "Public Provident Fund (PPF)", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/govt-schemes/ppf", "desc": "Tax-free, government-backed long-term savings scheme."},
    {"cat": "save", "name": "Sukanya Samriddhi Yojana", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/govt-schemes/sukanya-samriddhi-yojana", "desc": "High-interest savings scheme for the girl child.", "rules": {"max_age": 10}}, # Age of child
    
    # BORROW & LOANS
    {"cat": "borrow", "name": "SBI Regular Home Loan", "url": "https://sbi.co.in/web/personal-banking/loans/home-loans/regular-home-loan", "desc": "Low interest home loans with flexible repayment options up to 30 years.", "rules": {"min_income": 30000, "min_age": 18}},
    {"cat": "borrow", "name": "SBI MaxGain Home Loan", "url": "https://sbi.co.in/web/personal-banking/loans/home-loans/sbi-maxgain", "desc": "Home loan as an overdraft to save on interest."},
    {"cat": "borrow", "name": "SBI Xpress Credit Personal Loan", "url": "https://sbi.co.in/web/personal-banking/loans/personal-loans/xpress-credit", "desc": "Fast personal loans for salary account holders.", "rules": {"salaried": True, "min_income": 15000}},
    {"cat": "borrow", "name": "SBI Pension Loan", "url": "https://sbi.co.in/web/personal-banking/loans/personal-loans/pension-loans", "desc": "Financial assistance for pensioners.", "rules": {"min_age": 60}},
    {"cat": "borrow", "name": "SBI Car Loan", "url": "https://sbi.co.in/web/personal-banking/loans/auto-loans/sbi-new-car-loan-scheme", "desc": "Finance for your dream car with low EMIs.", "rules": {"min_income": 25000}},
    {"cat": "borrow", "name": "SBI Green Car Loan (EV)", "url": "https://sbi.co.in/web/personal-banking/loans/auto-loans/green-car-loan", "desc": "Special discounted loan rates for Electric Vehicles.", "rules": {"min_income": 25000}},
    {"cat": "borrow", "name": "SBI Student Loan Scheme", "url": "https://sbi.co.in/web/personal-banking/loans/education-loans/student-loan-scheme", "desc": "Education loan for higher studies in India and abroad.", "rules": {"max_age": 35}},
    {"cat": "borrow", "name": "SBI Scholar Loan", "url": "https://sbi.co.in/web/personal-banking/loans/education-loans/scholar-loan-scheme", "desc": "Premium education loan for premier institutions like IITs and IIMs."},
    {"cat": "borrow", "name": "Loan Against Mutual Funds", "url": "https://sbi.co.in/web/personal-banking/loans/loans-against-securities/loan-against-mutual-funds", "desc": "Instant liquidity without selling your mutual fund investments."},
    {"cat": "borrow", "name": "SME Business Loan", "url": "https://sbi.co.in/web/sme-enterprise", "desc": "Working capital and expansion loans for MSMEs and business owners."},
    
    # INVEST & GROW (MUTUAL FUNDS)
    {"cat": "invest", "name": "SBI Bluechip Fund", "url": "https://www.sbimf.com/mutual-fund/sbi-bluechip-fund", "desc": "Invest in large-cap companies for stable, long-term wealth creation."},
    {"cat": "invest", "name": "SBI Small Cap Fund", "url": "https://www.sbimf.com/mutual-fund/sbi-small-cap-fund", "desc": "High growth potential fund investing in small-cap companies."},
    {"cat": "invest", "name": "SBI Long Term Equity Fund (ELSS)", "url": "https://www.sbimf.com/mutual-fund/sbi-long-term-equity-fund", "desc": "Tax saving mutual fund with a 3-year lock-in period.", "rules": {"tax_saving": True}},
    {"cat": "invest", "name": "SBI Liquid Fund", "url": "https://www.sbimf.com/mutual-fund/sbi-liquid-fund", "desc": "Low risk, highly liquid fund for parking short-term surplus funds."},
    {"cat": "invest", "name": "SBI Magnum Midcap Fund", "url": "https://www.sbimf.com/mutual-fund/sbi-magnum-midcap-fund", "desc": "Invest in emerging mid-sized companies for capital appreciation."},
    {"cat": "invest", "name": "SBI Retirement Benefit Fund", "url": "https://www.sbimf.com/mutual-fund/sbi-retirement-benefit-fund", "desc": "Solution-oriented fund specifically for retirement planning."},
    {"cat": "invest", "name": "Sovereign Gold Bonds (SGB)", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/govt-schemes/sovereign-gold-bonds", "desc": "Invest in digital gold with fixed annual interest from RBI."},
    {"cat": "invest", "name": "National Pension System (NPS)", "url": "https://sbi.co.in/web/personal-banking/investments-deposits/govt-schemes/nps", "desc": "Government-backed retirement savings scheme with tax benefits."},
    {"cat": "invest", "name": "SBI Demat & Trading Account", "url": "https://www.sbisecurities.in/", "desc": "Seamless equity trading and investment account via SBI Securities."},
    
    # PROTECT & INSURANCE
    {"cat": "protect", "name": "SBI Life - eShield Next", "url": "https://www.sbilife.co.in/en/individual-life-insurance/traditional/eshield-next", "desc": "Comprehensive term life insurance protecting your family's future.", "rules": {"min_age": 18, "max_age": 65}},
    {"cat": "protect", "name": "SBI General Health Insurance", "url": "https://www.sbigeneral.in/health-insurance", "desc": "Extensive health coverage for you and your family.", "rules": {"min_age": 18, "max_age": 65}},
    {"cat": "protect", "name": "SBI General Motor Insurance", "url": "https://www.sbigeneral.in/motor-insurance", "desc": "Comprehensive protection for your car or two-wheeler."},
    {"cat": "protect", "name": "SBI General Home Insurance", "url": "https://www.sbigeneral.in/home-insurance", "desc": "Protect your house and its contents from unforeseen disasters."},
    {"cat": "protect", "name": "SBI Life - Smart Wealth Builder", "url": "https://www.sbilife.co.in/en/individual-life-insurance/ulip/smart-wealth-builder", "desc": "ULIP offering life cover alongside market-linked wealth creation."},
    
    # CREDIT CARDS
    {"cat": "cards", "name": "SBI Cashback Credit Card", "url": "https://www.sbicard.com/en/personal/credit-cards/shopping/cashback-sbi-card.page", "desc": "Get 5% cashback on all online spends with no merchant restrictions."},
    {"cat": "cards", "name": "SBI SimplyCLICK Credit Card", "url": "https://www.sbicard.com/en/personal/credit-cards/shopping/simplyclick-sbi-card.page", "desc": "The perfect card for online shopping rewards and milestone benefits."},
    {"cat": "cards", "name": "SBI Elite Credit Card", "url": "https://www.sbicard.com/en/personal/credit-cards/lifestyle/sbi-card-elite.page", "desc": "Premium lifestyle credit card with complimentary lounge access and movie tickets."},
    {"cat": "cards", "name": "SBI BPCL Octane Card", "url": "https://www.sbicard.com/en/personal/credit-cards/travel/bpcl-sbi-card-octane.page", "desc": "Maximize fuel savings and rewards at BPCL petrol pumps."},
    {"cat": "cards", "name": "SBI Aurum", "url": "https://www.sbicard.com/en/personal/credit-cards/lifestyle/aurum.page", "desc": "Super-premium credit card for HNIs with exclusive bespoke privileges.", "rules": {"min_income": 2000000}},
    
    # DIGITAL BANKING
    {"cat": "digital", "name": "YONO SBI", "url": "https://www.sbiyono.sbi/", "desc": "You Only Need One - Digital banking, lifestyle, and investment app."},
    {"cat": "digital", "name": "YONO Cash", "url": "https://www.sbiyono.sbi/", "desc": "Cardless cash withdrawal at SBI ATMs using the YONO app."}
]

for p in detailed_products:
    p["id"] = f"p_{str(uuid.uuid4())[:8]}"
    if "rules" not in p:
        p["eligibility_rules"] = {}
    else:
        p["eligibility_rules"] = p["rules"]
        del p["rules"]

output_path = os.path.join(os.path.dirname(__file__), "catalog.json")
with open(output_path, "w") as f:
    json.dump(detailed_products, f, indent=2)

print(f"Generated comprehensive {output_path} with {len(detailed_products)} real products and URLs.")
