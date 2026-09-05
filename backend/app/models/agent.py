from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum

class AgentStatus(str, Enum):
    IDLE = "Idle"
    ACTIVE = "Active"
    WAITING = "Waiting"
    DISABLED = "Disabled"
    NEEDS_REVIEW = "Needs Review"

class AgentInfo(BaseModel):
    id: str
    name: str
    code: str
    purpose: str
    status: AgentStatus
    model: str
    tools: List[str]
    last_execution: str
    total_executions: int
    success_rate: float
    avg_latency_ms: int
    enabled: bool = True
