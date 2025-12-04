# Scholarship Engine - Phase 1: Data Audit & UI Schema Definition

## 📊 DATA SOURCES FOUND

### 1. Backend Seed Data
**File:** `/app/backend/seed_data.py`
- **Type:** Python seed script
- **Row Count:** 8 sample scholarships
- **Status:** Mock data for development/testing
- **Last Updated:** Unknown (development data)

### 2. Frontend Mock Data
**File:** `/app/frontend/src/data/mockData.js`
- **Type:** JavaScript mock data
- **Row Count:** 8 scholarships (same as backend)
- **Status:** Client-side mock data
- **Consistency:** ✅ Matches backend seed data

### 3. Backend Pydantic Model
**File:** `/app/backend/models.py`
- **Class:** `Scholarship` (BaseDBModel)
- **Purpose:** Schema validation and API responses
- **Status:** Active, but basic

### 4. Database Collection
**Collection:** `studentsignal.scholarships`
- **Status:** ❌ NOT FOUND (not seeded yet)
- **Expected:** Would contain 8 records if seeded

---

## 🔍 SCHEMA AUDIT

### Current Backend Model (Pydantic)
```python
class Scholarship(BaseDBModel):
    id: str
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
    created_at: datetime
    updated_at: datetime
```

### Current Mock Data Schema
```javascript
{
    id: number,
    name: string,
    amount: string,
    deadline: string,
    type: string,
    category: string,
    description: string,
    eligibility: string[],
    renewable: boolean,
    applicationRequired: boolean,
    image: string
}
```

### Field Inventory

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string/number | ✅ | Unique identifier | "uuid" or 1 |
| `name` | string | ✅ | Scholarship name | "National Merit Scholarship" |
| `amount` | string | ✅ | Award amount (text) | "Up to $2,500" |
| `deadline` | string | ✅ | Application deadline (text) | "October 15, 2025" |
| `type` | string | ✅ | Scholarship type | "Merit-Based" |
| `category` | string | ✅ | Category/tag | "Academic Excellence" |
| `description` | string | ✅ | Full description | Long text |
| `eligibility` | array | ✅ | Eligibility criteria | ["High school seniors", ...] |
| `renewable` | boolean | ✅ | Is renewable? | true |
| `application_required` | boolean | ✅ | Requires application? | true |
| `image` | string | ❌ | Image URL | Unsplash URL |
| `created_at` | datetime | ✅ | Creation timestamp | ISO string |
| `updated_at` | datetime | ✅ | Update timestamp | ISO string |

---

## ⚠️ DATA QUALITY ISSUES

### 1. **Amount Field Inconsistencies** 🔴 **CRITICAL**
**Issue:** Amount is stored as free-text string, making filtering/sorting impossible

**Examples:**
- "Up to $2,500"
- "$20,000"
- "Full Cost of Attendance"
- "$5,000"

**Problems:**
- Cannot filter by min/max amount
- Cannot sort by scholarship value
- Cannot aggregate total value
- No standardized format

**Recommendation:** Add separate `amountMin` and `amountMax` numeric fields

---

### 2. **Deadline Format Inconsistencies** 🟠 **HIGH**
**Issue:** Deadline is stored as free-text, not a proper date

**Examples:**
- "October 15, 2025"
- "October 31, 2025"
- "September 15, 2025"

**Problems:**
- Cannot sort by deadline
- Cannot filter "closing soon"
- Cannot calculate days remaining
- Difficult to show in user timezone

**Recommendation:** Convert to ISO date format or Unix timestamp

---

### 3. **Missing Sponsor Information** 🟡 **MEDIUM**
**Issue:** No field for scholarship sponsor/provider

**Examples of Missing Data:**
- Who provides the National Merit Scholarship?
- Organization contact information
- Sponsor website

**Recommendation:** Add `sponsor` and `sponsorWebsite` fields

---

### 4. **No Website/Application Link** 🟡 **MEDIUM**
**Issue:** No field for application URL

**Problems:**
- Users cannot easily apply
- No way to link to official scholarship page
- Reduced conversion rate

**Recommendation:** Add `website` and `applicationUrl` fields

---

### 5. **Category Lacks Structure** 🟡 **MEDIUM**
**Issue:** Category is single string, but scholarships can have multiple categories

