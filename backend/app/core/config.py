import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "AgentSphere AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "agentsphere_ai")
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "agentsphere_super_secret_jwt_key_2026_change_in_production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "").strip()
    SEARCH_API_KEY: str = os.getenv("SEARCH_API_KEY", "").strip()
    APOLLO_API_KEY: str = os.getenv("APOLLO_API_KEY", os.getenv("SEARCH_API_KEY", "")).strip()
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", os.getenv("LLM_API_KEY", "")).strip()
    HUNTER_API_KEY: str = os.getenv("HUNTER_API_KEY", "").strip()

    @property
    def DATABASE_URL(self) -> str:
        return self.MONGODB_URL

    # Human Review Approval Settings
    AUTO_APPROVE_THRESHOLD: float = float(os.getenv("AUTO_APPROVE_THRESHOLD", "0.85"))
    CONFIDENCE_REVIEW_THRESHOLD: float = 60.0  # Attributes with confidence < 60% trigger human review

    @property
    def is_demo_mode(self) -> bool:
        # Default to True if LLM or SEARCH credentials are not provided
        return not bool(self.LLM_API_KEY and self.SEARCH_API_KEY)

settings = Settings()
