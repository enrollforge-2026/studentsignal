from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid


# Base model configuration to ignore MongoDB's _id
class BaseDBModel(BaseModel):
    model_config = ConfigDict(extra="ignore")


# College Models - IPEDS 2022 Schema
class CollegeLocation(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    locale: Optional[int] = None


class SATRange(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None


class ACTRange(BaseModel):
    min: Optional[int] = None
    max: Optional[int] = None


class CollegeAdmissions(BaseModel):
    acceptanceRate: Optional[float] = None
    satRange: Optional[SATRange] = None
    actRange: Optional[ACTRange] = None


class CollegeEnrollment(BaseModel):
    undergrad: Optional[int] = None


class RaceEthnicityPct(BaseModel):
    black: Optional[float] = None
    hispanic: Optional[float] = None
    white: Optional[float] = None
    asian: Optional[float] = None
    pacificIslander: Optional[float] = None
    americanIndian: Optional[float] = None
    multiracial: Optional[float] = None
    nonResident: Optional[float] = None
    unknown: Optional[float] = None


class GenderPct(BaseModel):
    male: Optional[float] = None
    female: Optional[float] = None


class CollegeDiversity(BaseModel):
    raceEthnicityPct: Optional[RaceEthnicityPct] = None
    genderPct: Optional[GenderPct] = None
    pellPct: Optional[float] = None


class CollegeFinancials(BaseModel):
    tuitionInState: Optional[int] = None
    tuitionOutOfState: Optional[int] = None
    feesInState: Optional[int] = None
    feesOutOfState: Optional[int] = None
    avgCostAttendance: Optional[int] = None


class CollegeOutcomes(BaseModel):
    gradRate4yr: Optional[float] = None
    gradRate6yr: Optional[float] = None


class College(BaseDBModel):
    ipedsId: str
    name: Optional[str] = None
    alias: Optional[str] = None
    website: Optional[str] = None
    location: Optional[CollegeLocation] = None
    control: Optional[int] = None  # 1=Public, 2=Private nonprofit, 3=Private for-profit
    sector: Optional[int] = None
    admissions: Optional[CollegeAdmissions] = None
    enrollment: Optional[CollegeEnrollment] = None
    diversity: Optional[CollegeDiversity] = None
    financials: Optional[CollegeFinancials] = None
    outcomes: Optional[CollegeOutcomes] = None
    override: Optional[dict] = {}
    staticSource: Optional[str] = None
    lastStaticUpdate: Optional[str] = None


# UI-Optimized Flat College Model (for colleges_ui collection)
class CollegeUI(BaseDBModel):
    """Flat, UI-friendly college model"""
    name: str
    slug: str
    city: Optional[str] = None
    state: Optional[str] = None
    publicPrivate: Optional[str] = None
    degreeLevel: Optional[str] = None
    
    # Financials
    inStateTuition: Optional[int] = None
    outStateTuition: Optional[int] = None
    avgNetPrice: Optional[int] = None
    stickerPriceInState: Optional[int] = None
    stickerPriceOutState: Optional[int] = None
    
    # Admissions
    acceptanceRate: Optional[int] = None  # 0-100 scale
    satAvg: Optional[int] = None
    actAvg: Optional[int] = None
    
    # Metadata
    website: Optional[str] = None
    canonicalUrl: Optional[str] = None
    isActive: bool = True
    
    # Timestamps
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    
    # Reference
    ipedsId: Optional[str] = None
    sourceCollection: Optional[str] = None


# Legacy models for backward compatibility (admin panel)
class CollegeCreate(BaseModel):
    name: str
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
    direct_admission: Optional[bool] = False
    majors: Optional[List[str]] = []
    features: Optional[List[str]] = []


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
    
    # Profile enhancements
    profile_picture_url: Optional[str] = None
    badges: List[str] = []
    
    # Onboarding fields
    onboarding_completed: bool = False
    user_role: Optional[str] = None  # Prospective Student, Parent/Guardian, Other
    self_description: Optional[str] = None  # Middle School, High School, College Student, Adult Learner
    high_school_grad_year: Optional[str] = None
    intended_enrollment_year: Optional[str] = None
    intended_enrollment_term: Optional[str] = None  # Fall, Spring, Summer
    birthdate: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    high_school_name: Optional[str] = None
    intended_major: Optional[str] = None
    sat_score: Optional[str] = None
    act_score: Optional[str] = None
    gpa: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    address: Optional[str] = None
    alternate_major: Optional[str] = None
    interests: List[str] = []
    
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
    onboarding_completed: bool
    created_at: datetime


class OnboardingData(BaseModel):
    user_role: Optional[str] = None
    self_description: Optional[str] = None
    high_school_grad_year: Optional[str] = None
    intended_enrollment_year: Optional[str] = None
    intended_enrollment_term: Optional[str] = None
    birthdate: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    high_school_name: Optional[str] = None
    intended_major: Optional[str] = None
    sat_score: Optional[str] = None
    act_score: Optional[str] = None
    gpa: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Saved Items
class SavedItem(BaseModel):
    item_id: str
    item_type: str  # college or scholarship


# Lead Models
class Lead(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None  # If user is logged in
    college_id: str
    college_name: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    high_school_grad_year: Optional[str] = None
    interested_major: Optional[str] = None
    consent_to_contact: bool = True
    consent_to_share: bool = False
    source: str = "website"  # website, mobile, etc.
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class LeadCreate(BaseModel):
    college_id: str
    college_name: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    high_school_grad_year: Optional[str] = None
    interested_major: Optional[str] = None
    consent_to_contact: bool = True
    consent_to_share: bool = False


# Chat Models
class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


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


# ==================== Article Models ====================

class ArticleCreate(BaseModel):
    title: str
    slug: str
    summary: str
    body: str
    main_image_url: Optional[str] = None
    video_url: Optional[str] = None
    category: str
    tags: List[str] = []
    is_featured: bool = False
    is_video: bool = False
    is_published: bool = False
    published_at: Optional[datetime] = None


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    body: Optional[str] = None
    main_image_url: Optional[str] = None
    video_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_video: Optional[bool] = None
    is_published: Optional[bool] = None
    published_at: Optional[datetime] = None


class Article(BaseDBModel):
    id: str
    title: str
    slug: str
    summary: str
    body: str
    main_image_url: Optional[str] = None
    video_url: Optional[str] = None
    category: str
    tags: List[str] = []
    is_featured: bool = False
    is_video: bool = False
    is_published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    read_time_minutes: Optional[int] = None


# SavedCollege Models (with status tracking)
class SavedCollegeItem(BaseModel):
    college_id: str
    status: str = "Considering"  # Considering, Applied, Accepted, Waitlisted, Denied, Attending
    saved_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class SavedCollegeUpdate(BaseModel):
    status: str


# ToDo Models
class ToDo(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: str = "Not Started"  # Not Started, In Progress, Completed
    color_theme: str = "yellow"  # yellow, blue, green, pink, purple
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class ToDoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: str = "Not Started"
    color_theme: str = "yellow"


class ToDoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    color_theme: Optional[str] = None


# Profile Update Models
class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    high_school_grad_year: Optional[str] = None
    high_school_name: Optional[str] = None
    gpa: Optional[str] = None
    intended_major: Optional[str] = None
    alternate_major: Optional[str] = None
    sat_score: Optional[str] = None
    act_score: Optional[str] = None
    gender: Optional[str] = None
    ethnicity: Optional[str] = None
    interests: Optional[List[str]] = None
    profile_picture_url: Optional[str] = None
    birthdate: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    intended_enrollment_term: Optional[str] = None
    intended_enrollment_year: Optional[str] = None
    onboarding_completed: Optional[bool] = None



# Institution Reference Models (Canonical Colleges/Universities)
class Institution(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ipeds_id: Optional[str] = None  # IPEDS UnitID
    name: str
    city: str
    state: str  # 2-letter code
    level: Optional[str] = None  # "2-year", "4-year", etc.
    control: Optional[str] = None  # "Public", "Private nonprofit", "Private for-profit"
    website_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class InstitutionCreate(BaseModel):
    ipeds_id: Optional[str] = None
    name: str
    city: str
    state: str
    level: Optional[str] = None
    control: Optional[str] = None
    website_url: Optional[str] = None


# High School Reference Models
class HighSchool(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nces_id: Optional[str] = None  # NCES School ID
    name: str
    district: Optional[str] = None
    city: str
    state: str  # 2-letter code
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class HighSchoolCreate(BaseModel):
    nces_id: Optional[str] = None
    name: str
    district: Optional[str] = None
    city: str
    state: str


# U.S. States Reference
US_STATES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
    "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
    "WI": "Wisconsin", "WY": "Wyoming", "DC": "District of Columbia",
    "PR": "Puerto Rico", "VI": "U.S. Virgin Islands", "GU": "Guam",
    "AS": "American Samoa", "MP": "Northern Mariana Islands"
}


# GPA Options (1.0 to 4.0 in 0.1 increments)
GPA_OPTIONS = [round(x * 0.1, 1) for x in range(0, 41)]  # 0.0 to 4.0


# Validation Functions
def validate_state(state: str) -> bool:
    """Validate that state is a valid 2-letter U.S. state code"""
    return state.upper() in US_STATES


def validate_gpa(gpa: str) -> bool:
    """Validate that GPA is within 0.0-4.0 range"""
    try:
        gpa_float = float(gpa)
        return 0.0 <= gpa_float <= 4.0 and round(gpa_float, 1) == gpa_float
    except (ValueError, TypeError):
        return False


def validate_date_string(date_str: str) -> bool:
    """Validate that date string is in valid ISO format"""
    if not date_str:
        return True  # Optional dates are valid
    try:
        datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return True
    except (ValueError, AttributeError):
        return False


def validate_zip_code(zip_code: str) -> bool:
    """Validate U.S. ZIP code format (5 digits or 5+4)"""
    import re
    if not zip_code:
        return False
    return bool(re.match(r'^\d{5}(-\d{4})?$', zip_code))


def validate_address(street: str, city: str, state: str, zip_code: str) -> tuple[bool, str]:
    """Validate complete address. Returns (is_valid, error_message)"""
    if not street or not street.strip():
        return False, "Street address is required"
    if not city or not city.strip():
        return False, "City is required"
    if not validate_state(state):
        return False, "Invalid state code"
    if not validate_zip_code(zip_code):
        return False, "Invalid ZIP code format (use 5 digits or 5+4 format)"
    return True, ""


# Mega Menu Feature Tile Models
class MegaMenuFeature(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    menu_key: str  # "student_pathways", "tools", "resources"
    label: str  # e.g., "FEATURED", "UPCOMING WEBINAR"
    title: str
    subtitle: str  # description/summary
    cta_text: str  # Button text
    cta_url: str
    image_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class MegaMenuFeatureCreate(BaseModel):
    menu_key: str
    label: str
    title: str
    subtitle: str
    cta_text: str
    cta_url: str
    image_url: Optional[str] = None
    is_active: bool = True


class MegaMenuFeatureUpdate(BaseModel):
    label: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    cta_text: Optional[str] = None
    cta_url: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None



# ==================== Announcement Bar Models ====================

class AnnouncementBarCreate(BaseModel):
    title: str = Field(..., max_length=200)
    body: str = Field(..., max_length=200)
    start_date: datetime
    end_date: datetime
    color: str = "green"  # green, yellow, red, blue
    link_url: Optional[str] = None
    status: str = "active"  # active, archived


class AnnouncementBarUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    body: Optional[str] = Field(None, max_length=200)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    color: Optional[str] = None
    link_url: Optional[str] = None
    status: Optional[str] = None


class AnnouncementBar(BaseDBModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    body: str
    start_date: datetime
    end_date: datetime
    color: str = "green"
    link_url: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())
