import numpy as np
from typing import Dict, List, Any
from sklearn.metrics.pairwise import cosine_similarity

class MatchingAgent:
    def __init__(self):
        # Default weights if not provided by Category Config
        self.default_weights = {
            "category_fit": 0.25,
            "location_proximity": 0.20,
            "budget_alignment": 0.15,
            "reputation_score": 0.15,
            "time_availability": 0.10,
            "cultural_fit": 0.10,
            "privacy_compatibility": 0.05
        }

    def calculate_score(self, request: Dict[str, Any], provider: Dict[str, Any], category_config: Dict[str, Any] = None) -> float:
        weights = category_config.get("reputation_weights", self.default_weights) if category_config else self.default_weights
        
        scores = {
            "category_fit": self._score_category(request, provider),
            "location_proximity": self._score_location(request, provider),
            "budget_alignment": self._score_budget(request, provider),
            "reputation_score": self._score_reputation(provider),
            "time_availability": self._score_time(request, provider),
            "cultural_fit": self._score_culture(request, provider),
            "privacy_compatibility": self._score_privacy(request, provider)
        }
        
        # Calculate weighted average
        total_score = sum(scores[k] * weights.get(k, 0.1) for k in scores)
        return round(total_score, 4)

    def _score_category(self, request, provider):
        # Use embeddings if available, else simple skill match
        req_embedding = request.get("embedding")
        prov_skills = provider.get("skills", [])
        
        if req_embedding and provider.get("embedding"):
            return float(cosine_similarity([req_embedding], [provider["embedding"]])[0][0])
        
        # Fallback: Keyword match
        req_text = (request.get("title", "") + " " + request.get("description", "")).lower()
        matches = sum(1 for skill in prov_skills if skill.lower() in req_text)
        return min(matches * 0.2, 1.0) # Cap at 1.0

    def _score_location(self, request, provider):
        # Should use PostGIS distance, but here we assume pre-calculated distance or simple check
        # If distance is provided in input, use it.
        distance_km = provider.get("distance_km")
        if distance_km is not None:
            radius = request.get("broadcast_radius_km", 10)
            if distance_km > radius: return 0.0
            return 1.0 - (distance_km / radius)
        return 0.5 # Default if unknown

    def _score_budget(self, request, provider):
        req_min = request.get("budget_min")
        req_max = request.get("budget_max")
        prov_rate = provider.get("rate") # Assuming provider has a rate
        
        if not prov_rate or not req_max: return 0.5
        
        if prov_rate <= req_max:
            if req_min and prov_rate < req_min: return 0.8 # Too cheap might be suspicious
            return 1.0
        return max(0.0, 1.0 - ((prov_rate - req_max) / req_max))

    def _score_reputation(self, provider):
        rep = provider.get("reputation_base", 50.0)
        return min(rep / 100.0, 1.0)

    def _score_time(self, request, provider):
        # Placeholder for complex scheduling logic
        return 1.0

    def _score_culture(self, request, provider):
        # Check language overlap
        req_langs = set(request.get("languages", ["en"]))
        prov_langs = set(provider.get("languages", ["en"]))
        overlap = req_langs.intersection(prov_langs)
        return 1.0 if overlap else 0.0

    def _score_privacy(self, request, provider):
        # Check if provider meets requester's privacy needs
        req_level = request.get("privacy_level", "alias")
        prov_level = provider.get("privacy_level", "public")
        # Logic: If requester wants Ghost, provider must support it? 
        # Or just compatibility score.
        return 1.0
