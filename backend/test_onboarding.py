import requests
import json

data = {
    "messages": [
        {"role": "ai", "content": "Welcome to SBI EngageAI. I'll help you set up your Digital Financial Twin. To start, what is your primary occupation?"},
        {"role": "user", "content": "Business owner"},
        {"role": "ai", "content": "Great! Could you tell me roughly what your yearly income is?"},
        {"role": "user", "content": "1500000. Assets are 500000. City is Mumbai. Expenses are 50000. Demographics are 25 single. Goals are buy a house."},
    ]
}

res = requests.post('http://localhost:8000/personas/onboarding-chat', json=data)
print(res.text)
print(res.status_code)