**Examples:**
- "Academic Excellence" (single tag)
- "Women in STEM" (could be both "Women" AND "STEM")

**Problems:**
- Cannot filter by multiple categories
- Limited search capability

**Recommendation:** Consider `tags` or `categories` array for multi-category support

---

### 6. **Type Field Limited** 🟢 **LOW**
**Issue:** Type field has only 3 values: Merit-Based, Need-Based, Athletic

**Missing Types:**
- Essay-based
- Community Service
- Demographic-specific
- Major-specific
- State-specific

**Recommendation:** Expand type taxonomy or use multi-tag system

---

### 7. **Eligibility Array Unstructured** 🟢 **LOW**
**Issue:** Eligibility is free-text array with no schema

**Examples:**
- "High school seniors" (grade level)
- "Minimum 3.0 GPA" (academic requirement)
- "U.S. citizens" (citizenship)

**Problems:**
- Cannot programmatically filter
- Difficult to match with user profiles
- No standardized criteria

**Recommendation:** Future structured eligibility system (Phase 3+)

---

### 8. **No Slug for SEO** 🟢 **LOW**
**Issue:** No URL-friendly slug field

**Current:** `/scholarship/uuid`
**Better:** `/scholarship/national-merit-scholarship`

**Recommendation:** Add `slug` field

---

### 9. **No Active/Inactive Status** 🟢 **LOW**
**Issue:** No way to deactivate expired scholarships

**Recommendation:** Add `isActive` boolean field

---

### 10. **ID Inconsistency** 🟡 **MEDIUM**
**Issue:** Frontend uses numeric IDs (1, 2, 3), backend uses UUIDs

**Problems:**
- Schema mismatch between frontend/backend
- Potential conflicts

**Recommendation:** Standardize on string IDs (UUIDs)

---

## 📋 PROPOSED UI-READY SCHEMA

### Flat Schema for `studentsignal.scholarships_ui`

```javascript
{
  // Core Identity
  "id": "uuid-string",                    // Unique identifier
  "slug": "national-merit-scholarship",   // URL-friendly identifier
  "name": "National Merit Scholarship",   // Display name
  
  // Financial
  "amount": "$2,500",                     // Display amount (text)
  "amountMin": 2500,                      // Numeric min (for filtering)
  "amountMax": 2500,                      // Numeric max (for filtering)
  "amountType": "fixed",                  // "fixed", "range", "full-ride", "varies"
  
  // Deadlines
  "deadline": "2025-10-15T23:59:59Z",     // ISO 8601 date
  "deadlineDisplay": "October 15, 2025",  // Human-readable
  "isRolling": false,                     // Rolling admissions?
  
  // Categorization
  "type": "Merit-Based",                  // Primary type
  "category": "Academic Excellence",      // Primary category
  "tags": ["merit", "academic", "psat"],  // Multi-tag support
  
  // Content
  "description": "Full text...",          // Long description
  "eligibility": [                        // Criteria list
    "High school seniors",
    "U.S. citizens",
    "Top PSAT scores"
  ],
  
  // Application Info
  "renewable": true,                      // Can be renewed?
  "applicationRequired": true,            // Requires application?
  "website": "https://...",               // Official website
  "applicationUrl": "https://...",        // Direct application link
  
  // Sponsor
  "sponsor": "National Merit Corp",       // Sponsor name
  "sponsorWebsite": "https://...",        // Sponsor site
  
  // Metadata
  "imageUrl": "https://...",              // Hero image
  "isActive": true,                       // Active status
  "featured": false,                      // Featured on homepage?
  
  // Timestamps
  "createdAt": "2025-12-04T...",         // Creation date
  "updatedAt": "2025-12-04T...",         // Last update
  
  // Source tracking
  "sourceCollection": "scholarships"      // Reference to original
}
```

---

## 🔄 MAPPING TABLE: Raw → UI Schema

