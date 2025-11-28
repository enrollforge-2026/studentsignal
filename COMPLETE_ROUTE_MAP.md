# 🗺️ COMPLETE ROUTE MAP - StudentSignal

**Generated:** November 28, 2025  
**Status:** AUDIT COMPLETE

---

## 📋 CURRENT ROUTES (From App.js)

### Public Routes
```
/                           → HomePage (✅ EXISTS)
/signup                     → SignupPage (✅ EXISTS)
/login                      → LoginPage (✅ EXISTS)
/staff-login                → StaffLogin (✅ EXISTS)
/onboarding                 → OnboardingFlow (✅ EXISTS)
```

### Public Content Routes
```
/colleges                   → CollegesPage (✅ EXISTS)
/college/:id                → CollegeDetailPage (✅ EXISTS)
/scholarships               → ScholarshipsPage (✅ EXISTS)
/articles                   → ArticlesHub (✅ EXISTS)
/articles/:slug             → ArticleDetail (✅ EXISTS)
```

### Public Info Routes
```
/how-it-works               → HowItWorks (✅ EXISTS)
/privacy                    → PrivacyBasics (✅ EXISTS)
/for-schools                → ForSchools (✅ EXISTS)
```

### Student Pathway Routes
```
/online-colleges            → OnlineColleges (✅ EXISTS)
/military-programs          → MilitaryPrograms (✅ EXISTS)
/international-students     → InternationalStudents (✅ EXISTS)
/transfer-students          → TransferStudents (✅ EXISTS)
```

### Tools & Resources (Placeholders)
```
/career-finder              → HomePage (⚠️ PLACEHOLDER)
/direct-admissions          → HomePage (⚠️ PLACEHOLDER)
/school-match-quiz          → HomePage (⚠️ PLACEHOLDER)
/rankings                   → ArticlesHub (⚠️ PLACEHOLDER)
/financial-aid              → ArticlesHub (⚠️ PLACEHOLDER)
/test-alternatives          → ArticlesHub (⚠️ PLACEHOLDER)
/application-tips           → ArticlesHub (⚠️ PLACEHOLDER)
/student-stories            → ArticlesHub (⚠️ PLACEHOLDER)
```

### Student Dashboard Routes (NO AuthenticatedLayout wrapper)
```
/dashboard                  → Dashboard (✅ EXISTS - but NOT wrapped in auth layout)
/signal-hub                 → SignalHub (✅ EXISTS)
/profile                    → ProfilePage (✅ EXISTS)
```

### Admin Routes (Protected by AdminLayout)
```
/admin                      → AdminDashboard (✅ EXISTS)
/admin/announcement-bar     → AnnouncementBarCMS (✅ EXISTS)
/admin/analytics            → Analytics (✅ EXISTS)
/admin/colleges             → CollegesList (✅ EXISTS)
/admin/colleges/new         → CollegeForm (✅ EXISTS)
/admin/colleges/:id/edit    → CollegeForm (✅ EXISTS)
/admin/scholarships         → ScholarshipsList (✅ EXISTS)
/admin/scholarships/new     → ScholarshipForm (✅ EXISTS)
/admin/scholarships/:id/edit→ ScholarshipForm (✅ EXISTS)
/admin/articles             → ArticlesList (✅ EXISTS)
/admin/articles/new         → ArticleForm (✅ EXISTS)
/admin/articles/:id/edit    → ArticleForm (✅ EXISTS)
```

---

## 🚨 MISSING ROUTES (Clicked from Sidebar)

### ACCOUNT Section
```
❌ /account/profile         → Profile page (Sidebar links to this)
❌ /account/settings        → Settings page
❌ /account/documents       → Documents vault
```

### EXPLORE Section
```
❌ /explore/colleges        → College search (different from /colleges)
❌ /explore/scholarships    → Scholarship search (different from /scholarships)
❌ /explore/majors          → Major explorer
```

### PLAN Section
```
❌ /plan/applications       → Application tracker
❌ /plan/deadlines          → Deadline calendar
❌ /plan/tasks              → Tasks & essays manager
```

