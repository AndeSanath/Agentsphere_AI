from typing import Dict, Tuple

class SourceReliabilityService:
    """Configurable Source Reliability System for evaluating data credibility."""
    
    RELIABILITY_MAP: Dict[str, Tuple[float, str]] = {
        "government_filing": (1.00, "Very High"),
        "official_website": (0.90, "High"),
        "reputable_financial": (0.85, "High"),
        "major_news": (0.75, "Medium-High"),
        "job_posting": (0.65, "Medium"),
        "third_party_directory": (0.50, "Medium"),
        "unknown": (0.30, "Low")
    }

    @classmethod
    def get_score_and_level(cls, source_type: str) -> Tuple[float, str]:
        normalized = source_type.lower().replace(" ", "_")
        for key, val in cls.RELIABILITY_MAP.items():
            if key in normalized:
                return val
        return cls.RELIABILITY_MAP["unknown"]

source_reliability_service = SourceReliabilityService()
