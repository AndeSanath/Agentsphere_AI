from typing import List, Dict, Any, Tuple
from app.services.source_reliability import source_reliability_service
from app.core.config import settings

class MultiSourceValidationService:
    """Validation service that groups data by attribute, detects conflicts, and calculates confidence scores."""
    
    @staticmethod
    def validate_company_attributes(raw_research: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """Validate raw multi-source research records for a company and calculate attribute confidence scores."""
        # Group by attribute
        grouped: Dict[str, List[Dict[str, Any]]] = {}
        for item in raw_research:
            attr = item.get("attribute")
            if not attr:
                continue
            if attr not in grouped:
                grouped[attr] = []
            grouped[attr].append(item)

        validated_facts = []
        overall_confidence_total = 0
        overall_attr_count = 0

        for attr, items in grouped.items():
            fact = MultiSourceValidationService._validate_single_attribute(attr, items)
            validated_facts.append(fact)
            overall_confidence_total += fact["confidence_score"]
            overall_attr_count += 1

        overall_score = (overall_confidence_total / overall_attr_count) if overall_attr_count > 0 else 50.0
        overall_level = "High" if overall_score >= 80 else ("Medium" if overall_score >= 60 else "Low")

        overall_metrics = {
            "overall_confidence_score": round(overall_score, 1),
            "overall_confidence_level": overall_level,
            "total_attributes_validated": overall_attr_count,
            "has_conflicts": any(len(f.get("conflicts", [])) > 0 for f in validated_facts),
            "pending_human_reviews": sum(1 for f in validated_facts if f.get("needs_human_review", False))
        }

        return validated_facts, overall_metrics

    @staticmethod
    def _validate_single_attribute(attribute: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Validate single attribute across multiple raw sources."""
        sources_summary = []
        conflicts = []
        
        # Calculate reliability weight for each source item
        weighted_values = []
        for item in items:
            source = item.get("source", "Unknown Source")
            val = item.get("value")
            rel_score, rel_level = source_reliability_service.get_score_and_level(source)
            item_conf = float(item.get("confidence", 0.7)) * rel_score
            
            weighted_values.append({
                "value": val,
                "source": source,
                "source_url": item.get("source_url", ""),
                "timestamp": item.get("timestamp", ""),
                "reliability_score": rel_score,
                "combined_weight": item_conf
            })
            sources_summary.append(source)

        # Numerical vs String vs List attribute consensus
        if not weighted_values:
            return {
                "attribute": attribute,
                "validated_value": "Not Available",
                "confidence_score": 30.0,
                "confidence_level": "Low",
                "conflicts": [],
                "supporting_sources": [],
                "needs_human_review": True,
                "reason": "Insufficient reliable information found."
            }

        # Numeric processing (e.g. employee_count or revenue_millions)
        numeric_vals = []
        for wv in weighted_values:
            v = wv["value"]
            if isinstance(v, (int, float)):
                numeric_vals.append((v, wv["combined_weight"], wv["source"]))
            elif isinstance(v, str) and v.replace(".", "", 1).isdigit():
                numeric_vals.append((float(v), wv["combined_weight"], wv["source"]))

        if numeric_vals:
            # Check for numeric outliers/conflicts
            vals_only = [nv[0] for nv in numeric_vals]
            min_val = min(vals_only)
            max_val = max(vals_only)
            
            # Significant divergence check (e.g. max > 2x min)
            if len(vals_only) > 1 and max_val > (min_val * 2.0):
                # Conflict detected! E.g. $20M vs $22M vs $100M
                # Find majority cluster
                vals_only_sorted = sorted(vals_only)
                # Compute median or dominant range
                median_val = vals_only_sorted[len(vals_only_sorted) // 2]
                outliers = [v for v in vals_only if v > median_val * 2.0 or v < median_val / 2.0]
                
                if outliers:
                    conflicts.append({
                        "attribute": attribute,
                        "outlying_values": outliers,
                        "majority_estimate": median_val,
                        "message": f"Source values diverge significantly (range: {min_val} to {max_val}). Outliers identified."
                    })
                    
                validated_val = f"Approximately {min_val}–{max_val}" if not outliers else f"Estimated {median_val}"
                confidence_score = 55.0  # Medium-low due to conflict
                confidence_level = "Medium"
                reason = "Two consistent sources support estimated range. One source significantly differs from majority."
            else:
                avg_val = sum(v * w for v, w, s in numeric_vals) / sum(w for v, w, s in numeric_vals)
                if attribute == "employee_count":
                    validated_val = int(round(avg_val))
                else:
                    validated_val = round(avg_val, 1)
                    
                confidence_score = min(95.0, 75.0 + len(numeric_vals) * 10)
                confidence_level = "High" if confidence_score >= 80 else "Medium"
                reason = f"Consistent data across {len(numeric_vals)} source(s)."
        else:
            # Categorical / string consensus
            val_counts: Dict[str, float] = {}
            for wv in weighted_values:
                str_v = str(wv["value"])
                val_counts[str_v] = val_counts.get(str_v, 0.0) + wv["combined_weight"]
                
            best_val = max(val_counts.items(), key=lambda x: x[1])[0]
            
            if len(val_counts) > 1:
                conflicts.append({
                    "attribute": attribute,
                    "differing_values": list(val_counts.keys()),
                    "selected": best_val
                })
                confidence_score = 65.0
                confidence_level = "Medium"
                reason = f"Selected majority value '{best_val}' among {len(val_counts)} differing descriptions."
            else:
                confidence_score = 90.0
                confidence_level = "High"
                reason = f"Unanimous agreement across sources."
            
            validated_val = items[0]["value"] if len(val_counts) == 1 else best_val

        needs_review = confidence_score < settings.CONFIDENCE_REVIEW_THRESHOLD

        return {
            "attribute": attribute,
            "validated_value": validated_val,
            "confidence_score": round(confidence_score, 1),
            "confidence_level": confidence_level,
            "conflicts": conflicts,
            "supporting_sources": sources_summary,
            "needs_human_review": needs_review,
            "reason": reason
        }

validation_service = MultiSourceValidationService()
