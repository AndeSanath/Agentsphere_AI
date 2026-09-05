from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class SearchStatus(str, Enum):
    IDLE = "idle"
    PLANNING = "planning"
    DISCOVERING = "discovering"
    RESEARCHING = "researching"
    MATCHING = "matching"
    VALIDATING = "validating"
    IDENTIFYING_DECISION_MAKERS = "identifying_decision_makers"
    ENRICHING_CONTACTS = "enriching_contacts"
    NEEDS_HUMAN_REVIEW = "needs_human_review"
    COMPLETED = "completed"
    FAILED = "failed"

class ICPCriteria(BaseModel):
    industry: Optional[str] = "SaaS"
    location: Optional[str] = "Hyderabad"
    employee_range: Optional[str] = "100-500"
    target_role: Optional[str] = "CTO"
    technology: Optional[str] = None
    revenue_range: Optional[str] = None
    business_type: Optional[str] = "B2B"
    funding_stage: Optional[str] = "Series A / Bootstrapped"
    growth_signals: Optional[str] = "Hiring, Expansion"
    target_geography: Optional[str] = "Global / APAC"
    compliance_certifications: Optional[str] = "SOC2, ISO27001"
    target_department: Optional[str] = "Engineering & Technology"
    other_requirements: Optional[str] = None

class SearchRequest(BaseModel):
    query: Optional[str] = None
    icp: Optional[ICPCriteria] = None

class TaskPlanItem(BaseModel):
    id: int
    name: str
    agent: str
    description: str
    status: str = "waiting" # waiting, running, completed, failed, needs_review
    duration_ms: Optional[int] = None
    output_summary: Optional[str] = None

class SearchRecord(BaseModel):
    id: str
    query: str
    icp: ICPCriteria
    status: SearchStatus
    tasks: List[TaskPlanItem] = []
    total_organizations_found: int = 0
    qualified_prospects_count: int = 0
    decision_makers_found: int = 0
    pending_reviews_count: int = 0
    created_at: str
    updated_at: str
