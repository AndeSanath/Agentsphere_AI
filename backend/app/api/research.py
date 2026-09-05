from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from typing import Dict, Any, Optional

from app.agents.orchestrator import orchestrator_agent
from app.core.database import db_store

router = APIRouter(prefix="/research", tags=["Research Workflow"])

@router.post("/start/{icp_id}")
def start_research_workflow(icp_id: str, background_tasks: BackgroundTasks):
    """Start asynchronous multi-agent prospect discovery & research pipeline for an ICP."""
    if icp_id not in db_store.icps and icp_id != "icp_saas_growth":
        # Create default fallback if needed
        pass
    
    # Run synchronously or background task
    res = orchestrator_agent.run_workflow(icp_id=icp_id)
    return {
        "status": "started",
        "job_id": res["job_id"],
        "message": "Multi-agent research pipeline initiated successfully",
        "result": res
    }

@router.get("/status/{job_id}")
def get_research_job_status(job_id: str):
    """Fetch live execution status, progress percentage, and step logs for a research job."""
    if job_id not in db_store.research_jobs:
        raise HTTPException(status_code=404, detail="Research job not found")
    return db_store.research_jobs[job_id]
