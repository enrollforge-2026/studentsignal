#!/usr/bin/env node

/**
 * Quick Image Assignment
 * 
 * Assigns branded fallback images to all colleges based on type
 * (Fast version for immediate deployment)
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'studentsignal';
const COLLECTION_NAME = 'colleges_ui';

// Branded Fallback Images
const FALLBACK_IMAGES = {
  'Public_4-Year': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
  'Public_2-Year': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'Public_Less than 2-Year': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  'Private_4-Year': 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  'Private_2-Year': 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
  'Private_Less than 2-Year': 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
  'Private For-Profit_4-Year': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
  'Private For-Profit_2-Year': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
  'Private For-Profit_Less than 2-Year': 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'
};

function getBrandedFallback(publicPrivate, degreeLevel) {
  const key = `${publicPrivate}_${degreeLevel}`;
  return FALLBACK_IMAGES[key] || FALLBACK_IMAGES['default'];
}

async function assignImages() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    console.log('=' .repeat(80));
    console.log('QUICK IMAGE ASSIGNMENT');
    console.log('=' .repeat(80));
    
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    const total = await collection.countDocuments({});
    console.log(`\n📊 Total colleges: ${total.toLocaleString()}`);
    
    console.log('\n⚙️  Assigning branded images...');
    
    const cursor = collection.find({});
    let processed = 0;
    
    for await (const college of cursor) {
      const imageUrl = getBrandedFallback(college.publicPrivate, college.degreeLevel);
      
      await collection.updateOne(
        { ipedsId: college.ipedsId },
        { 
          $set: { 
            imageUrl: imageUrl,
            updatedAt: new Date()
          } 
        }
      );
      
      processed++;
      if (processed % 500 === 0) {
        process.stdout.write(`\r   Progress: ${processed.toLocaleString()}/${total.toLocaleString()}`);
      }
    }
    
    console.log(`\r   Progress: ${processed.toLocaleString()}/${total.toLocaleString()}`);
    console.log('\n\n✓ Assignment complete');
    
    // Count by image type
    console.log('\n' + '=' .repeat(80));
    console.log('IMAGE DISTRIBUTION');
    console.log('=' .repeat(80));
    
    for (const [key, url] of Object.entries(FALLBACK_IMAGES)) {
      if (key === 'default') continue;
      const count = await collection.countDocuments({ imageUrl: url });
      if (count > 0) {
        console.log(`  ${key.padEnd(35)}: ${count.toLocaleString()}`);
      }
    }
    
    console.log('\n' + '=' .repeat(80));
    console.log('✅ COMPLETE');
    console.log('=' .repeat(80));
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

if (require.main === module) {
  assignImages().catch(console.error);
}

module.exports = { assignImages };
