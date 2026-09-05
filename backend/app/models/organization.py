from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class ValidationStatus(str, Enum):
    VERIFIED = "Verified"
    PARTIALLY_VERIFIED = "Partially Verified"
    CONFLICTING = "Conflicting"
    INSUFFICIENT_DATA = "Insufficient Data"

class ConfidenceLevel(str, Enum):
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ContactVerification(str, Enum):
    VERIFIED = "Verified"
    UNVERIFIED = "Unverified"
    UNAVAILABLE = "Unavailable"

class DataSource(BaseModel):
    name: str  # e.g., "Company Website", "Authorized Data API", "Search Service", "Demo Data"
    url: Optional[str] = None
    last_checked: str
    is_demo: bool = True

class MatchCriteriaResult(BaseModel):
    criterion: str  # e.g. "Industry: SaaS"
    matched: bool
    details: str

class DecisionMaker(BaseModel):
    id: str
    name: str
    role: str
    organization_id: str
    organization_name: str
    email: Optional[str] = None
    email_status: ContactVerification = ContactVerification.UNVERIFIED
    phone: Optional[str] = None
    phone_status: ContactVerification = ContactVerification.UNAVAILABLE
    linkedin_url: Optional[str] = None
    source: DataSource
    confidence: ConfidenceLevel = ConfidenceLevel.MEDIUM
    is_conflicting: bool = False
    conflict_details: Optional[str] = None

class ContactInfo(BaseModel):
    email: Optional[str] = None
    email_status: ContactVerification = ContactVerification.UNAVAILABLE
    phone: Optional[str] = None
    phone_status: ContactVerification = ContactVerification.UNAVAILABLE
    website: Optional[str] = None
    address: Optional[str] = None

class FieldVerification(BaseModel):
    field_name: str
    value_source_a: str
    source_a_name: str
    value_source_b: Optional[str] = None
    source_b_name: Optional[str] = None
    status: ValidationStatus
    final_value: str

class Organization(BaseModel):
    id: str
    search_id: str
    name: str
    website: str
    logo_url: Optional[str] = None
    industry: str
    description: str
    products_services: List[str] = []
    location: str
    city: str
    country: str
    employee_count: int
    employee_range: str
    revenue_range: Optional[str] = None
    business_type: str  # SaaS, FinTech, Enterprise B2B, etc.
    target_market: str
    icp_match_score: int  # 0 to 100
    icp_match_details: List[MatchCriteriaResult] = []
    validation_status: ValidationStatus
    confidence: ConfidenceLevel
    sources: List[DataSource] = []
    decision_makers: List[DecisionMaker] = []
    contact_info: ContactInfo
    field_verifications: List[FieldVerification] = []
    summary: str
    recommended_action: str
    is_demo_data: bool = True
