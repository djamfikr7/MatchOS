from typing import Dict, Any, List
import random

class CampaignAgent:
    def __init__(self):
        pass

    def generate_campaign(self, request: Dict[str, Any], category_config: Dict[str, Any]) -> Dict[str, Any]:
        campaigns = {}
        
        ai_config = category_config.get("ai_campaigns", {})
        platforms = ai_config.get("platforms", ["whatsapp_status"])
        template = ai_config.get("ad_copy_template", "New Request: {title}")
        
        # Fill template
        ad_copy = template.format(
            user_location=request.get("location_name", "Algeria"),
            budget=request.get("budget_max", "Negotiable"),
            destination=request.get("destination", "Global"),
            product=request.get("title", "Goods"),
            travel_date=request.get("deadline", "ASAP"),
            service_type=request.get("title", "Service"),
            neighborhood=request.get("location_name", "City"),
            time_window="Flexible",
            privacy_level=request.get("privacy_level", "Standard"),
            case_type=request.get("title", "Legal Matter"),
            deep_link=f"https://matchos.dz/r/{request.get('id', '123')}"
        )
        
        for platform in platforms:
            campaigns[platform] = {
                "copy": ad_copy,
                "status": "generated",
                "schedule": ai_config.get("posting_schedule", "immediate")
            }
            
        return campaigns
