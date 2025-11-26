# Admin CMS Test Script

## Prerequisites

1. **Promote your user to admin role:**

```bash
mongosh mongodb://localhost:27017/student_signal --eval '
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)'
```

Replace `your-email@example.com` with your actual email.

**Or use the test account already promoted:**
- Email: `elon_test@example.com`
- Password: `test123`

## Test 1: Admin Dashboard Access

1. **Login** to the application at `/login`
2. **Navigate** to `/admin`
   - **Expected:** Admin dashboard with stats cards (Colleges, Scholarships, Users, Leads)
   - **Expected:** Sidebar navigation with Dashboard, Colleges, Scholarships links
   - **Expected:** "Admin Panel" label in header
   - **Expected:** "View Site" and "Logout" buttons in header

## Test 2: Colleges Management

### View Colleges List
1. **Click** "Colleges" in sidebar or navigate to `/admin/colleges`
   - **Expected:** Table showing all colleges with Name, Location, Type, Acceptance Rate
   - **Expected:** Search bar at top
   - **Expected:** "Add New College" button (green)
   - **Expected:** Edit/Delete actions for each college

### Create New College
1. **Click** "Add New College" button
2. **Fill** the form with test data:
   - Name: `Test University`
   - Short Name: `Test U`
   - Location: `Test City, TS`
   - State: `TS`
   - Type: `Public` or `Private`
   - Enrollment: `20000`
   - Acceptance Rate: `50.5`
   - Tuition In-State: `15000`
   - Tuition Out-of-State: `35000`
   - SAT Range: `1200-1400`
   - ACT Range: `25-30`
   - Graduation Rate: `85.0`
   - Description: `A test university for testing purposes`
   - Majors: `Computer Science, Business, Engineering`
   - Features: `Research opportunities, Study abroad`
3. **Click** "Create College"
   - **Expected:** Redirect to colleges list
   - **Expected:** New college appears in the table

### Edit College
1. **Click** Edit icon (pencil) on any college
2. **Modify** some fields (e.g., change acceptance rate)
3. **Click** "Update College"
   - **Expected:** Redirect to colleges list
   - **Expected:** Changes are reflected

### Delete College
1. **Click** Delete icon (trash) on the test college
2. **Confirm** deletion in modal
   - **Expected:** College removed from list

## Test 3: Scholarships Management

### View Scholarships List
1. **Click** "Scholarships" in sidebar or navigate to `/admin/scholarships`
   - **Expected:** Table showing all scholarships with Name, Amount, Type, Deadline
   - **Expected:** Search bar at top
   - **Expected:** "Add New Scholarship" button (orange)
   - **Expected:** Edit/Delete actions for each scholarship

### Create New Scholarship
1. **Click** "Add New Scholarship" button
2. **Fill** the form with test data:
   - Name: `Test Scholarship`
   - Amount: `$5,000`
   - Deadline: `December 31, 2025`
   - Type: `Merit-Based`
   - Category: `General`
   - Description: `A test scholarship for testing purposes`
   - Eligibility: `GPA 3.0+, US Citizen, Full-time student`
   - Check "Renewable" if desired
   - Check "Application Required"
3. **Click** "Create Scholarship"
   - **Expected:** Redirect to scholarships list
   - **Expected:** New scholarship appears in the table

### Edit Scholarship
1. **Click** Edit icon (pencil) on any scholarship
2. **Modify** some fields (e.g., change amount)
3. **Click** "Update Scholarship"
   - **Expected:** Redirect to scholarships list
   - **Expected:** Changes are reflected

### Delete Scholarship
1. **Click** Delete icon (trash) on the test scholarship
2. **Confirm** deletion in modal
   - **Expected:** Scholarship removed from list

## Test 4: Search Functionality

### Search Colleges
1. **Navigate** to `/admin/colleges`
2. **Type** in search bar (e.g., "Stanford")
   - **Expected:** Table filters to show only matching colleges

### Search Scholarships
1. **Navigate** to `/admin/scholarships`
2. **Type** in search bar (e.g., "Merit")
   - **Expected:** Table filters to show only matching scholarships

## Test 5: Non-Admin Access (Security)

1. **Logout** from admin account
2. **Login** with a regular user account (or create one)
3. **Try** to access `/admin`
   - **Expected:** Redirect to `/login` (not authorized)

## Test 6: Form Validation

### College Form
1. **Navigate** to `/admin/colleges/new`
2. **Leave required fields** empty (Name, Short Name, Location, State)
3. **Try** to submit
   - **Expected:** Browser validation prevents submission

### Scholarship Form
1. **Navigate** to `/admin/scholarships/new`
2. **Leave required fields** empty (Name, Amount, Deadline, Type, Category, Description)
3. **Try** to submit
   - **Expected:** Browser validation prevents submission

## Test 7: Data Persistence

1. **Create** a new college
2. **Refresh** the page
   - **Expected:** College still appears in the list
3. **Navigate** to the public colleges page (`/colleges`)
   - **Expected:** New college appears there too

## Backend API Testing (Optional)

### Test Admin Endpoints with curl

```bash
# Login and get token
REACT_APP_BACKEND_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

TOKEN=$(curl -s -X POST "$REACT_APP_BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"elon_test@example.com","password":"test123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token: ${TOKEN:0:30}..."

# Test: Create College
echo -e "\n=== Test: Create College ==="
curl -s -X POST "$REACT_APP_BACKEND_URL/api/admin/colleges" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "API Test University",
    "short_name": "API Test",
    "location": "Test City, TC",
    "state": "TC",
    "type": "Public",
    "enrollment": 15000,
    "acceptance_rate": 45.0,
    "tuition_in_state": 12000,
    "tuition_out_state": 30000,
    "sat_range": "1100-1300",
    "act_range": "23-28",
    "graduation_rate": 80.0,
    "ranking": null,
    "rating": "B+",
    "image": "https://example.com/image.jpg",
    "description": "Created via API test",
    "direct_admission": false,
    "majors": ["Computer Science"],
    "features": ["Campus life"]
  }' | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'Created: {data[\"name\"]} (ID: {data[\"id\"]})')"

# Test: Create Scholarship  
echo -e "\n=== Test: Create Scholarship ==="
curl -s -X POST "$REACT_APP_BACKEND_URL/api/admin/scholarships" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "API Test Scholarship",
    "amount": "$3,000",
    "deadline": "March 1, 2026",
    "type": "Merit-Based",
    "category": "General",
    "description": "Created via API test",
    "eligibility": ["GPA 3.5+", "US Citizen"],
    "renewable": true,
    "application_required": true,
    "image": null
  }' | python3 -c "import sys,json; data=json.load(sys.stdin); print(f'Created: {data[\"name\"]} (ID: {data[\"id\"]})')"
```

## Success Criteria

✅ **All tests pass:**
- Can access admin dashboard with admin role
- Can view, create, edit, and delete colleges
- Can view, create, edit, and delete scholarships
- Search functionality works
- Non-admin users cannot access admin area
- Form validation prevents invalid submissions
- Data persists after page refresh
- Changes reflect on public pages

## Known Limitations

- **No user management UI** (as per scope)
- **No analytics dashboard** (as per scope)
- **Hard delete only** (no soft delete/archive)
- **URL input only for images** (no file upload)

---

**Test completed successfully?** Report any issues with steps to reproduce! 🚀
