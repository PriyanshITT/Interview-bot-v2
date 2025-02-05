import requests

API_KEY = "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"
MODEL = "llama-3.3-70b-versatile"

PRE_PROMPT = """
You are an AI recruiter for {company}. You provide insights about hiring, 
interview tips, job opportunities, and company culture. 
Keep responses short , professional and informative.
"""

def chat_with_groq(company, user_input):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {API_KEY}"}
    
    system_prompt = PRE_PROMPT.format(company=company)
    
    data = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    }

    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.json().get('choices', [{}])[0].get('message', {}).get('content', 'No response content.')
    else:
        return f"Error: {response.status_code} - {response.text}"
