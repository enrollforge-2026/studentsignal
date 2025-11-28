# 🧊 SYSTEM-WIDE FREEZE DIRECTIVE
**Effective Date:** November 28, 2025  
**Status:** ACTIVE AND PERMANENT  
**Applies To:** ALL Frontend, Backend, CMS & Dashboard Systems

---

## 🚫 PHASE 0 — FROZEN COMPONENTS (MANDATORY)

### Absolutely NO modifications allowed to:

#### Frontend Structure
- ❌ UI components (existing)
- ❌ Page layouts (all pages)
- ❌ Navigation structure
- ❌ Sidebar structure
- ❌ Student dashboard structure
- ❌ Admin CMS structure
- ❌ Component props (existing)
- ❌ Routing logic (existing routes)

#### Design System
- ❌ CSS variables
- ❌ Base theme tokens
- ❌ Color palette
- ❌ Typography scale
- ❌ Spacing scale

#### Backend
- ❌ API response shapes (existing endpoints)
- ❌ Database schema (existing collections)
- ❌ Endpoint shapes (existing)

**Exception:** Bug fixes only, with explicit documentation.

---

## 🧊 PHASE 1 — DESIGN SYSTEM (PERMANENT TOKENS)

### Colors (FROZEN)
```
Primary:        #10614E
Primary Dark:   #0A4638
Light Gray BG:  #F5F7F8
Border Gray:    #E2E5E7
Text Dark:      #1A1A1A
Warning:        #FF7A1A
Info:           #2A7FE1
Success:        #0B8A68
```

### Typography (FROZEN)
```
Font Family:    Inter
Title Weight:   600
Label Weight:   500
Body Weight:    400
```

### Spacing Grid (FROZEN)
```
Scale: 8px, 16px, 24px, 32px, 40px, 48px
```

### Border Radius (FROZEN)
```
Global: 6px
```

### Shadow System (FROZEN)
```
Card Shadow: 0px 1px 3px rgba(0,0,0,0.07)
```

**NO DEVIATIONS ALLOWED**

---

## 🧊 PHASE 2 — FRONTEND FREEZE (Student Portal)

### LOCKED Pages:
- ✅ Login (`/login`)
- ✅ Signup (`/signup`)
- ✅ Staff Login (`/staff-login`)
- ✅ Intake Flow (`/onboarding` - all 3 steps)
- ✅ Student Dashboard (`/dashboard`)
- ✅ Sidebar (identity block + navigation)
- ✅ Profile Page (`/account/profile`)
- ✅ Settings Page (`/account/settings`)

### LOCKED Components:
- ✅ Metrics Cards (Profile Strength, Major Fit Score, Scholarship Fit, College Interest)
- ✅ Signals Component (Feed with TODAY/THIS WEEK sections)
- ✅ Application Tracker
- ✅ Next Best Actions
- ✅ Announcement Bar (rendering logic)
- ✅ Header (TopExperienceLayer)
- ✅ Search Overlay
- ✅ Mega Menus

**No structural changes allowed without explicit user instruction.**

---

## 🧊 PHASE 3 — ADMIN CMS FREEZE

### LOCKED Admin Modules:
- ✅ Admin Dashboard (`/admin`)
- ✅ Announcement Bar CMS (`/admin/announcement-bar`)
- ✅ Colleges Manager (`/admin/colleges`)
- ✅ Scholarships Manager (`/admin/scholarships`)
- ✅ Articles Manager (`/admin/articles`)
- ✅ Analytics (`/admin/analytics`)

### LOCKED CMS Structure:
- ✅ CMS Routing (AdminLayout structure)
- ✅ CMS Forms (all existing forms)
- ✅ CMS Tables (all existing tables)
- ✅ CMS Header Bar
- ✅ CMS Sidebar Navigation

**Only bug fixes allowed. NO feature additions or modifications.**

---

## 🧊 PHASE 4 — API & SCHEMA FREEZE

### FROZEN API Shapes:

#### /api/auth/me
```json
{
  "id": "string",
  "email": "string",
  "role": "string",
  "onboarding_completed": "boolean",
  "first_name": "string",
  "last_name": "string",
  "created_at": "datetime"
}
```

