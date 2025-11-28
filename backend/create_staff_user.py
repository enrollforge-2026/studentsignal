"""
Script to create staff/admin users for StudentSignal
Run this to add admin accounts that can access /staff-login
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import uuid
from datetime import datetime
import os

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

async def create_staff_user(email, password, first_name, last_name):
    # Get MongoDB URL and DB name from environment or use defaults
    mongo_url = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.getenv('DB_NAME', 'student_signal')
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    users_collection = db['users']
    
    # Check if user already exists
    existing = await users_collection.find_one({"email": email})
    if existing:
        print(f"❌ User with email {email} already exists")
        if existing.get('role') == 'admin':
            print(f"✅ User is already an admin")
        else:
            print(f"⚠️  User exists but role is: {existing.get('role')}")
            # Update to admin
            await users_collection.update_one(
                {"email": email},
                {"$set": {"role": "admin", "updated_at": datetime.utcnow().isoformat()}}
            )
            print(f"✅ Updated user to admin role")
        return
    
    # Create new admin user
    user_dict = {
        'id': str(uuid.uuid4()),
        'email': email,
        'password_hash': get_password_hash(password),
        'first_name': first_name,
        'last_name': last_name,
        'role': 'admin',  # THIS IS THE KEY - admin role
        'saved_colleges': [],
        'saved_scholarships': [],
        'onboarding_completed': True,  # Staff don't need onboarding
        'created_at': datetime.utcnow().isoformat(),
        'updated_at': datetime.utcnow().isoformat()
    }
    
    await users_collection.insert_one(user_dict)
    print(f"✅ Staff user created successfully!")
    print(f"   Email: {email}")
    print(f"   Role: admin")
    print(f"   Can log in at: /staff-login")
    
    client.close()

async def main():
    print("=" * 50)
    print("StudentSignal - Create Staff/Admin User")
    print("=" * 50)
    print()
    
    # Interactive mode
    email = input("Enter staff email: ").strip()
    password = input("Enter password: ").strip()
    first_name = input("Enter first name: ").strip()
    last_name = input("Enter last name: ").strip()
    
    if not all([email, password, first_name, last_name]):
        print("❌ All fields are required")
        return
    
    await create_staff_user(email, password, first_name, last_name)

if __name__ == "__main__":
    asyncio.run(main())
