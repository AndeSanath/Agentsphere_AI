from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime

from app.models.user import User, UserCreate, UserLogin, UserResponse, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from app.core.database import db_store

router = APIRouter(prefix="/auth", tags=["Authentication"])
security_scheme = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)) -> UserResponse:
    """Retrieve the currently authenticated user from JWT token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload["sub"]
    user_data = db_store.users.get(user_id)
    if not user_data:
        # Check by email as fallback
        for u in db_store.users.values():
            if u["email"] == user_id or u["id"] == user_id:
                user_data = u
                break
    if not user_data:
        raise HTTPException(status_code=404, detail="User account not found")
    
    return UserResponse(
        id=user_data["id"],
        name=user_data["name"],
        email=user_data["email"],
        created_at=user_data["created_at"]
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate):
    """Register a new user account."""
    # Check if user already exists
    for existing_user in db_store.users.values():
        if existing_user["email"].lower() == payload.email.lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
    
    hashed_pwd = hash_password(payload.password)
    user_obj = User(
        name=payload.name,
        email=payload.email.lower(),
        password_hash=hashed_pwd
    )
    
    # Save user to DB store
    db_store.users[user_obj.id] = user_obj.dict()
    
    # Generate token
    token = create_access_token(subject=user_obj.id)
    user_resp = UserResponse(
        id=user_obj.id,
        name=user_obj.name,
        email=user_obj.email,
        created_at=user_obj.created_at
    )
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)

@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin):
    """Authenticate user credentials and return JWT token."""
    target_user = None
    for u in db_store.users.values():
        if u["email"].lower() == payload.email.lower():
            target_user = u
            break
            
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    if not verify_password(payload.password, target_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
        
    token = create_access_token(subject=target_user["id"])
    user_resp = UserResponse(
        id=target_user["id"],
        name=target_user["name"],
        email=target_user["email"],
        created_at=target_user["created_at"]
    )
    return TokenResponse(access_token=token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Fetch details of current authenticated user."""
    return current_user
