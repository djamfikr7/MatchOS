from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import Agents
from agents.matching import MatchingAgent
from agents.mediation import MediationAgent
from agents.fraud import FraudAgent
from agents.campaign import CampaignAgent
from langchain_openai import OpenAIEmbeddings

app = FastAPI()

# Initialize Agents
matching_agent = MatchingAgent()
mediation_agent = MediationAgent()
fraud_agent = FraudAgent()
campaign_agent = CampaignAgent()
embeddings_model = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

# Request Models
class ScoreRequest(BaseModel):
    request: Dict[str, Any]
    provider: Dict[str, Any]
    categoryConfig: Optional[Dict[str, Any]] = None

class AnonymizeRequest(BaseModel):
    text: str
    privacyLevel: str
    categoryPrompt: Optional[str] = None

class FraudScanRequest(BaseModel):
    transaction: Dict[str, Any]
    categoryConfig: Dict[str, Any]

class SignalCheckRequest(BaseModel):
    provider: Dict[str, Any]

class CampaignRequest(BaseModel):
    request: Dict[str, Any]
    categoryConfig: Dict[str, Any]

class EmbeddingRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "MatchOS AI Core 🐍 (Agents Active)"}

@app.post("/score")
def score_match(payload: ScoreRequest):
    try:
        score = matching_agent.calculate_score(
            payload.request, 
            payload.provider, 
            payload.categoryConfig
        )
        return {
            "score": score,
            "explanation": "Calculated using 7-Factor Affinity Engine."
        }
    except Exception as e:
        print(f"Error scoring match: {e}")
        return {"score": 0.0, "error": str(e)}

@app.post("/mediate/anonymize")
def anonymize_message(payload: AnonymizeRequest):
    try:
        sanitized_text = mediation_agent.anonymize_message(
            payload.text, 
            payload.privacyLevel, 
            payload.categoryPrompt
        )
        return {"sanitizedText": sanitized_text}
    except Exception as e:
        print(f"Error anonymizing message: {e}")
        return {"sanitizedText": payload.text, "error": str(e)}

@app.post("/fraud/scan")
def scan_transaction(payload: FraudScanRequest):
    try:
        signals = fraud_agent.scan_transaction(
            payload.transaction, 
            payload.categoryConfig
        )
        return {"signals": signals, "riskScore": len(signals) * 0.25}
    except Exception as e:
        print(f"Error scanning transaction: {e}")
        return {"signals": [], "error": str(e)}

@app.post("/fraud/check-provider")
def check_provider(payload: SignalCheckRequest):
    try:
        signals = fraud_agent.run_signal_check(payload.provider)
        return {"signals": signals}
    except Exception as e:
        print(f"Error checking provider: {e}")
        return {"signals": [], "error": str(e)}

@app.post("/campaign/generate")
def generate_campaign(payload: CampaignRequest):
    try:
        campaigns = campaign_agent.generate_campaign(
            payload.request, 
            payload.categoryConfig
        )
        return {"campaigns": campaigns}
    except Exception as e:
        print(f"Error generating campaign: {e}")
        return {"campaigns": {}, "error": str(e)}

@app.post("/embeddings")
def generate_embedding(payload: EmbeddingRequest):
    try:
        embedding = embeddings_model.embed_query(payload.text)
        return {"embedding": embedding}
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return {"embedding": [], "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3004)
