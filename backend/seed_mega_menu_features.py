"""
Seed script for mega menu feature tiles
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime
from uuid import uuid4

async def seed_mega_menu_features():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'student_signal')]
    
    mega_menu_features_collection = db.mega_menu_features
    
    # Sample features for each menu
    features = [
        {
            "id": str(uuid4()),
            "menu_key": "student_pathways",
            "label": "FEATURED",
            "title": "Transfer Student Success Guide",
            "subtitle": "Everything you need to know about transferring colleges, from credit transfers to application tips.",
            "cta_text": "Read the Guide",
            "cta_url": "/articles",
            "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid4()),
            "menu_key": "resources",
            "label": "NEW REPORT",
            "title": "2025 Financial Aid & Scholarship Trends",
            "subtitle": "Discover the latest insights on financial aid opportunities and how to maximize your scholarship potential.",
            "cta_text": "Download Report",
            "cta_url": "/articles",
            "image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Clear existing data
    await mega_menu_features_collection.delete_many({})
    
    # Insert new data
    if features:
        await mega_menu_features_collection.insert_many(features)
        print(f"✅ Inserted {len(features)} mega menu features")
    
    print("✅ Mega menu features seeding complete!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_mega_menu_features())