#### /api/announcement/* endpoints
```json
{
  "id": "string",
  "title": "string",
  "body": "string",
  "color": "green|yellow|red|blue",
  "link_url": "string|null",
  "start_date": "datetime",
  "end_date": "datetime",
  "status": "active|archived",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### FROZEN Endpoint Groups:
- ❌ /api/students/* (no shape changes)
- ❌ /api/colleges/* (no shape changes)
- ❌ /api/scholarships/* (no shape changes)
- ❌ /api/articles/* (no shape changes)
- ❌ /api/auth/* (no shape changes)

### Database Schema (FROZEN)
- ❌ `users` collection fields
- ❌ `colleges` collection fields
- ❌ `scholarships` collection fields
- ❌ `articles` collection fields
- ❌ `announcement_bars` collection fields

**Only add NEW endpoints. DO NOT modify existing ones.**

---

## 🧊 PHASE 5 — PERMISSIONS FREEZE

### System Roles (PERMANENT):
```
- admin
- superadmin
- cmsadmin
- staff
- student
```

### Role Abilities (FROZEN):
- **admin/superadmin:** Full CMS access, user management, content management
- **cmsadmin:** Content management only (articles, announcements)
- **staff:** Read-only access to admin portal
- **student:** Student-facing features only

**Role changes require explicit user approval.**

---

## 🧊 PHASE 6 — DEPLOYMENT VERIFICATION RULES

### Before completing ANY task, verify:

#### UI Integrity Checks:
- ✅ No UI drift from frozen design system
- ✅ No color drift (all colors match frozen palette)
- ✅ No unexpected layout updates
- ✅ Typography consistent with frozen scale
- ✅ Spacing adheres to 8px grid

#### Technical Integrity Checks:
- ✅ No schema changes to existing collections
- ✅ No endpoint shape mutations
- ✅ No new console errors
- ✅ No auth redirect loops
- ✅ No broken navigation links

#### Functional Integrity Checks:
- ✅ No CMS regressions (all admin features work)
- ✅ No student dashboard regressions (all student features work)
- ✅ No announcement bar regressions
- ✅ All existing API endpoints respond correctly

### If ANY drift detected:
1. **STOP immediately**
2. **REVERT all changes**
3. **Document the issue**
4. **Request user guidance**

---

## 📋 ALLOWED CHANGES (EXPLICIT ONLY)

### ✅ ALLOWED without permission:
- Bug fixes (with documentation)
- Performance optimizations (backend only, no UI changes)
- Security patches
- Error message improvements (no UI changes)

### ⚠️ REQUIRES USER PERMISSION:
- New features
- New pages
- New components
- New API endpoints (even if adding to frozen groups)
- Design system additions (new colors, fonts, etc.)
- Role/permission changes
- Database schema additions
- UI/UX improvements
- Layout modifications

### ❌ NEVER ALLOWED:
- Modifying frozen design tokens
- Changing existing component structure
- Altering API response shapes
- Modifying database schema of existing collections
- Changing routing logic without permission
- Updating navigation structure without permission

---

## 🔍 VERIFICATION PROTOCOL

### Before Task Completion:

1. **Visual Review:**
   - Screenshot comparison with frozen reference
   - Color picker verification
   - Layout measurement check

2. **Code Review:**
   - No modifications to frozen files
   - No changes to design tokens
   - No API shape changes

3. **Functional Testing:**
   - All existing features work
   - No new console errors
   - Auth flows intact
   - Navigation functional

4. **Documentation:**
   - Changes documented
   - Justification provided
   - User approval noted (if applicable)

### Violation Response:
If freeze violation detected:
1. Immediate rollback
2. Document violation
3. Notify user
4. Request explicit guidance

---

## 📁 REFERENCE FILES

**Frozen Design System:**
- Colors: See Phase 1
- Typography: Inter font, weights 400/500/600
- Spacing: 8px grid
- Shadows: 0px 1px 3px rgba(0,0,0,0.07)

**Frozen Pages:**
- Frontend: See Phase 2
- Admin CMS: See Phase 3

**Frozen APIs:**
- Shapes: See Phase 4
- Roles: See Phase 5

---

## 🚨 CRITICAL REMINDERS

1. **This freeze is PERMANENT until explicitly lifted by user**
2. **NO assumptions allowed - always ask if uncertain**
3. **Bug fixes must maintain existing behavior and appearance**
4. **New features require complete user specification**
5. **Testing is mandatory before task completion**
6. **Documentation required for all changes**

---

**FREEZE ACTIVE**  
**Compliance: MANDATORY**  
**Exceptions: User approval only**

**Agent Acknowledgment:** ✅ Confirmed  
**Date Acknowledged:** November 28, 2025
