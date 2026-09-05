from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.models.search import ICPCriteria, TaskPlanItem, SearchStatus
from app.models.organization import Organization
from app.models.memory import SharedMemoryFact, HumanReviewItem

class AgentExecutionState(BaseModel):
    search_id: str
    raw_query: Optional[str] = None
    icp: ICPCriteria
    status: SearchStatus = SearchStatus.IDLE
    tasks: List[TaskPlanItem] = []
    organizations: List[Organization] = []
    shared_facts: List[SharedMemoryFact] = []
    reviews: List[HumanReviewItem] = []
    current_agent_index: int = 0
    logs: List[str] = []
