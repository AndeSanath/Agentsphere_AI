from typing import Dict, Any, List

class InsightGenerationAgent:
    """Agent responsible for producing evidence-grounded business rationale and risk assessments."""

    def run(self, company: Dict[str, Any], score_result: Dict[str, Any], validated_facts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Synthesize evidence-based prospect insights."""
        total_score = score_result.get("total_score", 0)
        strengths = score_result.get("strengths", [])
        weaknesses = score_result.get("weaknesses", [])

        # Check for data conflicts or low-confidence fields
        low_conf_facts = [f for f in validated_facts if f.get("needs_human_review", False) or f.get("confidence_score", 100) < 60]

        summary_lines = []
        if total_score >= 80:
            summary_lines.append(f"Strong prospect match (Score: {total_score}/100). Highly aligned with Ideal Customer Profile.")
        elif total_score >= 60:
            summary_lines.append(f"Moderate prospect match (Score: {total_score}/100). Good core criteria alignment with minor gaps.")
        else:
            summary_lines.append(f"Lower prospect match (Score: {total_score}/100). Key criteria fall outside target ICP parameters.")

        narrative_bullets = []
        for s in strengths[:3]:
            narrative_bullets.append(f"• {s}")

        potential_risks = []
        for w in weaknesses:
            potential_risks.append(f"• {w}")

        if low_conf_facts:
            low_attrs = [f.get("attribute") for f in low_conf_facts]
            potential_risks.append(f"• Data confidence for {', '.join(low_attrs)} is below 60% and should be reviewed by a human auditor.")

        insight_text = "\n".join(summary_lines + ["\nKey Highlights:"] + narrative_bullets + ["\nPotential Risks / Audit Notes:"] + (potential_risks or ["• No significant risks detected."]))

        return {
            "summary": summary_lines[0] if summary_lines else "Prospect evaluation complete.",
            "insights_markdown": insight_text,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "risks": potential_risks
        }

insight_agent = InsightGenerationAgent()
