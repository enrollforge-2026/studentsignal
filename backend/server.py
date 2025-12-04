from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
from uuid import uuid4

# Load environment variables BEFORE importing local modules
load_dotenv()

# Import local modules
from models import (
    College, CollegeUI, CollegeCreate, CollegeUpdate,
    Scholarship, ScholarshipCreate,
    User, UserCreate, UserLogin, UserResponse, Token, SavedItem,
    OnboardingData,
    Lead, LeadCreate,
    ChatMessage, ChatResponse,
    IPEDSSync, IPEDSStatus,
    Article, ArticleCreate, ArticleUpdate,
    SavedCollegeItem, SavedCollegeUpdate,
    ToDo, ToDoCreate, ToDoUpdate,
    ProfileUpdate,
    Institution, InstitutionCreate,
    HighSchool, HighSchoolCreate,
    US_STATES, GPA_OPTIONS,
    validate_state, validate_gpa, validate_date_string, validate_zip_code, validate_address,
    MegaMenuFeature, MegaMenuFeatureCreate, MegaMenuFeatureUpdate,
    AnnouncementBar, AnnouncementBarCreate, AnnouncementBarUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_email, get_current_admin_email, ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import (
    db, colleges_collection, colleges_ui_collection, scholarships_collection,
    users_collection, ipeds_sync_collection, leads_collection, articles_collection, todos_collection,
    institutions_collection, high_schools_collection, mega_menu_features_collection,
    announcement_bars_collection,
    serialize_doc, prepare_for_mongo
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
    user_dict['onboarding_completed'] = False
    user_dict['badges'] = []
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



@api_router.post("/auth/staff-login", response_model=dict)
async def staff_login(user_data: UserLogin):
    """Login endpoint specifically for staff/admin users"""
    user = await users_collection.find_one({"email": user_data.email})
    
    if not user or not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user has admin role
    if user.get('role') != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required.",
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
    user = await users_collection.find_one({"email": email}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user


@api_router.put("/users/onboarding")
async def complete_onboarding(
    onboarding_data: OnboardingData,
    email: str = Depends(get_current_user_email)
):
    """Complete user onboarding and save profile data"""
    # Update user with onboarding data
    update_data = onboarding_data.dict(exclude_unset=True)
    update_data['onboarding_completed'] = True
    update_data['updated_at'] = datetime.utcnow()
    
    result = await users_collection.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no changes made")
    
    return {"message": "Onboarding completed successfully"}


# ==================== College Routes ====================

@api_router.get("/colleges", response_model=dict)
async def get_colleges(
    search: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    publicPrivate: Optional[str] = Query(None),
    degreeLevel: Optional[str] = Query(None),
    min_tuition: Optional[int] = Query(None),
    max_tuition: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Get list of colleges with filters - UI-optimized flat schema"""
    query = {'isActive': True}  # Only return active colleges
    
    if search:
        query['$or'] = [
            {'name': {'$regex': search, '$options': 'i'}},
            {'city': {'$regex': search, '$options': 'i'}},
            {'slug': {'$regex': search, '$options': 'i'}}
        ]
    
    if state:
        query['state'] = state
    
    if publicPrivate:
        query['publicPrivate'] = publicPrivate
    
    if degreeLevel:
        query['degreeLevel'] = degreeLevel
    
    if min_tuition is not None or max_tuition is not None:
        query['inStateTuition'] = {}
        if min_tuition is not None:
            query['inStateTuition']['$gte'] = min_tuition
        if max_tuition is not None:
            query['inStateTuition']['$lte'] = max_tuition
    
    # Get total count
    total = await colleges_ui_collection.count_documents(query)
    
    # Get paginated results
    skip = (page - 1) * limit
    colleges = await colleges_ui_collection.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    return {
        "colleges": colleges,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }


@api_router.get("/colleges/{college_id}", response_model=CollegeUI)
async def get_college(college_id: str):
    """Get single college by IPEDS ID or slug"""
    # Try to find by ipedsId first, then by slug
    college = await colleges_ui_collection.find_one(
        {"$or": [{"ipedsId": college_id}, {"slug": college_id}]}, 
        {"_id": 0}
    )
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    return college


# ==================== Admin College Routes ====================

@api_router.post("/admin/colleges", response_model=College)
async def create_college(
    college_data: CollegeCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new college (admin only)"""
    college_dict = college_data.model_dump()
    college_dict['id'] = str(uuid4())
    college_dict['created_at'] = datetime.utcnow()
    college_dict['updated_at'] = datetime.utcnow()
    
    await colleges_collection.insert_one(college_dict)
    
    return college_dict


@api_router.put("/admin/colleges/{college_id}", response_model=College)
async def update_college(
    college_id: str,
    college_data: CollegeUpdate,
    email: str = Depends(get_current_admin_email)
):
    """Update a college (admin only)"""
    
    # Check if college exists
    existing_college = await colleges_collection.find_one({"id": college_id}, {"_id": 0})
    if not existing_college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in college_data.model_dump().items() if v is not None}
    if update_data:
        update_data['updated_at'] = datetime.utcnow()
        await colleges_collection.update_one(
            {"id": college_id},
            {"$set": update_data}
        )
    
    # Return updated college
    updated_college = await colleges_collection.find_one({"id": college_id}, {"_id": 0})
    return updated_college


@api_router.delete("/admin/colleges/{college_id}")
async def delete_college(
    college_id: str,
    email: str = Depends(get_current_admin_email)
):
    """Delete a college (admin only)"""
    
    result = await colleges_collection.delete_one({"id": college_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="College not found")
    
    return {"message": "College deleted successfully", "id": college_id}


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


# ==================== Admin Scholarship Routes ====================

@api_router.post("/admin/scholarships", response_model=Scholarship)
async def create_scholarship(
    scholarship_data: ScholarshipCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new scholarship (admin only)"""
    scholarship_dict = scholarship_data.model_dump()
    scholarship_dict['id'] = str(uuid4())
    scholarship_dict['created_at'] = datetime.utcnow()
    scholarship_dict['updated_at'] = datetime.utcnow()
    
    await scholarships_collection.insert_one(scholarship_dict)
    
    return scholarship_dict


@api_router.put("/admin/scholarships/{scholarship_id}", response_model=Scholarship)
async def update_scholarship(
    scholarship_id: str,
    scholarship_data: dict,
    email: str = Depends(get_current_admin_email)
):
    """Update a scholarship (admin only)"""
    
    # Check if scholarship exists
    existing_scholarship = await scholarships_collection.find_one({"id": scholarship_id}, {"_id": 0})
    if not existing_scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in scholarship_data.items() if v is not None}
    if update_data:
        update_data['updated_at'] = datetime.utcnow()
        await scholarships_collection.update_one(
            {"id": scholarship_id},
            {"$set": update_data}
        )
    
    # Return updated scholarship
    updated_scholarship = await scholarships_collection.find_one({"id": scholarship_id}, {"_id": 0})
    return updated_scholarship


@api_router.delete("/admin/scholarships/{scholarship_id}")
async def delete_scholarship(
    scholarship_id: str,
    email: str = Depends(get_current_admin_email)
):
    """Delete a scholarship (admin only)"""
    
    result = await scholarships_collection.delete_one({"id": scholarship_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    
    return {"message": "Scholarship deleted successfully", "id": scholarship_id}


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
    
    # Check if college exists (check by ipedsId or slug)
    college = await colleges_ui_collection.find_one({
        "$or": [{"ipedsId": item.item_id}, {"slug": item.item_id}]
    })
    if not college:
        raise HTTPException(status_code=404, detail="College not found")
    
    # Store ipedsId for consistency
    college_id = college.get('ipedsId', item.item_id)
    
    # Add to saved list if not already saved
    if college_id not in user.get('saved_colleges', []):
        await users_collection.update_one(
            {"email": email},
            {"$push": {"saved_colleges": college_id}, "$set": {"updated_at": datetime.utcnow().isoformat()}}
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
    colleges = await colleges_collection.find({"ipedsId": {"$in": saved_ids}}, {"_id": 0}).to_list(100)
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



# ==================== Profile & Badge Routes ====================

@api_router.put("/user/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    email: str = Depends(get_current_user_email)
):
    """Update user profile"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {k: v for k, v in profile_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await users_collection.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    return {"message": "Profile updated successfully"}


@api_router.get("/user/badges")
async def get_user_badges(email: str = Depends(get_current_user_email)):
    """Get user's earned badges"""
    user = await users_collection.find_one({"email": email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    badges = []
    
    # Check "Profile Complete" badge
    required_fields = ["first_name", "last_name", "email", "high_school_grad_year", "intended_major", "gpa"]
    if all(user.get(field) for field in required_fields):
        badges.append("Profile Complete")
    
    # Check "Photo Uploaded" badge
    if user.get("profile_picture_url"):
        badges.append("Photo Uploaded")
    
    # Check "First Application" badge
    saved_colleges = user.get("saved_colleges", [])
    if saved_colleges:
        # Check if any college has status "Applied" or "Accepted"
        colleges_with_status = await colleges_collection.find(
            {"id": {"$in": saved_colleges}}, 
            {"_id": 0}
        ).to_list(100)
        # For now, we'll award badge if user has saved any colleges
        # TODO: Check actual status when we implement SavedCollegeItem structure
        if len(saved_colleges) > 0:
            badges.append("First Application")
    
    # Update user's badges in database
    await users_collection.update_one(
        {"email": email},
        {"$set": {"badges": badges}}
    )
    
    return {"badges": badges}


# ==================== College Status Routes ====================

@api_router.put("/saved-colleges/{college_id}/status")
async def update_college_status(
    college_id: str,
    status_update: SavedCollegeUpdate,
    email: str = Depends(get_current_user_email)
):
    """Update status for a saved college"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # For now, just store status separately
    # TODO: Migrate saved_colleges to SavedCollegeItem structure
    saved_colleges = user.get("saved_colleges", [])
    if college_id not in saved_colleges:
        raise HTTPException(status_code=404, detail="College not in saved list")
    
    # Store status in a separate field for now
    college_statuses = user.get("college_statuses", {})
    college_statuses[college_id] = status_update.status
    
    await users_collection.update_one(
        {"email": email},
        {"$set": {"college_statuses": college_statuses, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "College status updated", "status": status_update.status}


@api_router.get("/saved-colleges/{college_id}/status")
async def get_college_status(
    college_id: str,
    email: str = Depends(get_current_user_email)
):
    """Get status for a saved college"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    college_statuses = user.get("college_statuses", {})
    status = college_statuses.get(college_id, "Considering")
    
    return {"college_id": college_id, "status": status}


# ==================== ToDo Routes ====================

@api_router.get("/todos")
async def get_todos(email: str = Depends(get_current_user_email)):
    """Get all todos for current user"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    todos = await todos_collection.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    return {"todos": todos}


@api_router.post("/todos", response_model=ToDo)
async def create_todo(
    todo_data: ToDoCreate,
    email: str = Depends(get_current_user_email)
):
    """Create a new todo"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    todo_dict = todo_data.model_dump()
    todo_dict["id"] = str(uuid4())
    todo_dict["user_id"] = user["id"]
    todo_dict["created_at"] = datetime.utcnow()
    todo_dict["updated_at"] = datetime.utcnow()
    
    await todos_collection.insert_one(todo_dict)
    
    return todo_dict


@api_router.put("/todos/{todo_id}", response_model=ToDo)
async def update_todo(
    todo_id: str,
    todo_data: ToDoUpdate,
    email: str = Depends(get_current_user_email)
):
    """Update a todo"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    todo = await todos_collection.find_one({"id": todo_id, "user_id": user["id"]}, {"_id": 0})
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    update_data = {k: v for k, v in todo_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await todos_collection.update_one(
        {"id": todo_id, "user_id": user["id"]},
        {"$set": update_data}
    )
    
    updated_todo = await todos_collection.find_one({"id": todo_id}, {"_id": 0})
    return updated_todo


@api_router.delete("/todos/{todo_id}")
async def delete_todo(
    todo_id: str,
    email: str = Depends(get_current_user_email)
):
    """Delete a todo"""
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await todos_collection.delete_one({"id": todo_id, "user_id": user["id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return {"message": "Todo deleted successfully"}





# ==================== Reference Data Routes ====================

@api_router.get("/reference/states")
async def get_states():
    """Get list of U.S. states"""
    return {
        "states": [{"code": code, "name": name} for code, name in US_STATES.items()]
    }


@api_router.get("/reference/gpa-options")
async def get_gpa_options():
    """Get list of valid GPA values"""
    return {
        "gpa_options": [str(gpa) for gpa in GPA_OPTIONS]
    }


@api_router.get("/reference/institutions")
async def search_institutions(
    q: str = Query("", description="Search query"),
    state: Optional[str] = Query(None, description="Filter by state"),
    limit: int = Query(20, le=100)
):
    """Search institutions (colleges/universities)"""
    query = {}
    
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if state:
        query["state"] = state.upper()
    
    institutions = await institutions_collection.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return {"institutions": institutions}


@api_router.post("/reference/institutions", response_model=Institution)
async def create_institution(
    institution_data: InstitutionCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new institution (admin only)"""
    # Validate state
    if not validate_state(institution_data.state):
        raise HTTPException(status_code=400, detail="Invalid state code")
    
    institution_dict = institution_data.model_dump()
    institution_dict["id"] = str(uuid4())
    institution_dict["state"] = institution_data.state.upper()
    institution_dict["created_at"] = datetime.utcnow()
    institution_dict["updated_at"] = datetime.utcnow()
    
    await institutions_collection.insert_one(institution_dict)
    return institution_dict


@api_router.get("/reference/high-schools")
async def search_high_schools(
    q: str = Query("", description="Search query"),
    state: Optional[str] = Query(None, description="Filter by state"),
    limit: int = Query(20, le=100)
):
    """Search high schools"""
    query = {}
    
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    if state:
        query["state"] = state.upper()
    
    high_schools = await high_schools_collection.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return {"high_schools": high_schools}


@api_router.post("/reference/high-schools", response_model=HighSchool)
async def create_high_school(
    high_school_data: HighSchoolCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new high school (admin only)"""
    # Validate state
    if not validate_state(high_school_data.state):
        raise HTTPException(status_code=400, detail="Invalid state code")
    
    high_school_dict = high_school_data.model_dump()
    high_school_dict["id"] = str(uuid4())
    high_school_dict["state"] = high_school_data.state.upper()
    high_school_dict["created_at"] = datetime.utcnow()
    high_school_dict["updated_at"] = datetime.utcnow()
    
    await high_schools_collection.insert_one(high_school_dict)
    return high_school_dict


# ==================== Smart Search / Autocomplete Routes ====================

@api_router.get("/search/autocomplete")
async def search_autocomplete(q: str = Query("", min_length=1)):
    """Smart autocomplete search across colleges, scholarships, and majors"""
    if len(q) < 2:
        return {"colleges": [], "scholarships": [], "majors": []}
    
    # Search colleges
    colleges = await colleges_collection.find(
        {"name": {"$regex": q, "$options": "i"}},
        {"_id": 0, "name": 1, "location": 1, "acceptance_rate": 1, "image": 1, "id": 1}
    ).limit(5).to_list(5)
    
    # Search scholarships
    scholarships = await scholarships_collection.find(
        {"name": {"$regex": q, "$options": "i"}},
        {"_id": 0, "name": 1, "amount": 1, "deadline": 1, "id": 1}
    ).limit(5).to_list(5)
    
    # Generate major suggestions (hardcoded for now, can be database later)
    major_keywords = [
        "Psychology Programs", "Computer Science Degrees", "Pre-Nursing",
        "Business Administration", "Engineering Programs", "Biology Degrees",
        "English Literature", "Political Science", "Economics Programs",
        "Pre-Med Track", "Education Degrees", "Communications Programs"
    ]
    majors = [m for m in major_keywords if q.lower() in m.lower()][:5]
    
    return {
        "colleges": colleges,
        "scholarships": scholarships,
        "majors": majors
    }


# ==================== Lead Routes ====================

@api_router.post("/leads", response_model=dict)
async def create_lead(lead_data: LeadCreate):
    """Create a new lead (request info from college)"""
    try:
        # Create lead document
        lead_dict = lead_data.dict()
        lead = Lead(**lead_dict)
        
        # Insert into database
        await leads_collection.insert_one(prepare_for_mongo(lead.dict()))
        
        return {
            "message": "Lead submitted successfully",
            "lead_id": lead.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/admin/leads", response_model=List[Lead])
async def get_all_leads(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    email: str = Depends(get_current_user_email)
):
    """Get all leads (admin only)"""
    # Check if user is admin
    user = await users_collection.find_one({"email": email})
    if not user or user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    leads = await leads_collection.find({}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    return leads


@api_router.get("/admin/leads/export")
async def export_leads_csv(email: str = Depends(get_current_user_email)):
    """Export all leads as CSV (admin only)"""
    from fastapi.responses import StreamingResponse
    import io
    import csv
    
    # Check if user is admin
    user = await users_collection.find_one({"email": email})
    if not user or user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Fetch all leads
    leads = await leads_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    # Create CSV in memory
    output = io.StringIO()
    if leads:
        fieldnames = list(leads[0].keys())
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(leads)
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads_export.csv"}
    )


@api_router.get("/admin/leads/json")
async def export_leads_json(email: str = Depends(get_current_user_email)):
    """Export all leads as JSON for CRM integration (admin only)"""
    # Check if user is admin
    user = await users_collection.find_one({"email": email})
    if not user or user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Fetch all leads
    leads = await leads_collection.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    return {
        "total": len(leads),
        "leads": leads,
        "exported_at": datetime.utcnow().isoformat()
    }


# ==================== Chat Routes (Elon AI) ====================

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_elon(
    chat_message: ChatMessage,
    email: str = Depends(get_current_user_email)
):
    """Chat with Elon AI assistant (authenticated users)"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    from uuid import uuid4
    
    try:
        # Get user info for personalization
        user = await users_collection.find_one({"email": email}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        first_name = user.get('first_name', 'there')
        
        # Generate session ID if not provided
        session_id = chat_message.session_id or str(uuid4())
        
        # Create system message with Student Signal context
        system_message = f"""You are Elon, a friendly AI assistant for Student Signal, a college search and scholarship platform.

User Context:
- Name: {first_name}
- Role: Helping students find colleges and scholarships
- Platform: Student Signal (https://studentsignal.com)

Your Responsibilities:
1. Greet users warmly using their first name
2. Help with navigation: colleges page, scholarships page, Signal Hub (dashboard)
3. Answer questions about the platform features
4. Provide guidance on college search and scholarship applications
5. Keep responses brief, friendly, and helpful
6. Stay focused on Student Signal features and college/scholarship topics

Key Platform Features:
- Colleges: Browse 8,000+ colleges with filters for location, major, test scores
- Scholarships: Find scholarships by category (Merit, Need-Based, STEM, Athletic)
- Signal Hub: Personal dashboard to track saved colleges, scholarships, and applications
- Lead Capture: Request information directly from colleges

Be conversational, supportive, and encouraging. Keep responses under 3-4 sentences unless more detail is specifically requested."""

        # Initialize chat
        chat = LlmChat(
            api_key="sk-emergent-032766e07518853893",
            session_id=session_id,
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        # Send message
        user_message = UserMessage(text=chat_message.message)
        response_text = await chat.send_message(user_message)
        
        return ChatResponse(response=response_text, session_id=session_id)
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Chat service temporarily unavailable")


@api_router.post("/chat/guest", response_model=ChatResponse)
async def chat_with_elon_guest(chat_message: ChatMessage):
    """Limited chat for guest users (FAQ mode)"""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    from uuid import uuid4
    
    try:
        session_id = chat_message.session_id or str(uuid4())
        
        # Limited system message for guests
        system_message = """You are Elon, a helpful assistant for Student Signal.

You're talking to a guest user (not logged in). Your role:
1. Answer basic questions about Student Signal platform
2. Encourage them to sign up for full access
3. Explain key features: college search, scholarship search, personalized recommendations
4. Keep responses brief and friendly

Platform Overview:
- Student Signal helps students find colleges and scholarships
- Free to sign up and explore 8,000+ colleges
- Personalized dashboard to track favorites and applications
- Direct connection to colleges via request info feature

For detailed help, suggest they create a free account. Keep responses under 3 sentences."""

        chat = LlmChat(
            api_key="sk-emergent-032766e07518853893",
            session_id=session_id,
            system_message=system_message
        ).with_model("gemini", "gemini-2.0-flash")
        
        user_message = UserMessage(text=chat_message.message)
        response_text = await chat.send_message(user_message)
        
        return ChatResponse(response=response_text, session_id=session_id)
        
    except Exception as e:
        print(f"Guest chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Chat service temporarily unavailable")




# ==================== Mega Menu Feature Tiles Routes ====================

@api_router.get("/mega-menu/features/{menu_key}")
async def get_mega_menu_feature(menu_key: str):
    """Get active feature tile for a specific menu"""
    feature = await mega_menu_features_collection.find_one(
        {"menu_key": menu_key, "is_active": True},
        {"_id": 0}
    )
    return {"feature": feature}


@api_router.get("/admin/mega-menu/features")
async def get_all_mega_menu_features(email: str = Depends(get_current_admin_email)):
    """Get all mega menu features (admin only)"""
    features = await mega_menu_features_collection.find({}, {"_id": 0}).to_list(100)
    return {"features": features}


@api_router.post("/admin/mega-menu/features", response_model=MegaMenuFeature)
async def create_mega_menu_feature(
    feature_data: MegaMenuFeatureCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new mega menu feature tile (admin only)"""
    # Deactivate any existing active features for this menu_key
    await mega_menu_features_collection.update_many(
        {"menu_key": feature_data.menu_key},
        {"$set": {"is_active": False}}
    )
    
    feature_dict = feature_data.model_dump()
    feature_dict["id"] = str(uuid4())
    feature_dict["created_at"] = datetime.utcnow()
    feature_dict["updated_at"] = datetime.utcnow()
    
    await mega_menu_features_collection.insert_one(feature_dict)
    return feature_dict


@api_router.put("/admin/mega-menu/features/{feature_id}", response_model=MegaMenuFeature)
async def update_mega_menu_feature(
    feature_id: str,
    feature_data: MegaMenuFeatureUpdate,
    email: str = Depends(get_current_admin_email)
):
    """Update a mega menu feature tile (admin only)"""
    feature = await mega_menu_features_collection.find_one({"id": feature_id}, {"_id": 0})
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    update_data = {k: v for k, v in feature_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    # If activating this feature, deactivate others for same menu_key
    if update_data.get("is_active"):
        await mega_menu_features_collection.update_many(
            {"menu_key": feature["menu_key"], "id": {"$ne": feature_id}},
            {"$set": {"is_active": False}}
        )
    
    await mega_menu_features_collection.update_one(
        {"id": feature_id},
        {"$set": update_data}
    )
    
    updated_feature = await mega_menu_features_collection.find_one({"id": feature_id}, {"_id": 0})
    return updated_feature


@api_router.delete("/admin/mega-menu/features/{feature_id}")
async def delete_mega_menu_feature(
    feature_id: str,
    email: str = Depends(get_current_admin_email)
):
    """Delete a mega menu feature tile (admin only)"""
    result = await mega_menu_features_collection.delete_one({"id": feature_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Feature not found")
    return {"message": "Feature deleted successfully"}


# ==================== Admin Analytics Routes ====================

@api_router.get("/admin/analytics")
async def get_analytics(email: str = Depends(get_current_admin_email)):
    """Get admin analytics data"""
    try:
        # Get total counts
        total_users = await users_collection.count_documents({})
        total_colleges = await colleges_collection.count_documents({})
        total_scholarships = await scholarships_collection.count_documents({})
        total_leads = await leads_collection.count_documents({})
        
        # Get leads over time (last 7 days)
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        # Aggregate leads by date
        leads_pipeline = [
            {
                "$match": {
                    "created_at": {"$gte": seven_days_ago.isoformat()}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": {
                                "$dateFromString": {
                                    "dateString": "$created_at"
                                }
                            }
                        }
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": 1}
            }
        ]
        
        leads_by_date = await leads_collection.aggregate(leads_pipeline).to_list(None)
        
        # Fill in missing days with zero counts
        leads_over_time = []
        for i in range(7):
            date = (datetime.utcnow() - timedelta(days=6-i)).strftime("%Y-%m-%d")
            count = 0
            for item in leads_by_date:
                if item["_id"] == date:
                    count = item["count"]
                    break
            leads_over_time.append({"date": date, "count": count})
        
        return {
            "stats": {
                "total_users": total_users,
                "total_colleges": total_colleges,
                "total_scholarships": total_scholarships,
                "total_leads": total_leads
            },
            "leads_over_time": leads_over_time
        }
        
    except Exception as e:
        print(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load analytics data")


# ==================== Public Articles Routes ====================

def calculate_reading_time(text: str) -> int:
    """Calculate estimated reading time in minutes (based on ~200 words per minute)"""
    if not text:
        return 1
    word_count = len(text.split())
    minutes = max(1, round(word_count / 200))
    return minutes


def enrich_article_with_reading_time(article: dict) -> dict:
    """Add reading time to article if not already present"""
    if article and "read_time_minutes" not in article:
        article["read_time_minutes"] = calculate_reading_time(article.get("body", ""))
    return article


@api_router.get("/articles", response_model=dict)
async def get_articles(
    featured: bool = Query(False),
    is_video: bool = Query(False),
    category: Optional[str] = Query(None),
    limit: int = Query(20)
):
    """Get published articles with optional filtering"""
    query = {"is_published": True}
    
    if featured:
        query["is_featured"] = True
    if is_video:
        query["is_video"] = True
    if category:
        query["category"] = category
    
    articles = await articles_collection.find(query, {"_id": 0}).sort("published_at", -1).limit(limit).to_list(limit)
    total = await articles_collection.count_documents(query)
    
    # Add reading time to each article
    for article in articles:
        enrich_article_with_reading_time(article)
    
    return {
        "articles": articles,
        "total": total
    }


@api_router.get("/articles/{slug}", response_model=Article)
async def get_article_by_slug(slug: str):
    """Get single published article by slug"""
    article = await articles_collection.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Add reading time calculation
    enrich_article_with_reading_time(article)
    
    return article


# ==================== Admin Articles Routes ====================

@api_router.get("/admin/articles", response_model=dict)
async def get_all_articles_admin(
    email: str = Depends(get_current_admin_email),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    """Get all articles (admin only)"""
    query = {}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"summary": {"$regex": search, "$options": "i"}}
        ]
    if category:
        query["category"] = category
    
    articles = await articles_collection.find(query, {"_id": 0}).sort("created_at", -1).to_list(None)
    
    # Add reading time to each article
    for article in articles:
        enrich_article_with_reading_time(article)
    
    return {
        "articles": articles,
        "total": len(articles)
    }


@api_router.post("/admin/articles", response_model=Article)
async def create_article(
    article_data: ArticleCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new article (admin only)"""
    # Check if slug already exists
    existing = await articles_collection.find_one({"slug": article_data.slug}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    article_dict = article_data.model_dump()
    article_dict['id'] = str(uuid4())
    article_dict['created_at'] = datetime.utcnow()
    article_dict['updated_at'] = datetime.utcnow()
    
    # Set published_at if not provided
    if article_dict.get('is_published') and not article_dict.get('published_at'):
        article_dict['published_at'] = datetime.utcnow()
    
    await articles_collection.insert_one(article_dict)
    
    return article_dict


@api_router.get("/admin/articles/{article_id}", response_model=Article)
async def get_article_admin(
    article_id: str,
    email: str = Depends(get_current_admin_email)
):
    """Get single article by ID (admin only)"""
    article = await articles_collection.find_one({"id": article_id}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Add reading time
    enrich_article_with_reading_time(article)
    
    return article


@api_router.put("/admin/articles/{article_id}", response_model=Article)
async def update_article(
    article_id: str,
    article_data: ArticleUpdate,
    email: str = Depends(get_current_admin_email)
):
    """Update an article (admin only)"""
    existing_article = await articles_collection.find_one({"id": article_id}, {"_id": 0})
    if not existing_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Check slug uniqueness if changed
    if article_data.slug and article_data.slug != existing_article.get('slug'):
        slug_exists = await articles_collection.find_one({"slug": article_data.slug, "id": {"$ne": article_id}}, {"_id": 0})
        if slug_exists:
            raise HTTPException(status_code=400, detail="Slug already exists")
    
    update_data = {k: v for k, v in article_data.model_dump().items() if v is not None}
    if update_data:
        update_data['updated_at'] = datetime.utcnow()
        
        # Set published_at when publishing
        if update_data.get('is_published') and not existing_article.get('published_at'):
            update_data['published_at'] = datetime.utcnow()
        
        await articles_collection.update_one(
            {"id": article_id},
            {"$set": update_data}
        )
    
    updated_article = await articles_collection.find_one({"id": article_id}, {"_id": 0})
    return updated_article


@api_router.delete("/admin/articles/{article_id}")
async def delete_article(
    article_id: str,
    email: str = Depends(get_current_admin_email)
):
    """Delete an article (admin only)"""
    result = await articles_collection.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return {"message": "Article deleted successfully", "id": article_id}


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



# ==================== Announcement Bar Routes ====================

@api_router.post("/announcement/create")
async def create_announcement(
    announcement_data: AnnouncementBarCreate,
    email: str = Depends(get_current_admin_email)
):
    """Create a new announcement bar (admin only)"""
    announcement_dict = announcement_data.model_dump()
    announcement_dict['id'] = str(uuid4())
    announcement_dict['created_at'] = datetime.utcnow()
    announcement_dict['updated_at'] = datetime.utcnow()
    
    await announcement_bars_collection.insert_one(announcement_dict)
    
    # Return without _id
    announcement_dict.pop('_id', None)
    announcement_dict = serialize_doc(announcement_dict)
    
    return announcement_dict


@api_router.get("/announcement/current")
async def get_current_announcement():
    """Get the currently active announcement (public endpoint)"""
    now = datetime.utcnow()
    
    announcement = await announcement_bars_collection.find_one(
        {
            "status": "active",
            "start_date": {"$lte": now},
            "end_date": {"$gte": now}
        },
        {"_id": 0},
        sort=[("created_at", -1)]
    )
    
    if not announcement:
        return None
    
    return serialize_doc(announcement)


@api_router.get("/admin/announcements")
async def get_all_announcements(
    email: str = Depends(get_current_admin_email)
):
    """Get all announcements (admin only)"""
    announcements = await announcement_bars_collection.find(
        {},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return [serialize_doc(a) for a in announcements]


@api_router.patch("/announcement/update/{announcement_id}")
async def update_announcement(
    announcement_id: str,
    announcement_data: AnnouncementBarUpdate,
    email: str = Depends(get_current_admin_email)
):
    """Update an announcement (admin only)"""
    update_data = announcement_data.model_dump(exclude_unset=True)
    
    if update_data:
        update_data['updated_at'] = datetime.utcnow()
        
        result = await announcement_bars_collection.update_one(
            {"id": announcement_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Announcement not found")
    
    updated_announcement = await announcement_bars_collection.find_one(
        {"id": announcement_id},
        {"_id": 0}
    )
    return serialize_doc(updated_announcement)


@api_router.delete("/announcement/archive/{announcement_id}")
async def archive_announcement(
    announcement_id: str,
    email: str = Depends(get_current_admin_email)
):
    """Archive an announcement (admin only)"""
    result = await announcement_bars_collection.update_one(
        {"id": announcement_id},
        {"$set": {"status": "archived", "updated_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    
    return {"message": "Announcement archived successfully", "id": announcement_id}


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