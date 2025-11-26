from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
from datetime import datetime
import uuid


# Sample colleges data (from mockData.js)
SAMPLE_COLLEGES = [
    {
        "id": str(uuid.uuid4()),
        "name": "Harvard University",
        "short_name": "Harvard",
        "location": "Cambridge, MA",
        "state": "MA",
        "type": "Private",
        "enrollment": 23000,
        "acceptance_rate": 3.4,
        "tuition_in_state": 51904,
        "tuition_out_state": 51904,
        "sat_range": "1460-1580",
        "act_range": "33-35",
        "graduation_rate": 98.0,
        "ranking": 1,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
        "description": "Harvard University is a private Ivy League research university in Cambridge, Massachusetts.",
        "direct_admission": False,
        "majors": ["Computer Science", "Business", "Engineering", "Biology", "Psychology"],
        "features": ["Research University", "Ivy League", "World-Class Faculty"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Stanford University",
        "short_name": "Stanford",
        "location": "Stanford, CA",
        "state": "CA",
        "type": "Private",
        "enrollment": 17000,
        "acceptance_rate": 3.9,
        "tuition_in_state": 56169,
        "tuition_out_state": 56169,
        "sat_range": "1440-1570",
        "act_range": "32-35",
        "graduation_rate": 94.0,
        "ranking": 2,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
        "description": "Stanford University is a private research university in Stanford, California.",
        "direct_admission": True,
        "majors": ["Computer Science", "Engineering", "Business", "Mathematics", "Biology"],
        "features": ["Silicon Valley", "Innovation Hub", "Top Engineering"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Massachusetts Institute of Technology",
        "short_name": "MIT",
        "location": "Cambridge, MA",
        "state": "MA",
        "type": "Private",
        "enrollment": 11500,
        "acceptance_rate": 4.1,
        "tuition_in_state": 53790,
        "tuition_out_state": 53790,
        "sat_range": "1500-1570",
        "act_range": "34-36",
        "graduation_rate": 95.0,
        "ranking": 3,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
        "description": "MIT is a private research university in Cambridge, Massachusetts.",
        "direct_admission": False,
        "majors": ["Computer Science", "Engineering", "Physics", "Mathematics", "Economics"],
        "features": ["STEM Excellence", "Innovation", "Research"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "University of California, Berkeley",
        "short_name": "UC Berkeley",
        "location": "Berkeley, CA",
        "state": "CA",
        "type": "Public",
        "enrollment": 42000,
        "acceptance_rate": 14.5,
        "tuition_in_state": 13401,
        "tuition_out_state": 42184,
        "sat_range": "1330-1530",
        "act_range": "30-34",
        "graduation_rate": 92.0,
        "ranking": 4,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        "description": "UC Berkeley is a public research university in Berkeley, California.",
        "direct_admission": True,
        "majors": ["Engineering", "Computer Science", "Business", "Biology", "Economics"],
        "features": ["Public Ivy", "Research Excellence", "Bay Area"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "University of Michigan",
        "short_name": "Michigan",
        "location": "Ann Arbor, MI",
        "state": "MI",
        "type": "Public",
        "enrollment": 46000,
        "acceptance_rate": 20.0,
        "tuition_in_state": 15262,
        "tuition_out_state": 51200,
        "sat_range": "1330-1500",
        "act_range": "30-34",
        "graduation_rate": 91.0,
        "ranking": 5,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
        "description": "The University of Michigan is a public research university in Ann Arbor, Michigan.",
        "direct_admission": True,
        "majors": ["Engineering", "Business", "Computer Science", "Medicine", "Law"],
        "features": ["Big Ten", "Research Excellence", "Strong Alumni Network"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Yale University",
        "short_name": "Yale",
        "location": "New Haven, CT",
        "state": "CT",
        "type": "Private",
        "enrollment": 13600,
        "acceptance_rate": 4.6,
        "tuition_in_state": 59950,
        "tuition_out_state": 59950,
        "sat_range": "1460-1580",
        "act_range": "33-35",
        "graduation_rate": 97.0,
        "ranking": 6,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
        "description": "Yale University is a private Ivy League research university in New Haven, Connecticut.",
        "direct_admission": False,
        "majors": ["Political Science", "Economics", "History", "Biology", "Psychology"],
        "features": ["Ivy League", "Liberal Arts Excellence", "Historic Campus"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Princeton University",
        "short_name": "Princeton",
        "location": "Princeton, NJ",
        "state": "NJ",
        "type": "Private",
        "enrollment": 8500,
        "acceptance_rate": 4.4,
        "tuition_in_state": 56010,
        "tuition_out_state": 56010,
        "sat_range": "1470-1570",
        "act_range": "33-35",
        "graduation_rate": 97.0,
        "ranking": 7,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800",
        "description": "Princeton University is a private Ivy League research university in Princeton, New Jersey.",
        "direct_admission": False,
        "majors": ["Economics", "Computer Science", "Engineering", "Mathematics", "Politics"],
        "features": ["Ivy League", "Undergraduate Focus", "Beautiful Campus"]
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Columbia University",
        "short_name": "Columbia",
        "location": "New York, NY",
        "state": "NY",
        "type": "Private",
        "enrollment": 31000,
        "acceptance_rate": 3.7,
        "tuition_in_state": 63530,
        "tuition_out_state": 63530,
        "sat_range": "1450-1560",
        "act_range": "33-35",
        "graduation_rate": 96.0,
        "ranking": 8,
        "rating": "A+",
        "image": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800",
        "description": "Columbia University is a private Ivy League research university in New York City.",
        "direct_admission": False,
        "majors": ["Engineering", "Business", "Political Science", "Economics", "English"],
        "features": ["Ivy League", "NYC Location", "Core Curriculum"]
    }
]


# Sample scholarships data
SAMPLE_SCHOLARSHIPS = [
    {
        "id": str(uuid.uuid4()),
        "name": "National Merit Scholarship",
        "amount": "Up to $2,500",
        "deadline": "October 15, 2025",
        "type": "Merit-Based",
        "category": "Academic Excellence",
        "description": "Awarded to top-performing students based on PSAT/NMSQT scores.",
        "eligibility": ["High school seniors", "U.S. citizens", "Top PSAT scores"],
        "renewable": True,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Coca-Cola Scholars Program",
        "amount": "$20,000",
        "deadline": "October 31, 2025",
        "type": "Merit-Based",
        "category": "Leadership",
        "description": "Recognizes students who demonstrate leadership, service, and academic achievement.",
        "eligibility": ["High school seniors", "Minimum 3.0 GPA", "Leadership experience"],
        "renewable": False,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Gates Scholarship",
        "amount": "Full Cost of Attendance",
        "deadline": "September 15, 2025",
        "type": "Need-Based",
        "category": "Minority Students",
        "description": "Covers the full cost of attendance for exceptional minority students with financial need.",
        "eligibility": ["High school seniors", "Pell Grant eligible", "Minority students"],
        "renewable": True,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "STEM Excellence Scholarship",
        "amount": "$5,000",
        "deadline": "January 15, 2026",
        "type": "Merit-Based",
        "category": "STEM",
        "description": "For students pursuing degrees in Science, Technology, Engineering, or Mathematics.",
        "eligibility": ["College students", "STEM major", "Minimum 3.5 GPA"],
        "renewable": True,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "First Generation College Scholarship",
        "amount": "$10,000",
        "deadline": "December 1, 2025",
        "type": "Need-Based",
        "category": "First Generation",
        "description": "Supporting first-generation college students in their educational journey.",
        "eligibility": ["First-generation college students", "Financial need", "Minimum 2.5 GPA"],
        "renewable": True,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Athletic Excellence Scholarship",
        "amount": "$15,000",
        "deadline": "November 30, 2025",
        "type": "Athletic",
        "category": "Sports",
        "description": "For student-athletes demonstrating excellence in their sport and academics.",
        "eligibility": ["High school seniors", "Varsity athlete", "Minimum 3.0 GPA"],
        "renewable": True,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Women in Technology Scholarship",
        "amount": "$7,500",
        "deadline": "February 28, 2026",
        "type": "Merit-Based",
        "category": "Women in STEM",
        "description": "Encouraging women to pursue careers in technology and computer science.",
        "eligibility": ["Female students", "Technology or CS major", "Minimum 3.0 GPA"],
        "renewable": False,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Community Service Leadership Award",
        "amount": "$3,000",
        "deadline": "March 31, 2026",
        "type": "Merit-Based",
        "category": "Community Service",
        "description": "Recognizes students with outstanding community service contributions.",
        "eligibility": ["College students", "100+ volunteer hours", "Leadership roles"],
        "renewable": False,
        "application_required": True,
        "image": "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"
    }
]


async def seed_database():
    """Seed the database with sample data"""
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'student_signal')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Starting database seeding...")
    
    # Clear existing data
    await db.colleges.delete_many({})
    await db.scholarships.delete_many({})
    print("Cleared existing data")
    
    # Add timestamps to all records
    now = datetime.utcnow().isoformat()
    
    # Seed colleges
    for college in SAMPLE_COLLEGES:
        college['created_at'] = now
        college['updated_at'] = now
    
    result = await db.colleges.insert_many(SAMPLE_COLLEGES)
    print(f"Inserted {len(result.inserted_ids)} colleges")
    
    # Seed scholarships
    for scholarship in SAMPLE_SCHOLARSHIPS:
        scholarship['created_at'] = now
        scholarship['updated_at'] = now
    
    result = await db.scholarships.insert_many(SAMPLE_SCHOLARSHIPS)
    print(f"Inserted {len(result.inserted_ids)} scholarships")
    
    # Create indexes
    await db.colleges.create_index("id", unique=True)
    await db.scholarships.create_index("id", unique=True)
    await db.users.create_index("email", unique=True)
    print("Created indexes")
    
    print("Database seeding completed successfully!")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
