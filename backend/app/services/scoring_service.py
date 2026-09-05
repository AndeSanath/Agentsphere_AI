from typing import Dict, Any, List, Tuple

class ProspectScoringService:
    """Deterministic 0-100 Prospect Scoring Engine."""
    
    @staticmethod
    def calculate_score(company: Dict[str, Any], icp: Dict[str, Any], validated_facts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate deterministic prospect score based on ICP criteria and validated company intelligence."""
        weights = icp.get("scoring_weights", {})
        if isinstance(weights, dict):
            w_ind = weights.get("industry", 25.0)
            w_size = weights.get("company_size", 20.0)
            w_rev = weights.get("revenue", 15.0)
            w_growth = weights.get("growth", 15.0)
            w_tech = weights.get("technology", 15.0)
            w_hiring = weights.get("hiring", 10.0)
        else:
            w_ind, w_size, w_rev, w_growth, w_tech, w_hiring = 25.0, 20.0, 15.0, 15.0, 15.0, 10.0

        # Helper to get validated value
        facts_map = {f.get("attribute"): f.get("validated_value") for f in validated_facts}
        confidences = {f.get("attribute"): f.get("confidence_score", 0) for f in validated_facts}

        strengths = []
        weaknesses = []

        # 1. Industry Match
        comp_industry = (facts_map.get("industry") or company.get("industry") or "").lower()
        target_industry = icp.get("target_industry", "").lower()
        industry_score = 0.0
        if comp_industry and target_industry:
            if target_industry in comp_industry or comp_industry in target_industry:
                industry_score = w_ind
                strengths.append(f"Strong industry alignment ({company.get('industry', 'Target Industry')})")
            else:
                industry_score = w_ind * 0.3
                weaknesses.append(f"Industry '{company.get('industry')}' only partially aligns with target '{icp.get('target_industry')}'")
        else:
            weaknesses.append("Industry information unavailable")

        # 2. Company Size Match
        comp_emp = facts_map.get("employee_count") or company.get("employee_count") or 0
        min_emp = icp.get("min_employee_count", 0)
        max_emp = icp.get("max_employee_count", 100000)
        size_score = 0.0
        if comp_emp:
            if min_emp <= comp_emp <= max_emp:
                size_score = w_size
                strengths.append(f"Employee count ({comp_emp}) fits target range ({min_emp}–{max_emp})")
            elif comp_emp < min_emp:
                size_score = w_size * (comp_emp / max(min_emp, 1))
                weaknesses.append(f"Employee count ({comp_emp}) is below minimum target threshold ({min_emp})")
            else:
                size_score = w_size * 0.7
                strengths.append(f"Established workforce ({comp_emp} employees)")
        else:
            weaknesses.append("Employee count data unavailable")

        # 3. Revenue Match
        comp_rev = facts_map.get("revenue_millions") or company.get("revenue_millions") or 0.0
        min_rev = icp.get("min_revenue", 0.0)
        max_rev = icp.get("max_revenue", 1000.0)
        rev_score = 0.0
        if comp_rev:
            if min_rev <= comp_rev <= max_rev:
                rev_score = w_rev
                strengths.append(f"Estimated revenue (${comp_rev:.1f}M) meets ICP financial criteria")
            elif comp_rev >= min_rev:
                rev_score = w_rev * 0.9
                strengths.append(f"High annual revenue estimate (${comp_rev:.1f}M)")
            else:
                rev_score = w_rev * 0.4
                weaknesses.append(f"Estimated revenue (${comp_rev:.1f}M) is lower than preferred target (${min_rev:.1f}M)")
        else:
            weaknesses.append("Revenue data has medium/low confidence or is unverified")

        # 4. Growth Signals
        comp_growth = facts_map.get("growth_signals") or company.get("growth_signals") or []
        icp_growth = icp.get("growth_signals") or []
        growth_score = 0.0
        if comp_growth and icp_growth:
            matches = [g for g in comp_growth if any(ig.lower() in g.lower() for ig in icp_growth)]
            if matches:
                growth_score = w_growth
                strengths.append(f"Verified growth signals: {', '.join(matches)}")
            else:
                growth_score = w_growth * 0.5
        elif comp_growth:
            growth_score = w_growth * 0.8
            strengths.append(f"Active growth indicators detected: {', '.join(comp_growth)}")
        else:
            weaknesses.append("No explicit growth signals detected in research")

        # 5. Technology Match
        comp_tech = facts_map.get("technologies") or company.get("technologies") or []
        icp_tech = icp.get("preferred_technologies") or []
        tech_score = 0.0
        if comp_tech and icp_tech:
            matched_tech = [t for t in comp_tech if any(it.lower() in t.lower() for it in icp_tech)]
            if matched_tech:
                ratio = len(matched_tech) / max(len(icp_tech), 1)
                tech_score = min(w_tech, w_tech * (ratio + 0.3))
                strengths.append(f"Matching tech stack adoption: {', '.join(matched_tech)}")
            else:
                tech_score = w_tech * 0.3
                weaknesses.append("Technology stack signals have medium confidence")
        elif comp_tech:
            tech_score = w_tech * 0.6
        else:
            weaknesses.append("Technology stack details not fully indexed")

        # 6. Hiring Signals
        comp_hiring = facts_map.get("hiring_signals") or company.get("hiring_signals") or []
        hiring_score = 0.0
        if comp_hiring:
            hiring_score = w_hiring
            strengths.append(f"Active hiring activity ({', '.join(comp_hiring)})")
        else:
            hiring_score = w_hiring * 0.2
            weaknesses.append("No recent hiring signals found")

        total_score = int(round(industry_score + size_score + rev_score + growth_score + tech_score + hiring_score))
        total_score = max(0, min(100, total_score))

        breakdown = {
            "industry_match": round(industry_score, 1),
            "company_size": round(size_score, 1),
            "revenue": round(rev_score, 1),
            "growth": round(growth_score, 1),
            "technology": round(tech_score, 1),
            "hiring": round(hiring_score, 1)
        }

        return {
            "total_score": total_score,
            "breakdown": breakdown,
            "strengths": strengths,
            "weaknesses": weaknesses
        }

scoring_service = ProspectScoringService()
