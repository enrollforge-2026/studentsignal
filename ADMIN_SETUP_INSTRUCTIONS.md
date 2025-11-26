# Admin Setup Instructions

## Method 1: Promote Existing User to Admin (Recommended)

If you already have a user account, use this MongoDB command to promote yourself to admin:

```bash
# Replace 'your-email@example.com' with your actual email
mongosh mongodb://localhost:27017/student_signal --eval '
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)'
```

**Example:**
```bash
mongosh mongodb://localhost:27017/student_signal --eval '
db.users.updateOne(
  { email: "elon_test@example.com" },
  { $set: { role: "admin" } }
)'
```

## Method 2: Create New Admin User

If you want to create a fresh admin account:

### Step 1: Register via API
```bash
REACT_APP_BACKEND_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

curl -X POST "$REACT_APP_BACKEND_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@studentsignal.com",
    "password": "YourSecurePassword123!",
    "first_name": "Admin",
    "last_name": "User"
  }'
```

### Step 2: Promote to Admin
```bash
mongosh mongodb://localhost:27017/student_signal --eval '
db.users.updateOne(
  { email: "admin@studentsignal.com" },
  { $set: { role: "admin" } }
)'
```

## Verification

Check if your account has admin role:

```bash
mongosh mongodb://localhost:27017/student_signal --eval '
db.users.findOne(
  { email: "your-email@example.com" },
  { email: 1, first_name: 1, last_name: 1, role: 1, _id: 0 }
)'
```

Expected output:
```json
{
  "email": "your-email@example.com",
  "first_name": "Your",
  "last_name": "Name",
  "role": "admin"
}
```

## Testing Admin Access

Once promoted, test your admin access:

```bash
# Login and get token
REACT_APP_BACKEND_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)

TOKEN=$(curl -s -X POST "$REACT_APP_BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Test admin endpoint
curl -X GET "$REACT_APP_BACKEND_URL/api/admin/leads" \
  -H "Authorization: Bearer $TOKEN"
```

If you see leads data (or an empty array), admin access is working! ✅

---

**Next:** Once you've promoted your account to admin, you can access the admin dashboard at:
- `/admin` - Admin dashboard
- `/admin/colleges` - Manage colleges  
- `/admin/scholarships` - Manage scholarships