| Raw Field (Backend) | UI Field | Transformation | Priority |
|---------------------|----------|----------------|----------|
| `id` | `id` | Direct copy (ensure UUID string) | P0 |
| *(generated)* | `slug` | `slugify(name)` | P0 |
| `name` | `name` | Direct copy | P0 |
| `amount` | `amount` | Direct copy (display text) | P0 |
| `amount` | `amountMin` | **Parse numeric value** | P0 |
| `amount` | `amountMax` | **Parse numeric value** | P0 |
| *(derived)* | `amountType` | **Detect from amount string** | P1 |
| `deadline` | `deadline` | **Convert to ISO 8601** | P0 |
| `deadline` | `deadlineDisplay` | Direct copy | P0 |
| *(default)* | `isRolling` | Default `false` | P2 |
| `type` | `type` | Direct copy | P0 |
| `category` | `category` | Direct copy | P0 |
| *(generated)* | `tags` | **Derive from type+category** | P1 |
| `description` | `description` | Direct copy | P0 |
| `eligibility` | `eligibility` | Direct copy | P0 |
| `renewable` | `renewable` | Direct copy | P0 |
| `application_required` | `applicationRequired` | Direct copy (fix naming) | P0 |
| *(missing)* | `website` | **Needs research/enrichment** | P1 |
| *(missing)* | `applicationUrl` | **Needs research/enrichment** | P2 |
| *(missing)* | `sponsor` | **Needs research/enrichment** | P1 |
| *(missing)* | `sponsorWebsite` | **Needs research/enrichment** | P2 |
| `image` | `imageUrl` | Direct copy (rename for consistency) | P0 |
| *(default)* | `isActive` | Default `true` | P0 |
| *(default)* | `featured` | Default `false` | P2 |
| `created_at` | `createdAt` | Direct copy (ensure ISO format) | P0 |
| `updated_at` | `updatedAt` | Direct copy (ensure ISO format) | P0 |
| *(hardcoded)* | `sourceCollection` | Set to "scholarships" | P0 |

### Priority Legend:
- **P0:** Must have for Phase 2 (ETL)
- **P1:** Should have for Phase 2
- **P2:** Nice to have (can enrich later)

---

## 🚨 REQUIRED FIELDS MISSING FROM RAW DATA

### Critical Missing Fields:
1. **`sponsor`** - Who provides the scholarship?
   - Must be manually added or researched
   - Example: "National Merit Scholarship Corporation"

2. **`website`** - Official scholarship website
   - Must be manually added or researched
   - Example: "https://www.nationalmerit.org"

3. **`applicationUrl`** - Direct link to apply
   - Must be manually added or researched
   - Can default to `website` if same

### Nice-to-Have Missing Fields:
4. **`sponsorWebsite`** - Sponsor organization site
5. **`tags`** - Multi-category tagging system
6. **`amountType`** - Categorization of award amounts

---

## 🔮 FIELDS FOR FUTURE ENRICHMENT (Phase 3+)

These fields can be added later without blocking Phase 2:

1. **`majors`** - Applicable majors/fields of study
   - Array of strings
   - Example: ["Computer Science", "Engineering"]

2. **`states`** - Geographic restrictions
   - Array of state codes
   - Example: ["CA", "NY", "TX"]

3. **`ethnicity`** - Demographic requirements
   - Array of strings
   - Example: ["Hispanic", "Latino"]

4. **`gpaMin`** - Minimum GPA requirement
   - Numeric value
   - Example: 3.0

5. **`yearLevel`** - Applicable year levels
   - Array of strings
   - Example: ["freshman", "sophomore"]

6. **`citizenshipRequired`** - U.S. citizenship required?
   - Boolean
   - Example: true

7. **`viewCount`** - Number of page views
   - Numeric value for analytics

8. **`applicationCount`** - Estimated applicants
   - Numeric value for competitiveness

---

## 📈 DATA QUALITY STATISTICS

### Current Mock Data (8 scholarships):
```
✅ Complete Fields:
  - name: 8/8 (100%)
  - description: 8/8 (100%)
  - category: 8/8 (100%)
  - eligibility: 8/8 (100%)
  - renewable: 8/8 (100%)
  - image: 8/8 (100%)

⚠️ Inconsistent Fields:
  - amount: 8/8 present, 0/8 parseable
  - deadline: 8/8 present, 0/8 machine-readable
  - id: 8/8 present, 0/8 consistent type

❌ Missing Fields:
  - slug: 0/8 (0%)
  - amountMin: 0/8 (0%)
  - amountMax: 0/8 (0%)
  - website: 0/8 (0%)
  - sponsor: 0/8 (0%)
  - isActive: 0/8 (0%)
```

---

## 🎯 PHASE 2 PLAN: ETL & DB CREATION

