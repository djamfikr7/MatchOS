from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
import os

class MediationAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-4",
            temperature=0.2,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

    def anonymize_message(self, text: str, privacy_level: str, category_prompt: str = None) -> str:
        if privacy_level == "public":
            return text
            
        system_prompt = category_prompt or "You are a privacy mediator. Remove PII."
        
        if privacy_level == "alias":
            system_prompt += " Replace names with 'User', hide phone numbers/emails."
        elif privacy_level == "mediated":
            system_prompt += " Rewrite the message to be purely functional. Remove all personal context."
        elif privacy_level == "ghost":
            system_prompt += " Summarize the intent only. No direct quotes."

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=text)
        ]
        
        response = self.llm(messages)
        return response.content

    def negotiate(self, request: Dict[str, Any], provider: Dict[str, Any]) -> str:
        # Logic to propose terms
        return "Proposed terms based on market rates."
