import re
from typing import List, Dict, Any
from app.utils.demo_data import DEMO_COMPANIES

class CompanyDiscoveryAgent:
    """Agent responsible for discovering candidate companies matching the ICP, name normalization, and deduplication."""
    
    @staticmethod
    def normalize_name(name: str) -> str:
        """Normalize company name to lowercase alphanumeric string for deduplication."""
        return re.sub(r'[^a-z0-9]', '', name.lower())

    def run(self, icp_criteria: Dict[str, Any]) -> Dict[str, Any]:
        """Find candidate companies based on ICP criteria and deduplicate."""
        raw_candidates = DEMO_COMPANIES
        
        target_ind = (icp_criteria.get("target_industry") or "").lower()
        target_countries = [c.lower() for c in icp_criteria.get("target_countries") or []]

        discovered = []
        seen_normalized = set()

        for comp in raw_candidates:
            norm_name = self.normalize_name(comp["name"])
            if norm_name in seen_normalized:
                continue

            comp_ind = (comp.get("industry") or "").lower()
            comp_loc = (comp.get("location") or "").lower()

            # Include if matching or relevant
            is_ind_match = not target_ind or target_ind in comp_ind or comp_ind in target_ind or "saas" in comp_ind or "tech" in comp_ind
            is_loc_match = not target_countries or any(tc in comp_loc for tc in target_countries) or len(target_countries) == 0

            if is_ind_match or is_loc_match:
                seen_normalized.add(norm_name)
                discovered.append({
                    "id": comp.get("id"),
                    "name": comp["name"],
                    "normalized_name": norm_name,
                    "website": comp.get("website", ""),
                    "industry": comp.get("industry", ""),
                    "location": comp.get("location", ""),
                    "description": comp.get("description", "")
                })

        return {
            "companies": discovered
        }

discovery_agent = CompanyDiscoveryAgent()
