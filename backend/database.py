from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'student_signal')]

# Collections
colleges_collection = db.colleges
scholarships_collection = db.scholarships
users_collection = db.users
ipeds_sync_collection = db.ipeds_sync
leads_collection = db.leads
articles_collection = db.articles


async def get_db():
    """Dependency to get database instance"""
    return db


# Helper functions
def serialize_doc(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable format"""
    if doc:
        if '_id' in doc:
            del doc['_id']
        # Convert datetime objects to ISO strings
        for key, value in doc.items():
            if isinstance(value, datetime):
                doc[key] = value.isoformat()
    return doc


def prepare_for_mongo(data: dict) -> dict:
    """Prepare data for MongoDB insertion"""
    # Convert datetime objects to ISO strings
    for key, value in data.items():
        if isinstance(value, datetime):
            data[key] = value.isoformat()
    return data


async def init_db():
    """Initialize database with indexes"""
    # Create indexes for better query performance
    await colleges_collection.create_index("id", unique=True)
    await colleges_collection.create_index("name")
    await colleges_collection.create_index("state")
    await colleges_collection.create_index("type")
    await colleges_collection.create_index("ipeds_id")
    
    await scholarships_collection.create_index("id", unique=True)
    await scholarships_collection.create_index("name")
    await scholarships_collection.create_index("category")
    
    await users_collection.create_index("id", unique=True)
    await users_collection.create_index("email", unique=True)
    
    await leads_collection.create_index("id", unique=True)
    await leads_collection.create_index("email")
    await leads_collection.create_index("college_id")
    await leads_collection.create_index("created_at")
    
    print("Database indexes created successfully")
