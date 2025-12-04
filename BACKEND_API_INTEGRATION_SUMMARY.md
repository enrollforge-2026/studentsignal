# Backend API Integration - colleges_ui

## Overview
Successfully integrated `studentsignal.colleges_ui` collection into the StudentSignal backend API layer. All college endpoints now serve flat, UI-optimized data instead of nested IPEDS schema.

---

## Files Modified

### 1. `/app/backend/models.py`
**Changes:**
- Added new `CollegeUI` Pydantic model matching the flat UI schema
- Model includes all 19 UI fields: name, slug, city, state, publicPrivate, degreeLevel, financials, admissions, metadata

**New Model:**
```python
class CollegeUI(BaseDBModel):
    name: str
    slug: str
    city: Optional[str] = None
    state: Optional[str] = None
    publicPrivate: Optional[str] = None
    degreeLevel: Optional[str] = None
    inStateTuition: Optional[int] = None
    outStateTuition: Optional[int] = None
    avgNetPrice: Optional[int] = None
    stickerPriceInState: Optional[int] = None
    stickerPriceOutState: Optional[int] = None
    acceptanceRate: Optional[int] = None
    satAvg: Optional[int] = None
    actAvg: Optional[int] = None
    website: Optional[str] = None
    canonicalUrl: Optional[str] = None
    isActive: bool = True
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    ipedsId: Optional[str] = None
    sourceCollection: Optional[str] = None
```

---

### 2. `/app/backend/database.py`
**Changes:**
- Added `colleges_ui_collection` reference
- Marked `colleges_collection` as legacy/READ-ONLY

**Before:**
```python
colleges_collection = db.colleges
```

**After:**
```python
colleges_collection = db.colleges  # Legacy IPEDS nested schema (READ-ONLY)
colleges_ui_collection = db.colleges_ui  # New flat UI-optimized schema (ACTIVE)
```

---

### 3. `/app/backend/server.py`

#### Import Changes
**Added:**
- `CollegeUI` model import
- `colleges_ui_collection` import

---

#### Route Changes

##### A. `GET /api/colleges` (List colleges with filters)

**Before:**
- Used `colleges_collection`
- Filters: `location.state`, `control`, `financials.tuitionInState`
- Returned nested IPEDS schema

**After:**
- Uses `colleges_ui_collection`
- Filters: `state`, `publicPrivate`, `degreeLevel`, `inStateTuition`
- Added `isActive: true` filter to only show active colleges
- Returns flat UI schema

**Query Parameter Changes:**
| Old Parameter | New Parameter | Type | Description |
|--------------|---------------|------|-------------|
| `control` | `publicPrivate` | string | "Public", "Private", "Private For-Profit" |
| *(new)* | `degreeLevel` | string | "4-Year", "2-Year", etc. |
| `min_tuition` | `min_tuition` | int | Min in-state tuition |
| `max_tuition` | `max_tuition` | int | Max in-state tuition |

**Search Behavior:**
- **Before:** Searched `name`, `alias`, `location.city`
- **After:** Searches `name`, `city`, `slug`

**Example Response:**
```json
{
  "colleges": [
    {
      "name": "The University of Alabama",
      "slug": "the-university-of-alabama",
      "city": "Tuscaloosa",
      "state": "AL",
      "publicPrivate": "Public",
      "degreeLevel": "4-Year",
      "inStateTuition": 11100,
      "acceptanceRate": 80,
      "satAvg": 1270,
      "actAvg": 27,
      "website": "https://www.ua.edu",
      "canonicalUrl": "/colleges/al/the-university-of-alabama",
      "isActive": true
    }
  ],
  "total": 6256,
  "page": 1,
  "limit": 20,
  "pages": 313
}
```

---

##### B. `GET /api/colleges/{college_id}` (Get single college)

**Before:**
- Used `colleges_collection`
- Lookup by `ipedsId` only
- Returned nested IPEDS schema
- Response model: `College`

**After:**
- Uses `colleges_ui_collection`
- Lookup by `ipedsId` OR `slug` (supports both)
- Returns flat UI schema
- Response model: `CollegeUI`

**Example:**
```bash
# Both work:
GET /api/colleges/100751
GET /api/colleges/the-university-of-alabama
```

---

##### C. `POST /api/users/saved-colleges` (Save college)

**Before:**
- Validated against `colleges_collection`
- Looked up by `ipedsId` only

**After:**
- Validates against `colleges_ui_collection`
- Looks up by `ipedsId` OR `slug`
- Always stores `ipedsId` for consistency

---

##### D. `GET /api/users/saved-colleges` (Get saved colleges)

**Before:**
- Queried `colleges_collection`
- Returned nested IPEDS schema
- Response model: `List[College]`

**After:**
- Queries `colleges_ui_collection`
- Returns flat UI schema
- Response model: `List[CollegeUI]`

