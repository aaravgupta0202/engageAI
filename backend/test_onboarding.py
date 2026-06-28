import requests
import json

data = {
    "messages": [
        {"role": "ai", "content": "Welcome to SBI EngageAI. I'll help you set up your Digital Financial Twin. To start, what is your primary occupation?"},
        {"role": "user", "content": "Business owner"}
    ]
}

res = requests.post('http://localhost:8000/personas/onboarding-chat', json=data)
print(res.text)
print(res.status_code)
