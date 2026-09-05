from typing import List, Dict, Any, Tuple
from app.services.validation_service import validation_service

class ValidationAgent:
    """Agent responsible for cross-source validation, conflict detection, and confidence scoring."""

    def run(self, raw_research: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """Validate raw multi-source intelligence records."""
        validated_facts, overall_metrics = validation_service.validate_company_attributes(raw_research)
        return validated_facts, overall_metrics

validation_agent = ValidationAgent()
