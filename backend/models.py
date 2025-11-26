from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid


# Base model configuration to ignore MongoDB's _id
class BaseDBModel(BaseModel):
    model_config = ConfigDict(extra="ignore")


# College Models
class College(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ipeds_id: Optional[str] = None
    name: str
    short_name: str
    location: str
    state: str
    type: str  # Public/Private
    enrollment: int
    acceptance_rate: float
    tuition_in_state: int
    tuition_out_state: int
    sat_range: str
    act_range: str
    graduation_rate: float
    ranking: Optional[int] = None
    rating: Optional[str] = None
    image: str
    description: str
    direct_admission: bool = False
    majors: List[str] = []
    features: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class CollegeCreate(BaseModel):
    name: str
    short_name: str
    location: str
    state: str
    type: str
    enrollment: int
    acceptance_rate: float
    tuition_in_state: int
    tuition_out_state: int
    sat_range: str
    act_range: str
    graduation_rate: float
    ranking: Optional[int] = None
    rating: Optional[str] = None
    image: str
    description: str
    direct_admission: bool = False
    majors: List[str] = []
    features: List[str] = []


class CollegeUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    location: Optional[str] = None
    state: Optional[str] = None
    type: Optional[str] = None
    enrollment: Optional[int] = None
    acceptance_rate: Optional[float] = None
    tuition_in_state: Optional[int] = None
    tuition_out_state: Optional[int] = None
    sat_range: Optional[str] = None
    act_range: Optional[str] = None
    graduation_rate: Optional[float] = None
    ranking: Optional[int] = None
    rating: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    direct_admission: Optional[bool] = None
    majors: Optional[List[str]] = None
    features: Optional[List[str]] = None


# Scholarship Models
class Scholarship(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    amount: str
    deadline: str
    type: str  # Merit-Based, Need-Based, Athletic
    category: str
    description: str
    eligibility: List[str]
    renewable: bool
    application_required: bool
    image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class ScholarshipCreate(BaseModel):
    name: str
    amount: str
    deadline: str
    type: str
    category: str
    description: str
    eligibility: List[str]
    renewable: bool
    application_required: bool
    image: Optional[str] = None


# User Models
class User(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    first_name: str
    last_name: str
    role: str = "user"  # user/admin
    saved_colleges: List[str] = []
    saved_scholarships: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseDBModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    role: str
    saved_colleges: List[str]
    saved_scholarships: List[str]
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Saved Items
class SavedItem(BaseModel):
    item_id: str
    item_type: str  # college or scholarship


# IPEDS Models
class IPEDSSync(BaseModel):
    status: str
    total_records: int
    updated: int
    failed: int
    last_sync: datetime


class IPEDSStatus(BaseModel):
    last_sync: Optional[datetime] = None
    total_records: int
    status: str
