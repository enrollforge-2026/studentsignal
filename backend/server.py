from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

# Import local modules
from models import (
    College, CollegeCreate, CollegeUpdate,
    Scholarship, ScholarshipCreate,
    User, UserCreate, UserLogin, UserResponse, Token, SavedItem,
    IPEDSSync, IPEDSStatus
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_email, ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import (
    db, colleges_collection, scholarships_collection,
    users_collection, ipeds_sync_collection, serialize_doc, prepare_for_mongo
)
from ipeds import IPEDSIntegration


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="Student Signal API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== Authentication Routes ====================

@api_router.post("/auth/register", response_model=dict)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = user_data.model_dump()
    user_dict['password_hash'] = get_password_hash(user_dict.pop('password'))
    user_dict['role'] = 'user'
    user_dict['saved_colleges'] = []
    user_dict['saved_scholarships'] = []
    user_dict['created_at'] = datetime.utcnow().isoformat()
    user_dict['updated_at'] = datetime.utcnow().isoformat()
    
    # Generate unique ID
    import uuid
    user_dict['id'] = str(uuid.uuid4())
    
    await users_collection.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Remove password hash before returning
    user_dict.pop('password_hash')
    user_dict.pop('_id', None)
    
    return {
        "user": user_dict,
        "token": access_token,
        "token_type": "bearer"
    }


@api_router.post("/auth/login", response_model=dict)
async def login(user_data: UserLogin):
    """Login user"""
    user = await users_collection.find_one({"email": user_data.email})
    
    if not user or not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Remove sensitive data
    user.pop('password_hash')
    user = serialize_doc(user)
    
    return {
        "user": user,
        "token": access_token,
        "token_type": "bearer"
    }


@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user(email: str = Depends(get_current_user_email)):
    """Get current user profile"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = serialize_doc(user)
    user.pop('password_hash', None)
    return user


# ==================== College Routes ====================

@api_router.get("/colleges", response_model=dict)
async def get_colleges(
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    min_tuition: Optional[int] = Query(None),
    max_tuition: Optional[int] = Query(None),
    direct_admission: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get list of colleges with filters"""
    query = {}
    
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'short_name': {'$regex': search, '$options': 'i'}},
            {'location': {'$regex': search, '$options': 'i'}}
        ]
    
    if state:
        query['state'] = state
    
    if type:
        query['type'] = type
    
    if min_tuition is not None or max_tuition is not None:
        query['tuition_in_state'] = {}
        if min_tuition is not None:
            query['tuition_in_state']['$gte'] = min_tuition
        if max_tuition is not None:
            query['tuition_in_state']['$lte'] = max_tuition
    
    if direct_admission is not None:
        query['direct_admission'] = direct_admission
    
    # Get total count
    total = await colleges_collection.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * limit
    colleges = await colleges_collection.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    return {
        "colleges": colleges,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@api_router.get("/colleges/{college_id}", response_model=College)
async def get_college(college_id: str):
    """Get single college by ID"""
    college = await colleges_collection.find_one({"id": college_id}, {"_id": 0})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    return college


# ==================== Scholarship Routes ====================

@api_router.get("/scholarships", response_model=dict)
async def get_scholarships(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    renewable: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get list of scholarships with filters"""
    query = {}
    
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    
    if category:
        query['category'] = category
    
    if type:
        query['type'] = type
    
    if renewable is not None:
        query['renewable'] = renewable
    
    # Get total count
    total = await scholarships_collection.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * limit
    scholarships = await scholarships_collection.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    return {
        "scholarships": scholarships,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@api_router.get("/scholarships/{scholarship_id}", response_model=Scholarship)
async def get_scholarship(scholarship_id: str):
    """Get single scholarship by ID"""
    scholarship = await scholarships_collection.find_one({"id": scholarship_id}, {"_id": 0})
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scholarship


# ==================== User Saved Items Routes ====================

@api_router.post("/users/saved-colleges")
async def save_college(
    item: SavedItem,
    email: str = Depends(get_current_user_email)
):
    """Save a college to user's list"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if college exists
    college = await colleges_collection.find_one({"id": item.item_id})
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Add to saved list if not already saved
    if item.item_id not in user.get('saved_colleges', []):
        await users_collection.update_one(
            {"email": email},
            {"$push": {"saved_colleges": item.item_id}, "$set": {"updated_at": datetime.utcnow().isoformat()}}
        )
    
    return {"message": "College saved successfully"}


@api_router.delete("/users/saved-colleges/{college_id}")
async def unsave_college(
    college_id: str,
    email: str = Depends(get_current_user_email)
):
    """Remove a college from user's saved list"""
    await users_collection.update_one(
        {"email": email},
        {"$pull": {"saved_colleges": college_id}, "$set": {"updated_at": datetime.utcnow().isoformat()}}
    )
    return {"message": "College removed from saved list"}


@api_router.get("/users/saved-colleges", response_model=List[College])
async def get_saved_colleges(email: str = Depends(get_current_user_email)):
    """Get user's saved colleges"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    saved_ids = user.get('saved_colleges', [])
    colleges = await colleges_collection.find({"id": {"$in": saved_ids}}, {"_id": 0}).to_list(100)
    return colleges


@api_router.post("/users/saved-scholarships")
async def save_scholarship(
    item: SavedItem,
    email: str = Depends(get_current_user_email)
):
    """Save a scholarship to user's list"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if scholarship exists
    scholarship = await scholarships_collection.find_one({"id": item.item_id})
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    # Add to saved list if not already saved
    if item.item_id not in user.get('saved_scholarships', []):
        await users_collection.update_one(
            {"email": email},
            {"$push": {"saved_scholarships": item.item_id}, "$set": {"updated_at": datetime.utcnow().isoformat()}}
        )
    
    return {"message": "Scholarship saved successfully"}


@api_router.delete("/users/saved-scholarships/{scholarship_id}")
async def unsave_scholarship(
    scholarship_id: str,
    email: str = Depends(get_current_user_email)
):
    """Remove a scholarship from user's saved list"""
    await users_collection.update_one(
        {"email": email},
        {"$pull": {"saved_scholarships": scholarship_id}, "$set": {"updated_at": datetime.utcnow().isoformat()}}
    )
    return {"message": "Scholarship removed from saved list"}


@api_router.get("/users/saved-scholarships", response_model=List[Scholarship])
async def get_saved_scholarships(email: str = Depends(get_current_user_email)):
    """Get user's saved scholarships"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    saved_ids = user.get('saved_scholarships', [])
    scholarships = await scholarships_collection.find({"id": {"$in": saved_ids}}, {"_id": 0}).to_list(100)
    return scholarships


# ==================== IPEDS Routes ====================

@api_router.post("/ipeds/sync")
async def sync_ipeds_data(csv_file: UploadFile = File(...)):
    """Sync IPEDS data from uploaded CSV file"""
    # Save uploaded file temporarily
    temp_path = f"/tmp/{csv_file.filename}"
    with open(temp_path, "wb") as f:
        content = await csv_file.read()
        f.write(content)
    
    # Process IPEDS data
    ipeds = IPEDSIntegration()
    result = await ipeds.sync_ipeds_data(temp_path, db)
    
    # Clean up temp file
    import os
    os.remove(temp_path)
    
    return result


@api_router.get("/ipeds/status", response_model=IPEDSStatus)
async def get_ipeds_status():
    """Get IPEDS sync status"""
    last_sync = await ipeds_sync_collection.find_one(
        {},
        sort=[('last_sync', -1)]
    )
    
    total_colleges = await colleges_collection.count_documents({})
    
    if last_sync:
        return {
            "last_sync": last_sync.get('last_sync'),
            "total_records": total_colleges,
            "status": last_sync.get('status', 'unknown')
        }
    
    return {
        "last_sync": None,
        "total_records": total_colleges,
        "status": "never_synced"
    }


# ==================== Test Route ====================

@api_router.get("/")
async def root():
    return {
        "message": "Student Signal API",
        "version": "1.0.0",
        "endpoints": {
            "auth": "/api/auth/*",
            "colleges": "/api/colleges",
            "scholarships": "/api/scholarships",
            "ipeds": "/api/ipeds/*"
        }
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()