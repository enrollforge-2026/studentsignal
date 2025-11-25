# Student Signal Platform - API Contracts

## Overview
This document outlines the API contracts for the Student Signal platform, mapping mock data to actual backend endpoints.

---

## Mocked Data in Frontend (mockData.js)

### 1. Colleges Data
- **Location**: `/app/frontend/src/data/mockData.js`
- **Current**: Static array of 8 colleges with IPEDS-like fields
- **To Replace**: Real IPEDS database queries

### 2. Testimonials
- **Location**: `mockData.js`
- **Current**: Static testimonials array
- **To Replace**: CMS-managed content from MongoDB

### 3. Admin Content
- **Location**: `mockData.js`
- **Current**: Static hero, features, search section content
- **To Replace**: MongoDB content collection

---

## API Endpoints

### Authentication APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/register` | User registration | `{firstName, lastName, email, password}` | `{user, token}` |
| POST | `/api/auth/login` | User login | `{email, password}` | `{user, token}` |
| GET | `/api/auth/me` | Get current user | Headers: `Authorization: Bearer <token>` | `{user}` |
| POST | `/api/auth/logout` | Logout user | - | `{message}` |

### College APIs

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/colleges` | List colleges | `search, state, type, minTuition, maxTuition, directAdmission, page, limit` | `{colleges[], total, page}` |
| GET | `/api/colleges/:id` | Get college detail | - | `{college}` |
| GET | `/api/colleges/compare` | Compare colleges | `ids=1,2,3` | `{colleges[]}` |
| GET | `/api/colleges/rankings` | Get rankings list | `category` | `{rankings[]}` |

### User Profile APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/users/profile` | Get user profile | - | `{user}` |
| PUT | `/api/users/profile` | Update profile | `{firstName, lastName, ...}` | `{user}` |
| GET | `/api/users/saved-colleges` | Get saved colleges | - | `{colleges[]}` |
| POST | `/api/users/saved-colleges` | Save a college | `{collegeId}` | `{message}` |
| DELETE | `/api/users/saved-colleges/:id` | Remove saved | - | `{message}` |

### Admin APIs

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/admin/stats` | Get dashboard stats | - | `{totalColleges, activeUsers, pageViews, savedSchools}` |
| GET | `/api/admin/colleges` | List all colleges | `search, page, limit` | `{colleges[], total}` |
| POST | `/api/admin/colleges` | Add new college | `{college data}` | `{college}` |
| PUT | `/api/admin/colleges/:id` | Update college | `{college data}` | `{college}` |
| DELETE | `/api/admin/colleges/:id` | Delete college | - | `{message}` |
| GET | `/api/admin/content` | Get site content | - | `{content}` |
| PUT | `/api/admin/content` | Update content | `{section, data}` | `{content}` |
| GET | `/api/admin/media` | List media files | - | `{media[]}` |
| POST | `/api/admin/media/upload` | Upload media | FormData | `{media}` |
| DELETE | `/api/admin/media/:id` | Delete media | - | `{message}` |

### IPEDS Data APIs

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/api/ipeds/sync` | Sync IPEDS data | `{status, updated}` |
| GET | `/api/ipeds/status` | Get sync status | `{lastSync, totalRecords}` |

---

## Database Models

### College Schema
```python
{
    "_id": ObjectId,
    "ipeds_id": str,  # IPEDS Unit ID
    "name": str,
    "short_name": str,
    "location": str,
    "state": str,
    "type": str,  # Public/Private
    "enrollment": int,
    "acceptance_rate": float,
    "tuition_in_state": int,
    "tuition_out_state": int,
    "sat_range": str,
    "act_range": str,
    "graduation_rate": float,
    "ranking": int,
    "rating": str,
    "image": str,
    "description": str,
    "direct_admission": bool,
    "majors": List[str],
    "features": List[str],
    "created_at": datetime,
    "updated_at": datetime
}
```

### User Schema
```python
{
    "_id": ObjectId,
    "email": str,
    "password_hash": str,
    "first_name": str,
    "last_name": str,
    "role": str,  # user/admin
    "saved_colleges": List[ObjectId],
    "created_at": datetime,
    "updated_at": datetime
}
```

### Content Schema
```python
{
    "_id": ObjectId,
    "section": str,  # hero, direct_admissions, search, features, testimonials
    "data": dict,
    "updated_at": datetime,
    "updated_by": ObjectId
}
```

### Media Schema
```python
{
    "_id": ObjectId,
    "name": str,
    "type": str,  # image/video
    "url": str,
    "thumbnail": str,
    "size": str,
    "dimensions": str,
    "uploaded_at": datetime,
    "uploaded_by": ObjectId
}
```

---

## Frontend Integration Points

### Replace Mock Data
1. `CollegesPage.jsx` - Replace `colleges` import with API call to `/api/colleges`
2. `CollegeDetailPage.jsx` - Fetch single college from `/api/colleges/:id`
3. `ProfilePage.jsx` - Fetch saved colleges from `/api/users/saved-colleges`
4. `HomePage.jsx` - Fetch testimonials and content from `/api/admin/content`
5. `AdminDashboard.jsx` - Fetch stats from `/api/admin/stats`
6. `AdminColleges.jsx` - CRUD operations via `/api/admin/colleges`
7. `AdminContent.jsx` - Content management via `/api/admin/content`
8. `AdminMedia.jsx` - Media management via `/api/admin/media`

### Authentication Integration
- Store JWT token in localStorage after login
- Add Authorization header to all authenticated requests
- Implement auth context for user state management

---

## IPEDS Data Integration

### Data Source
- IPEDS (Integrated Postsecondary Education Data System)
- Download CSV files from https://nces.ed.gov/ipeds/

### Key IPEDS Fields to Import
- UNITID - Institution ID
- INSTNM - Institution name
- CITY, STABBR - Location
- CONTROL - Public/Private
- ENRTOT - Total enrollment
- ACTCMMID - ACT midpoint
- SATMT25, SATMT75 - SAT ranges
- TUFEYR - In-state tuition
- RET_PCF - Retention rate
- PCIP* - Program percentages (for majors)

---

## Implementation Order

1. **Phase 1**: Backend setup
   - MongoDB models
   - Authentication endpoints
   - College CRUD endpoints

2. **Phase 2**: IPEDS Integration
   - IPEDS data parser
   - Data sync endpoint
   - College data population

3. **Phase 3**: Frontend Integration
   - Auth context
   - API service layer
   - Replace mock data with API calls

4. **Phase 4**: Admin Features
   - Content management
   - Media upload
   - User management
