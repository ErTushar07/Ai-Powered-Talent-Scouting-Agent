from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from pydantic import BaseModel
import os
import agent
from typing import List, Dict, Any

app = FastAPI(title="AI Talent Scouting Agent")

# Make sure public directory exists
os.makedirs("public", exist_ok=True)

# Mount the static files
app.mount("/static", StaticFiles(directory="public"), name="static")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    with open("public/index.html", "r") as f:
        return f.read()

class JdRequest(BaseModel):
    job_description: str

@app.post("/api/agents/scout")
async def scout_candidates(req: JdRequest):
    if not req.job_description:
        raise HTTPException(status_code=400, detail="Job description is required")
        
    results = agent.match_candidates(req.job_description)
    return {"status": "success", "candidates": results}

class ChatRequest(BaseModel):
    candidate_id: str
    message: str
    history: List[Dict[str, str]] = []

@app.post("/api/agents/chat")
async def chat_candidate(req: ChatRequest):
    if not req.candidate_id or not req.message:
        raise HTTPException(status_code=400, detail="candidate_id and message are required")
        
    response = agent.chat_with_candidate(req.candidate_id, req.message, req.history)
    return {"status": "success", "reply": response["reply"], "interest_score": response["interest_score"]}

class ConfigRequest(BaseModel):
    api_key: str

@app.post("/api/config")
async def set_config(req: ConfigRequest):
    agent.API_KEY = req.api_key
    import google.generativeai as genai
    genai.configure(api_key=req.api_key)
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
