import os
import json
import google.generativeai as genai
from candidates import candidates

# Check if API Key is available
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

# Use gemini-pro for the logic
def get_model():
    if not API_KEY:
        return None
    return genai.GenerativeModel('gemini-pro')

def mock_match_candidates(job_description: str):
    """Fallback if no API key is provided"""
    results = []
    import random
    for c in candidates:
        score = random.randint(30, 95)
        results.append({
            "id": c["id"],
            "name": c["name"],
            "role": c["role"],
            "match_score": score,
            "explanation": f"This is a mock explanation for {c['name']} because no Gemini API key is provided.",
            "interest_score": 0
        })
    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results

def match_candidates(job_description: str):
    model = get_model()
    if not model:
        return mock_match_candidates(job_description)
    
    prompt = f"""
    You are an AI talent scout. Given the job description below, evaluate the following candidate profiles and assign a Match Score (0-100) for each.
    Also, provide a short, one-sentence explaination on why they match or don't match.

    Job Description:
    {job_description}

    Candidates:
    {json.dumps(candidates, indent=2)}

    Please respond ONLY with a valid JSON array of objects, with the following format:
    [
        {{
            "id": "c1",
            "name": "Candidate Name",
            "role": "Candidate Role",
            "match_score": 85,
            "explanation": "Strong background in React, which matches the JD."
        }}
    ]
    Make sure to include ALL candidates. Output only the JSON.
    """
    
    try:
        response = model.generate_content(prompt, request_options={"timeout": 3.0})
        text = response.text
        # Clean up in case of markdown formatting
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        
        results = json.loads(text.strip())
        # add default interest score
        for r in results:
            r["interest_score"] = 0
            
        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results
    except Exception as e:
        print(f"Error calling LLM: {e}")
        return mock_match_candidates(job_description)

def mock_chat_with_candidate(candidate_id: str, message: str, previous_messages: list):
    import random
    return {
        "reply": "This is a mock response from the candidate since no API key is provided. Sounds like an interesting opportunity!",
        "interest_score": random.randint(50, 100)
    }

def chat_with_candidate(candidate_id: str, message: str, previous_messages: list):
    model = get_model()
    if not model:
        return mock_chat_with_candidate(candidate_id, message, previous_messages)
        
    candidate = next((c for c in candidates if c["id"] == candidate_id), None)
    if not candidate:
        return {"reply": "Candidate not found.", "interest_score": 0}
        
    history_text = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in previous_messages])
    
    prompt = f"""
    You are acting as the candidate described below. A recruiter has reached out to you.
    Based on your profile and current status, respond to the recruiter's latest message.

    Candidate Profile:
    {json.dumps(candidate, indent=2)}

    Conversation History:
    {history_text}
    Recruiter: {message}

    Respond in character as the candidate.
    ALSO, evaluate your current interest in this opportunity on a scale of 0 to 100 based on the interaction so far.

    Please respond exactly in this JSON format and nothing else:
    {{
        "reply": "Your response as the candidate.",
        "interest_score": 75
    }}
    """
    
    try:
        response = model.generate_content(prompt, request_options={"timeout": 3.0})
        text = response.text
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        result = json.loads(text.strip())
        return result
    except Exception as e:
        print(f"Error calling LLM in chat: {e}")
        return mock_chat_with_candidate(candidate_id, message, previous_messages)

