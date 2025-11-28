# StudentSignal Role System - Simple (User/Admin)

## ✅ Current Role Structure

### Two Roles Only:

**1. User (Students)**
- Role value: `"user"`
- Created via: `/signup` page
- Access: Student features only
- Routes: `/signal-hub`, `/colleges`, `/scholarships`, etc.
- Cannot access: `/admin/*` routes

**2. Admin (All Staff)**
- Role value: `"admin"`
- Created via: Manual database script
- Access: Full admin privileges
- Routes: `/admin/dashboard`, `/admin/*`
- Cannot access: Student onboarding

---

## 🔒 Access Control

### Backend (models.py)
```python
class User(BaseDBModel):
    role: str = "user"  # user/admin
```

### Route Protection
All admin routes check:
```python
if not user or user.get('role') != 'admin':
    raise HTTPException(status_code=403)
```

### Frontend Protection
- **AdminLayout**: Redirects non-admins to Signal Hub
- **StaffLogin**: Only accepts role='admin'
- **OnboardingFlow**: Redirects admins to dashboard

---

## 👥 Current Admin Accounts

**Test Admin:**
- Email: `elon_test@example.com`
- Password: `test123`
- Role: `admin`

---

## ➕ Adding New Admin Users

### Method 1: Python Script
```bash
cd /app/backend
python3 create_staff_user.py
```

### Method 2: Direct MongoDB
```python
{
    'email': 'newadmin@studentsignal.com',
    'password_hash': hash('password'),
    'role': 'admin',  # KEY FIELD
    'onboarding_completed': True
}
```

---

## 🎯 Admin Capabilities

All admins have FULL access to:
- ✅ Dashboard
- ✅ Manage Colleges
- ✅ Manage Users
- ✅ Manage Content
- ✅ Manage Media
- ✅ Settings
- ✅ All admin features

**No permission levels** - All admins are equal

---

## 🚀 Future Expansion (If Needed)

When you need role hierarchy:
1. Add `superadmin` role for system owners
2. Add `staff` role for limited access
3. Add `permissions` field for granular control

For now: **Keep it simple with User/Admin** ✅

---

## 📋 Summary

**Current System:**
- 2 roles only: `user` and `admin`
- Students = user
- All staff = admin (equal privileges)
- Clean separation of access
- No complex permission system

**Status:** ✅ WORKING AND SIMPLE
