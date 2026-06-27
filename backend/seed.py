import json
import uuid
import datetime
from database import engine, SessionLocal, Base
from models import Customer, Persona, ProductCatalog

# Create tables
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    # Clear existing
    db.query(ProductCatalog).delete()
    db.query(Persona).delete()
    db.commit()

    print("Seeding Personas...")
    personas_data = [
        {"archetype": "Student", "profile": {"age": 20, "income": "10000", "goals": ["Education", "Gadget"]}, "embedded_events": {}},
        {"archetype": "Fresher", "profile": {"age": 23, "income": "40000", "goals": ["Emergency Fund"]}, "embedded_events": {"new_job": True}},
        {"archetype": "Software Engineer", "profile": {"age": 28, "income": "120000", "goals": ["Car", "Travel"]}, "embedded_events": {"salary_hike": True}},
        {"archetype": "Home Buyer", "profile": {"age": 35, "income": "180000", "goals": ["Home Downpayment"]}, "embedded_events": {"home_purchase_intent": True}},
        {"archetype": "New Parent", "profile": {"age": 32, "income": "150000", "goals": ["Child Education"]}, "embedded_events": {"child_birth": True}},
        {"archetype": "Traveler", "profile": {"age": 29, "income": "90000", "goals": ["World Tour"]}, "embedded_events": {"frequent_travel": True}},
        {"archetype": "Business Owner", "profile": {"age": 45, "income": "300000", "goals": ["Business Expansion"]}, "embedded_events": {}},
        {"archetype": "Investor", "profile": {"age": 40, "income": "250000", "goals": ["Wealth Creation", "Retirement"]}, "embedded_events": {}},
        {"archetype": "Retiree", "profile": {"age": 65, "income": "50000", "goals": ["Medical Corpus"]}, "embedded_events": {"retirement": True}},
        {"archetype": "Married Couple", "profile": {"age": 30, "income": "200000", "goals": ["Joint Home", "Car"]}, "embedded_events": {"marriage": True}},
    ]

    for p in personas_data:
        persona = Persona(
            id=str(uuid.uuid4()),
            archetype=p["archetype"],
            profile=p["profile"],
            embedded_events=p["embedded_events"]
        )
        db.add(persona)

    print("Seeding Product Catalog...")
    products = [
        {"id": "p_sip", "name": "Mutual Fund SIP", "category": "invest", "eligibility_rules": {"min_income": 20000}, "description": "Systematic Investment Plan for wealth creation."},
        {"id": "p_hl", "name": "SBI Home Loan", "category": "borrow", "eligibility_rules": {"min_income": 40000}, "description": "Home loan with attractive interest rates."},
        {"id": "p_ti", "name": "SBI Life - eShield (Term Insurance)", "category": "protect", "eligibility_rules": {"min_age": 18}, "description": "Pure term insurance for life protection."},
        {"id": "p_hi", "name": "SBI General Health Insurance", "category": "protect", "eligibility_rules": {}, "description": "Comprehensive health coverage for family."},
        {"id": "p_fd", "name": "SBI Fixed Deposit", "category": "save", "eligibility_rules": {}, "description": "Safe savings with assured returns."},
        {"id": "p_travel", "name": "SBI General Travel Insurance", "category": "protect", "eligibility_rules": {}, "description": "Coverage against travel-related emergencies."},
        {"id": "p_rd_child", "name": "Child Education RD", "category": "save", "eligibility_rules": {}, "description": "Recurring deposit structured for child education goals."}
    ]

    for prod in products:
        product = ProductCatalog(
            id=prod["id"],
            name=prod["name"],
            category=prod["category"],
            eligibility_rules=prod["eligibility_rules"],
            description=prod["description"]
        )
        db.add(product)

    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed_data()
