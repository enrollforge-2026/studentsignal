# 📋 Scholarship Manual Enrichment Guide - Phase 2.5

## Overview

This guide provides instructions for completing the manual enrichment of 8 scholarship records in `/app/scholarship_manual_enrichment.json`.

## What Needs to be Done

For each of the 8 scholarships, you need to provide **3 pieces of information**:

1. **sponsor** - The organization/foundation that offers the scholarship
2. **website** - The official scholarship information page
3. **applicationUrl** - Direct link to the application portal/form

---

## Field Specifications

### 1. sponsor
- **Format**: Organization name (string)
- **Length**: 5-100 characters
- **Examples**:
  - ✅ "National Merit Scholarship Corporation"
  - ✅ "The Coca-Cola Foundation"
  - ✅ "Bill & Melinda Gates Foundation"
  - ❌ "NMSC" (too abbreviated)
  - ❌ "n/a" (invalid)

### 2. website
- **Format**: Full URL starting with `https://`
- **Purpose**: Official scholarship information page
- **Examples**:
  - ✅ "https://www.nationalmerit.org/s/1758/interior.aspx?sid=1758&gid=2&pgid=424"
  - ✅ "https://www.coca-colascholarsfoundation.org/apply/"
  - ✅ "https://www.thegatesscholarship.org/scholarship"
  - ❌ "www.example.com" (missing https://)
  - ❌ "example.com/scholarship" (missing protocol)

### 3. applicationUrl
- **Format**: Full URL starting with `https://`
- **Purpose**: Direct link to application form/portal
- **Notes**: Can be the same as `website` if application is on that page
- **Examples**:
  - ✅ "https://apply.nationalmerit.org/"
  - ✅ "https://www.coca-colascholarsfoundation.org/apply/"
  - ✅ "https://thegatesscholarship.secure.force.com/application"

---

## 🎯 Quick Start Instructions

### Step 1: Open the Enrichment File
```bash
nano /app/scholarship_manual_enrichment.json
```
or view it in your preferred editor

### Step 2: Locate the `enrichment_data` Section
Each scholarship has this structure:
```json
{
  "slug": "national-merit-scholarship",
  "name": "National Merit Scholarship",
  "amount": "Up to $2,500",
  "deadline": "October 15, 2025",
  "type": "Merit-Based",
  "category": "Academic Excellence",
  "enrichment_data": {
    "sponsor": "",           ← Fill this
    "website": "",           ← Fill this
    "applicationUrl": ""     ← Fill this
  }
}
```

### Step 3: Fill in Each Field
Replace the empty strings with appropriate data:
```json
"enrichment_data": {
  "sponsor": "National Merit Scholarship Corporation",
  "website": "https://www.nationalmerit.org/scholarship-info",
  "applicationUrl": "https://www.nationalmerit.org/apply"
}
```

### Step 4: Save and Validate
- Ensure all JSON syntax is correct (commas, quotes, brackets)
- Verify all URLs start with `https://`
- Check that sponsor names are complete (not abbreviated)

---

## 📚 Complete Enrichment Template

Below is the full list of 8 scholarships requiring enrichment:

### 1. National Merit Scholarship
- **Amount**: Up to $2,500
- **Deadline**: October 15, 2025
- **Type**: Merit-Based
- **Category**: Academic Excellence
- **Needed**: sponsor, website, applicationUrl

### 2. Coca-Cola Scholars Program
- **Amount**: $20,000
- **Deadline**: October 31, 2025
- **Type**: Merit-Based
- **Category**: Leadership
- **Needed**: sponsor, website, applicationUrl

### 3. Gates Scholarship
- **Amount**: Full Cost of Attendance
- **Deadline**: September 15, 2025
- **Type**: Need-Based
- **Category**: Minority Students
- **Needed**: sponsor, website, applicationUrl

### 4. STEM Excellence Scholarship
- **Amount**: $5,000
- **Deadline**: January 15, 2026
- **Type**: Merit-Based
- **Category**: STEM
- **Needed**: sponsor, website, applicationUrl

### 5. First Generation College Scholarship
- **Amount**: $10,000
- **Deadline**: December 1, 2025
- **Type**: Need-Based
- **Category**: First Generation
- **Needed**: sponsor, website, applicationUrl

### 6. Athletic Excellence Scholarship
- **Amount**: $15,000
- **Deadline**: November 30, 2025
- **Type**: Athletic
- **Category**: Sports
- **Needed**: sponsor, website, applicationUrl

### 7. Women in Technology Scholarship
- **Amount**: $7,500
- **Deadline**: February 28, 2026
- **Type**: Merit-Based
- **Category**: Women in STEM
- **Needed**: sponsor, website, applicationUrl

### 8. Community Service Leadership Award
- **Amount**: $3,000
- **Deadline**: March 31, 2026
- **Type**: Merit-Based
- **Category**: Community Service
- **Needed**: sponsor, website, applicationUrl

---

## 🧪 Using Mock Data (For Development/Testing)

If these are **mock scholarships** for development purposes, you can use realistic but fictional data:

**Example Mock Entry:**
```json
{
  "slug": "stem-excellence-scholarship",
  "name": "STEM Excellence Scholarship",
  "enrichment_data": {
    "sponsor": "American Foundation for STEM Education",
    "website": "https://example.com/stem-scholarship",
    "applicationUrl": "https://example.com/stem-scholarship/apply"
  }
}
```

**Mock Data Guidelines:**
- Use realistic-sounding organization names
- Use `example.com` domain or create plausible mock domains
- Maintain proper URL structure
- Be consistent with scholarship theme

---

## ✅ Validation Checklist

Before submitting enrichment data, verify:

- [ ] All 8 scholarships have `sponsor` filled in
- [ ] All 8 scholarships have `website` filled in
- [ ] All 8 scholarships have `applicationUrl` filled in
- [ ] All URLs start with `https://`
- [ ] All sponsor names are full (not abbreviated)
- [ ] JSON syntax is valid (no missing commas/quotes)
- [ ] File can be parsed without errors

---

## 🚀 What Happens Next (Phase 3)

Once enrichment is complete:

1. **ETL Re-run**: The transform script will merge enrichment data with base scholarship data
2. **Database Update**: `scholarships_ui` collection will be populated with complete records
3. **Backend API**: API endpoints will be created (`/api/scholarships/*`)
4. **Frontend Integration**: UI pages will be built to display scholarships
5. **Testing**: Full backend and frontend testing

---

## 🆘 Need Help?

**Common Issues:**

**Q: Should I use real or mock data?**
A: For development, mock data is fine. Use realistic-sounding names and example.com URLs.

**Q: Can website and applicationUrl be the same?**
A: Yes! If the application is directly on the scholarship info page.

**Q: What if I can't find a real sponsor for a mock scholarship?**
A: Create a realistic fictional organization name (e.g., "National STEM Foundation").

**Q: The JSON syntax is confusing. Help?**
A: Each field needs double quotes and commas between items. Check the examples above.

---

## 📝 Example Completed Entry

```json
{
  "slug": "gates-scholarship",
  "name": "Gates Scholarship",
  "amount": "Full Cost of Attendance",
  "deadline": "September 15, 2025",
  "type": "Need-Based",
  "category": "Minority Students",
  "enrichment_data": {
    "sponsor": "Bill & Melinda Gates Foundation",
    "website": "https://www.thegatesscholarship.org/scholarship",
    "applicationUrl": "https://thegatesscholarship.secure.force.com/application"
  }
}
```

---

**File Location**: `/app/scholarship_manual_enrichment.json`

**Status**: 🟡 Awaiting enrichment data

**Next Phase**: Phase 3 - Backend API Integration (starts after enrichment complete)
