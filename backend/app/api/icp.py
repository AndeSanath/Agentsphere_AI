from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime

from app.models.icp import ICP, ICPCreate, ICPUpdate
from app.models.user import UserResponse
from app.api.auth import get_current_user
from app.core.database import db_store

router = APIRouter(prefix="/icps", tags=["ICP Management"])

# Seed demo ICP if none exists
def seed_default_icp():
    if not db_store.icps:
        default_icp = ICP(
            id="icp_saas_growth",
            user_id="demo_user",
            name="SaaS Growth Companies",
            target_industry="SaaS",
            target_countries=["India", "United States"],
            min_employee_count=100,
            max_employee_count=1000,
            min_revenue=10.0,
            max_revenue=100.0,
            preferred_technologies=["Cloud", "AI", "Automation"],
            growth_signals=["Recent Expansion", "Funding"],
            hiring_signals=["Active Hiring", "Engineering Expansion"],
            description="High-growth SaaS companies expanding operations and hiring active tech roles."
        )
        db_store.icps[default_icp.id] = default_icp.dict()

seed_default_icp()

@router.post("", response_model=ICP, status_code=status.HTTP_201_CREATED)
def create_icp(payload: ICPCreate, current_user: Optional[UserResponse] = Depends(get_current_user)):
    """Create a new Ideal Customer Profile."""
    user_id = current_user.id if current_user else "demo_user"
    icp_obj = ICP(
        user_id=user_id,
        name=payload.name,
        target_industry=payload.target_industry,
        target_countries=payload.target_countries,
        min_employee_count=payload.min_employee_count,
        max_employee_count=payload.max_employee_count,
        min_revenue=payload.min_revenue,
        max_revenue=payload.max_revenue,
        preferred_technologies=payload.preferred_technologies,
        growth_signals=payload.growth_signals,
        hiring_signals=payload.hiring_signals,
        description=payload.description or "",
        scoring_weights=payload.scoring_weights or ICPCreate.__fields__['scoring_weights'].default_factory()
    )
    db_store.icps[icp_obj.id] = icp_obj.dict()
    return icp_obj

@router.get("", response_model=List[ICP])
def list_icps():
    """Fetch all saved Ideal Customer Profiles."""
    seed_default_icp()
    return [ICP(**icp_data) for icp_data in db_store.icps.values()]

@router.get("/{icp_id}", response_model=ICP)
def get_icp(icp_id: str):
    """Retrieve specific ICP by ID."""
    if icp_id not in db_store.icps:
        raise HTTPException(status_code=404, detail="ICP not found")
    return ICP(**db_store.icps[icp_id])

@router.put("/{icp_id}", response_model=ICP)
def update_icp(icp_id: str, payload: ICPUpdate):
    """Update an existing ICP."""
    if icp_id not in db_store.icps:
        raise HTTPException(status_code=404, detail="ICP not found")
    
    icp_dict = db_store.icps[icp_id]
    update_data = payload.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        if value is not None:
            icp_dict[key] = value
            
    icp_dict["updated_at"] = datetime.utcnow().isoformat()
    db_store.icps[icp_id] = icp_dict
    return ICP(**icp_dict)

@router.delete("/{icp_id}")
def delete_icp(icp_id: str):
    """Delete an ICP."""
    if icp_id not in db_store.icps:
        raise HTTPException(status_code=404, detail="ICP not found")
    del db_store.icps[icp_id]
    return {"status": "success", "message": f"ICP {icp_id} deleted successfully"}
