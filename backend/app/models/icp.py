from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid

class ScoringWeights(BaseModel):
    industry: float = 25.0
    company_size: float = 20.0
    revenue: float = 15.0
    growth: float = 15.0
    technology: float = 15.0
    hiring: float = 10.0

class ICPCreate(BaseModel):
    name: str
    target_industry: str
    target_countries: List[str] = Field(default_factory=lambda: ["India", "United States"])
    min_employee_count: int = 100
    max_employee_count: int = 1000
    min_revenue: float = 10.0  # Millions USD
    max_revenue: float = 500.0 # Millions USD
    preferred_technologies: List[str] = Field(default_factory=lambda: ["Cloud", "AI", "Automation"])
    growth_signals: List[str] = Field(default_factory=lambda: ["Recent Expansion", "Funding"])
    hiring_signals: List[str] = Field(default_factory=lambda: ["Active Hiring", "Engineering Hiring"])
    description: Optional[str] = ""
    scoring_weights: Optional[ScoringWeights] = Field(default_factory=ScoringWeights)

class ICPUpdate(BaseModel):
    name: Optional[str] = None
    target_industry: Optional[str] = None
    target_countries: Optional[List[str]] = None
    min_employee_count: Optional[int] = None
    max_employee_count: Optional[int] = None
    min_revenue: Optional[float] = None
    max_revenue: Optional[float] = None
    preferred_technologies: Optional[List[str]] = None
    growth_signals: Optional[List[str]] = None
    hiring_signals: Optional[List[str]] = None
    description: Optional[str] = None
    scoring_weights: Optional[ScoringWeights] = None

class ICP(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str = "demo_user"
    name: str
    target_industry: str
    target_countries: List[str]
    min_employee_count: int
    max_employee_count: int
    min_revenue: float
    max_revenue: float
    preferred_technologies: List[str]
    growth_signals: List[str]
    hiring_signals: List[str]
    description: Optional[str] = ""
    scoring_weights: ScoringWeights = Field(default_factory=ScoringWeights)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
