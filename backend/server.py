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

# Import local modules
from models import (
    College, CollegeCreate, CollegeUpdate,
    Scholarship, ScholarshipCreate,
    User, UserCreate, UserLogin, UserResponse, Token, SavedItem,
    OnboardingData,
    Lead, LeadCreate,
    ChatMessage, ChatResponse,
    IPEDSSync, IPEDSStatus
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_email, get_current_admin_email, ACCESS_TOKEN_EXPIRE_MINUTES
)
from database import (
    db, colleges_collection, scholarships_collection,
    users_collection, ipeds_sync_collection, leads_collection, serialize_doc, prepare_for_mongo
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