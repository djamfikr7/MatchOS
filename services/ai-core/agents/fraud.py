from typing import Dict, Any, List

class FraudAgent:
    def __init__(self):
        pass

    def scan_transaction(self, transaction: Dict[str, Any], category_config: Dict[str, Any]) -> List[str]:
        signals = []
        fraud_rules = category_config.get("fraud_signals", [])
        
        amount = transaction.get("amount", 0)
        
        if "price_below_market_30_percent" in fraud_rules:
            # Mock check
            if amount < 1000: # Example threshold
                signals.append("PRICE_TOO_LOW")
                
        return signals

    def run_signal_check(self, provider: Dict[str, Any]) -> List[str]:
        signals = []
        # Check reputation
        if provider.get("reputation_base", 50) < 20:
            signals.append("LOW_REPUTATION")
            
        return signals
