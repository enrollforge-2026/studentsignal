"""
Seed script for institutions and high schools reference data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
from uuid import uuid4

async def seed_reference_data():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'student_signal')]
    
    institutions_collection = db.institutions
    high_schools_collection = db.high_schools
    
    # Sample Institutions (based on existing colleges)
    institutions = [
        {
            "id": str(uuid4()),
            "name": "Stanford University",
            "city": "Stanford",
            "state": "CA",
            "level": "4-year",
            "control": "Private nonprofit",
            "website_url": "https://www.stanford.edu",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Massachusetts Institute of Technology",
            "city": "Cambridge",
            "state": "MA",
            "level": "4-year",
            "control": "Private nonprofit",
            "website_url": "https://www.mit.edu",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "University of California, Berkeley",
            "city": "Berkeley",
            "state": "CA",
            "level": "4-year",
            "control": "Public",
            "website_url": "https://www.berkeley.edu",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Harvard University",
            "city": "Cambridge",
            "state": "MA",
            "level": "4-year",
            "control": "Private nonprofit",
            "website_url": "https://www.harvard.edu",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Emory University",
            "city": "Atlanta",
            "state": "GA",
            "level": "4-year",
            "control": "Private nonprofit",
            "website_url": "https://www.emory.edu",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Sample High Schools
    high_schools = [
        {
            "id": str(uuid4()),
            "name": "Palo Alto High School",
            "district": "Palo Alto Unified",
            "city": "Palo Alto",
            "state": "CA",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Lincoln High School",
            "district": "San Francisco Unified",
            "city": "San Francisco",
            "state": "CA",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Stuyvesant High School",
            "district": "New York City DOE",
            "city": "New York",
            "state": "NY",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Boston Latin School",
            "district": "Boston Public Schools",
            "city": "Boston",
            "state": "MA",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "name": "Thomas Jefferson High School for Science and Technology",
            "district": "Fairfax County",
            "city": "Alexandria",
            "state": "VA",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Clear existing data
    await institutions_collection.delete_many({})
    await high_schools_collection.delete_many({})
    
    # Insert new data
    if institutions:
        await institutions_collection.insert_many(institutions)
        print(f"✅ Inserted {len(institutions)} institutions")
    
    if high_schools:
        await high_schools_collection.insert_many(high_schools)
        print(f"✅ Inserted {len(high_schools)} high schools")
    
    print("✅ Reference data seeding complete!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_reference_data())
