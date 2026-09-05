from typing import List, Tuple
from app.models.organization import Organization
from app.models.memory import SharedMemoryFact

class ContactEnrichmentAgent:
    def __init__(self):
        self.name = "Contact Enrichment Agent"

    def enrich(self, search_id: str, orgs: List[Organization]) -> Tuple[List[Organization], List[SharedMemoryFact]]:
        facts = []
        for org in orgs:
            for dm in org.decision_makers:
                if dm.email:
                    facts.append(
                        SharedMemoryFact(
                            id=f"fact_contact_{dm.id}",
                            search_id=search_id,
                            entity_type="Contact",
                            entity_name=dm.name,
                            fact_key="Business Email Verification",
                            fact_value=f"{dm.email} ({dm.email_status.value})",
                            source_name="Contact Enrichment Engine",
                            confidence=dm.confidence.value,
                            agent_creator="Contact Enrichment Agent",
                            timestamp="00:00:07"
                        )
                    )
        return orgs, facts

contact_enrichment_agent = ContactEnrichmentAgent()
contact_enricher_agent = contact_enrichment_agent
