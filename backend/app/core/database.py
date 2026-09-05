import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.core.config import settings

logger = logging.getLogger("agentsphere.database")

class InMemoryStore:
    """Thread-safe, structured in-memory fallback store for offline development and testing."""
    def __init__(self):
        self.users: Dict[str, Dict[str, Any]] = {}
        self.icps: Dict[str, Dict[str, Any]] = {}
        self.companies: Dict[str, Dict[str, Any]] = {}
        self.research_results: Dict[str, List[Dict[str, Any]]] = {}  # company_id -> list of results
        self.validated_intelligence: Dict[str, List[Dict[str, Any]]] = {} # company_id -> list of validated facts
        self.prospect_scores: Dict[str, Dict[str, Any]] = {} # company_id -> score obj
        self.human_reviews: Dict[str, Dict[str, Any]] = {} # review_id -> review obj
        self.research_jobs: Dict[str, Dict[str, Any]] = {} # job_id -> job status

db_store = InMemoryStore()

# Motor Client setup
try:
    import motor.motor_asyncio
    mongo_client = motor.motor_asyncio.AsyncIOMotorClient(
        settings.MONGODB_URL, serverSelectionTimeoutMS=2000
    )
    mongo_db = mongo_client[settings.DATABASE_NAME]
except Exception as e:
    logger.warning(f"MongoDB not initialized, using InMemoryStore fallback: {e}")
    mongo_client = None
    mongo_db = None

async def check_database_connection() -> bool:
    """Check whether MongoDB is accessible."""
    if mongo_client:
        try:
            await mongo_client.admin.command('ping')
            return True
        except Exception:
            return False
    return False