### TOOLS Section
```
❌ /tools/coach             → AI coach chat
❌ /tools/cost              → Cost calculator
❌ /tools/compare           → College comparison tool
```

---

## 🔧 STRUCTURAL ISSUES

### Issue 1: Dashboard Routes Not Wrapped in AuthenticatedLayout
**Problem:** `/dashboard`, `/profile`, `/signal-hub` render without Sidebar
**Impact:** Students see dashboard but NO sidebar navigation
**Fix Required:** Wrap these routes in `<AuthenticatedLayout />` wrapper

### Issue 2: Duplicate Routes
**Problem:** 
- `/colleges` (public) vs `/explore/colleges` (sidebar)
- `/scholarships` (public) vs `/explore/scholarships` (sidebar)
**Fix Required:** Decide which to use or redirect one to the other

### Issue 3: Profile Identity Link Broken
**Problem:** Sidebar identity block links to `/account/profile`
**Status:** Route doesn't exist
**Fix Required:** Create `/account/profile` page

---

## ✅ REQUIRED NEW PAGES

### Priority 1 (Sidebar Links):
1. `/account/profile` - Student profile page
2. `/account/settings` - Settings page
3. `/account/documents` - Document vault
4. `/explore/colleges` - College search (or redirect to /colleges)
5. `/explore/scholarships` - Scholarship search (or redirect to /scholarships)
6. `/explore/majors` - Major explorer
7. `/plan/applications` - Application tracker
8. `/plan/deadlines` - Deadline calendar
9. `/plan/tasks` - Tasks & essays
10. `/tools/coach` - AI coach
11. `/tools/cost` - Cost calculator
12. `/tools/compare` - College comparison

### Priority 2 (Dashboard Actions):
- Any button actions that link to missing pages

---

## 📦 FILES TO ARCHIVE

### Old/Unused Pages:
(Need to scan for old components not in current route map)

Potential candidates:
- Old dashboard layouts (pre-enterprise)
- Old header components (pre-TopExperienceLayer)
- Prototype pages
- Old onboarding flows

**Location for archived files:** `/app/frontend/src/archive/legacy/`

---

## 🔐 ROUTE GUARDS STATUS

### Current Implementation:
- ✅ Admin routes protected by `AdminLayout` (checks role = admin/superadmin)
- ❌ Student dashboard routes NOT protected (no AuthenticatedLayout wrapper)
- ❌ No distinction between public vs authenticated student routes

### Required Guards:
1. Student dashboard routes → require authentication
2. Account pages → require authentication
3. Explore/Plan/Tools → require authentication (decision needed)
4. Public content → no auth required

---

## 🎯 RECOMMENDED ROUTE STRUCTURE

### Authenticated Student Routes (wrap in AuthenticatedLayout):
```
<Route element={<AuthenticatedLayout />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/account/profile" element={<AccountProfile />} />
  <Route path="/account/settings" element={<AccountSettings />} />
  <Route path="/account/documents" element={<DocumentsVault />} />
  <Route path="/explore/colleges" element={<ExploreColleges />} />
  <Route path="/explore/scholarships" element={<ExploreScholarships />} />
  <Route path="/explore/majors" element={<ExploreMajors />} />
  <Route path="/plan/applications" element={<ApplicationTracker />} />
  <Route path="/plan/deadlines" element={<DeadlineCalendar />} />
  <Route path="/plan/tasks" element={<TasksEssays />} />
  <Route path="/tools/coach" element={<AICoach />} />
  <Route path="/tools/cost" element={<CostCalculator />} />
  <Route path="/tools/compare" element={<CompareColleges />} />
</Route>
```

---

## 📊 SUMMARY STATISTICS

**Total Routes Defined:** 38
**Working Routes:** 26
**Missing Routes:** 12
**Placeholder Routes:** 8
**Admin Routes:** 12 (all working)
**Structural Issues:** 3

**Critical Priority:** Create 12 missing student pages and fix AuthenticatedLayout routing

---

**Next Steps:**
1. Create all 12 missing pages (can be placeholders)
2. Fix AuthenticatedLayout routing structure
3. Archive old/unused pages
4. Verify all buttons connect to valid routes
5. Test route guards for all role types