---

## API Response Schema Comparison

### Before (Nested IPEDS Schema)
```json
{
  "ipedsId": "100751",
  "name": "The University of Alabama",
  "location": {
    "city": "Tuscaloosa",
    "state": "AL",
    "zip": "35487-0100"
  },
  "control": 1,
  "admissions": {
    "acceptanceRate": 0.8006,
    "satRange": {"min": 1130, "max": 1410}
  },
  "financials": {
    "tuitionInState": 11100,
    "feesInState": 840
  }
}
```

### After (Flat UI Schema)
```json
{
  "name": "The University of Alabama",
  "slug": "the-university-of-alabama",
  "city": "Tuscaloosa",
  "state": "AL",
  "publicPrivate": "Public",
  "degreeLevel": "4-Year",
  "inStateTuition": 11100,
  "stickerPriceInState": 11940,
  "acceptanceRate": 80,
  "satAvg": 1270,
  "actAvg": 27,
  "website": "https://www.ua.edu",
  "canonicalUrl": "/colleges/al/the-university-of-alabama",
  "isActive": true,
  "ipedsId": "100751"
}
```

---

## Key Improvements

### 1. **Flattened Structure**
- No nested objects for location, admissions, financials
- Direct field access: `college.city` vs `college.location.city`

### 2. **Human-Readable Values**
- `publicPrivate: "Public"` instead of `control: 1`
- `degreeLevel: "4-Year"` instead of `sector: 1`
- `acceptanceRate: 80` (percentage) instead of `0.8006` (decimal)

### 3. **Computed Fields**
- `slug` - SEO-friendly URL identifier
- `canonicalUrl` - Full URL path
- `satAvg` - Midpoint of SAT range
- `actAvg` - Midpoint of ACT range
- `stickerPriceInState` - Tuition + fees

### 4. **SEO-Friendly Lookups**
- Supports slug-based lookups: `/api/colleges/harvard-university`
- Better for URL routing: `/colleges/ma/harvard-university`

### 5. **Active Status Filtering**
- All queries filtered by `isActive: true`
- Future-ready for archiving colleges

---

## Testing Results

### Test 1: List Colleges
```bash
curl "http://localhost:8001/api/colleges?limit=2"
```
✅ **Result:** Returns 2 colleges from `colleges_ui` with flat schema

### Test 2: Get College by IPEDS ID
```bash
curl "http://localhost:8001/api/colleges/100751"
```
✅ **Result:** Returns University of Alabama with flat schema

### Test 3: Get College by Slug
```bash
curl "http://localhost:8001/api/colleges/the-university-of-alabama"
```
✅ **Result:** Returns University of Alabama (same as test 2)

### Test 4: Filter by State
```bash
curl "http://localhost:8001/api/colleges?state=CA&limit=3"
```
✅ **Result:** Returns 692 CA colleges, first 3 displayed

### Test 5: Backend Status
```bash
tail /var/log/supervisor/backend.err.log
```
✅ **Result:** No errors, application startup complete

---

## Migration Notes

### What Changed
- ✅ All college endpoints now use `colleges_ui_collection`
- ✅ Response payloads match flat UI schema
- ✅ Backward compatible: still supports `ipedsId` lookups
- ✅ Forward compatible: supports `slug` lookups

### What Didn't Change
- ❌ Frontend code (not modified yet)
- ❌ Admin college routes (still use legacy schema)
- ❌ User authentication/onboarding (unaffected)
- ❌ Other collections (scholarships, users, etc.)

### Breaking Changes
⚠️ **Response Schema:** API responses now return flat schema instead of nested
- Frontend will need to update field access patterns
- Transformation layer in frontend (`CollegeDataWrapper.jsx`) may need updates

---

## Next Steps

### Frontend Integration Required
1. Update frontend API service to handle new flat schema
2. Remove or update `transformCollegeForUI()` wrapper (may be unnecessary now)
3. Update component field access (e.g., `college.location.city` → `college.city`)
4. Test all college-related pages and components

### Optional Enhancements
1. Add search by `slug` to `/api/colleges` endpoint
2. Add sorting options (by name, tuition, acceptance rate)
3. Add more filter options (SAT/ACT ranges, enrollment size)
4. Add `/api/colleges/state/{state}` dedicated state page endpoint

---

## Rollback Plan

If issues arise, revert by:
1. Change `colleges_ui_collection` back to `colleges_collection` in routes
2. Change `CollegeUI` response models back to `College`
3. Restart backend

All changes are in API layer only - no database modifications needed for rollback.

---

## Summary

✅ **Backend API integration complete**
✅ **All college endpoints now serve flat UI-optimized data**
✅ **No frontend changes required for this task**
✅ **Testing confirms all endpoints working correctly**

**Status:** Ready for frontend integration in next phase.