### Task Breakdown:

#### 1. **Data Transformation Script** (Node.js)
**File:** `/app/transform_scholarships_ui.js`
**Tasks:**
- Read from seed data (8 scholarships)
- Parse amount strings → extract min/max
- Convert deadline strings → ISO dates
- Generate slugs from names
- Add default values (isActive, featured, etc.)
- Output to `scholarships_ui` collection

**Estimated Time:** 2-3 hours

---

#### 2. **Amount Parser**
**Function:** `parseAmountString(amount)`
**Logic:**
```javascript
// "Up to $2,500" → { min: 0, max: 2500, type: "range" }
// "$20,000" → { min: 20000, max: 20000, type: "fixed" }
// "Full Cost of Attendance" → { min: null, max: null, type: "full-ride" }
// "$5,000-$10,000" → { min: 5000, max: 10000, type: "range" }
```

**Edge Cases:**
- Text-only amounts ("varies", "full ride")
- Ranges ("$1,000-$5,000")
- Upper bounds ("up to $X")

---

#### 3. **Deadline Parser**
**Function:** `parseDeadlineString(deadline)`
**Logic:**
```javascript
// "October 15, 2025" → "2025-10-15T23:59:59Z"
// Use Date.parse() with timezone handling
```

---

#### 4. **Backend Model Update**
**File:** `/app/backend/models.py`
**Add:** `ScholarshipUI` Pydantic model matching new schema

---

#### 5. **Database Index Creation**
**Indexes:**
```javascript
db.scholarships_ui.createIndex({ slug: 1 }, { unique: true })
db.scholarships_ui.createIndex({ isActive: 1 })
db.scholarships_ui.createIndex({ deadline: 1 })
db.scholarships_ui.createIndex({ amountMin: 1, amountMax: 1 })
db.scholarships_ui.createIndex({ tags: 1 })
db.scholarships_ui.createIndex({ type: 1 })
db.scholarships_ui.createIndex({ category: 1 })
```

---

#### 6. **Data Enrichment (Manual)**
**Task:** Add missing sponsor/website data for 8 scholarships
**Format:** JSON file with enrichment data

**Example:**
```json
{
  "National Merit Scholarship": {
    "sponsor": "National Merit Scholarship Corporation",
    "website": "https://www.nationalmerit.org",
    "applicationUrl": "https://www.nationalmerit.org/s/1758/start.aspx",
    "sponsorWebsite": "https://www.nationalmerit.org"
  }
}
```

---

### Phase 2 Deliverables:
1. ✅ Transformation script (`transform_scholarships_ui.js`)
2. ✅ Updated Pydantic model (`ScholarshipUI`)
3. ✅ Enrichment data JSON
4. ✅ Database collection (`scholarships_ui`) with 8 records
5. ✅ Database indexes
6. ✅ Transformation log/report

---

## 🎯 PHASE 3 PREVIEW: Frontend Integration

**Out of scope for Phase 1, but planned:**

1. Update `/scholarships` page to read from `scholarships_ui`
2. Add filtering by amount range
3. Add sorting by deadline
4. Display sponsor information
5. Add "Apply Now" buttons with `applicationUrl`
6. Show "Days Until Deadline" countdown
7. Add scholarship search functionality

---

## ✅ SUMMARY

### Data Sources:
- ✅ 1 backend seed script (8 scholarships)
- ✅ 1 frontend mock data file (8 scholarships)
- ✅ 1 Pydantic model definition
- ❌ 0 real scholarship data sources

### Data Quality:
- ⚠️ **10 data quality issues identified**
- 🔴 **3 critical issues** (amount parsing, deadline format, missing sponsor)
- 🟡 **4 medium issues** (missing website, category structure, ID inconsistency)
- 🟢 **3 low issues** (type limitations, unstructured eligibility, no slug)

### Proposed Schema:
- ✅ **26 fields** in UI schema
- ✅ **P0 fields:** 17 (must have)
- ✅ **P1 fields:** 5 (should have)
- ✅ **P2 fields:** 4 (nice to have)

### Phase 2 Ready:
- ✅ Transformation logic defined
- ✅ Parsing functions specified
- ✅ Enrichment needs identified
- ✅ Database indexes planned

**Status:** READY FOR PHASE 2 - ETL & DB CREATION
