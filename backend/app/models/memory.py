from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class SharedMemoryFact(BaseModel):
    id: str
    search_id: str
    entity_type: str  # "Organization", "DecisionMaker", "Contact", "ICP_Rule"
    entity_name: str
    fact_key: str
    fact_value: str
    source_name: str
    confidence: str
    agent_creator: str
    timestamp: str

class HumanReviewItem(BaseModel):
    id: str
    search_id: str
    organization_id: str
    organization_name: str
    title: str  # e.g., "Decision Maker Conflict: CTO Role"
    description: str
    conflict_type: str  # "title_conflict", "location_mismatch", "employee_count_discrepancy"
    source_a_val: str
    source_a_label: str
    source_b_val: str
    source_b_label: str
    status: str  # "pending", "approved", "rejected", "uncertain"
    selected_option: Optional[str] = None
    created_at: str
