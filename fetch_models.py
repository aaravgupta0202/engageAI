import os
from dotenv import load_dotenv
load_dotenv()
import requests
res = requests.post('https://api.cerebras.ai/v1/chat/completions', 
    headers={'Authorization': f'Bearer {os.getenv("CEREBRAS_API_KEY")}', 'Content-Type': 'application/json'},
    json={'model': 'gpt-oss-120b', 'messages': [{'role': 'user', 'content': 'hello'}]}
)
print(res.text)
