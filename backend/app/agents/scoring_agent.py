from typing import Dict, Any, List
from app.services.scoring_service import scoring_service

class ProspectScoringAgent:
    """Agent responsible for deterministic prospect scoring (0 to 100)."""

    def run(self, company: Dict[str, Any], icp: Dict[str, Any], validated_facts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Execute deterministic prospect scoring algorithm."""
        return scoring_service.calculate_score(company, icp, validated_facts)

scoring_agent = ProspectScoringAgent()
