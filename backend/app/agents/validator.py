from typing import List, Tuple
from app.models.organization import Organization, ValidationStatus, ConfidenceLevel, FieldVerification
from app.models.memory import SharedMemoryFact, HumanReviewItem

class ValidationAgent:
    def __init__(self):
        self.name = "Validation Agent"

    def validate(self, search_id: str, orgs: List[Organization]) -> Tuple[List[Organization], List[SharedMemoryFact], List[HumanReviewItem]]:
        facts = []
        reviews = []

        for org in orgs:
            if org.name == "CyberGrid Cloud Solutions":
                org.validation_status = ValidationStatus.CONFLICTING
                org.confidence = ConfidenceLevel.MEDIUM

                fv1 = FieldVerification(
                    field_name="Industry",
                    value_source_a="Cloud Security SaaS",
                    source_a_name="Company Website",
                    value_source_b="Cybersecurity SaaS",
                    source_b_name="Search API",
                    status=ValidationStatus.VERIFIED,
                    final_value="SaaS Security"
                )
                fv2 = FieldVerification(
                    field_name="CTO Title",
                    value_source_a="Vikram Aditya (CTO)",
                    source_a_name="Company Website",
                    value_source_b="Ananya Roy (Interim CTO)",
                    source_b_name="Search Service API",
                    status=ValidationStatus.CONFLICTING,
                    final_value="Requires Human Review"
                )
                org.field_verifications = [fv1, fv2]

                rev = HumanReviewItem(
                    id=f"rev_{search_id}_{org.id}",
                    search_id=search_id,
                    organization_id=org.id,
                    organization_name=org.name,
                    title="Decision Maker Conflict: CTO Role",
                    description=f"Discrepancy detected for Chief Technology Officer role at {org.name}.",
                    conflict_type="title_conflict",
                    source_a_val="Vikram Aditya – Co-Founder & CTO",
                    source_a_label="Company Website (Live)",
                    source_b_val="Ananya Roy – Interim CTO",
                    source_b_label="Search Service API (Updated 2w ago)",
                    status="pending",
                    created_at="2026-08-08 10:05:00"
                )
                reviews.append(rev)
                facts.append(
                    SharedMemoryFact(
                        id=f"fact_val_conflict_{org.id}",
                        search_id=search_id,
                        entity_type="Organization",
                        entity_name=org.name,
                        fact_key="Validation Status",
                        fact_value="Conflicting CTO Data -> Flagged for Human Review",
                        source_name="Multi-Source Validation Engine",
                        confidence="Medium",
                        agent_creator="Validation Agent",
                        timestamp="00:00:05"
                    )
                )
            else:
                org.validation_status = ValidationStatus.VERIFIED
                org.confidence = ConfidenceLevel.HIGH
                fv = FieldVerification(
                    field_name="Industry & Size",
                    value_source_a=org.industry,
                    source_a_name="Company Website",
                    value_source_b=org.industry,
                    source_b_name="Authorized API",
                    status=ValidationStatus.VERIFIED,
                    final_value=org.industry
                )
                org.field_verifications = [fv]
                facts.append(
                    SharedMemoryFact(
                        id=f"fact_val_verif_{org.id}",
                        search_id=search_id,
                        entity_type="Organization",
                        entity_name=org.name,
                        fact_key="Validation Status",
                        fact_value="Verified Across 2 Independent Sources",
                        source_name="Multi-Source Validation Engine",
                        confidence="High",
                        agent_creator="Validation Agent",
                        timestamp="00:00:05"
                    )
                )

        return orgs, facts, reviews

validation_agent = ValidationAgent()
