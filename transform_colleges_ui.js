#!/usr/bin/env node

/**
 * IPEDS to UI Transformation Pipeline
 * 
 * Reads from: studentsignal.colleges (READ-ONLY)
 * Writes to: studentsignal.colleges_ui
 * 
 * Purpose: Create a flattened, UI-friendly college dataset
 */

const { MongoClient } = require('mongodb');

// Configuration
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'studentsignal';
const SOURCE_COLLECTION = 'colleges';
const TARGET_COLLECTION = 'colleges_ui';

// IPEDS Sector to Degree Level Mapping
const SECTOR_TO_DEGREE_LEVEL = {
  0: 'Administrative Unit',
  1: '4-Year',
  2: '2-Year',
  3: '4-Year',
  4: '2-Year',
  5: '4-Year',
  6: '2-Year',
  7: 'Less than 2-Year',
  8: 'Less than 2-Year',
  9: 'Less than 2-Year',
  99: 'Unknown'
};

// IPEDS Control to Public/Private Mapping
const CONTROL_TO_TYPE = {
  1: 'Public',
  2: 'Private',
  3: 'Private For-Profit',
  '-3': 'Unknown'
};

/**
 * Generate URL-friendly slug from college name
 */
function slugify(text) {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Normalize website URL
 */
function normalizeWebsite(url) {
  if (!url) return null;
  
  url = url.trim();
  
  // Add https:// if no protocol
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  
  return url || null;
}

/**
 * Calculate average from min/max range
 */
function calculateAverage(min, max) {
  if (min == null || max == null) return null;
  if (typeof min !== 'number' || typeof max !== 'number') return null;
  if (min <= 0 || max <= 0) return null;
  
  return Math.round((min + max) / 2);
}

/**
 * Convert acceptance rate from decimal to percentage
 */
function convertAcceptanceRate(rate) {
  if (rate == null) return null;
  if (typeof rate !== 'number') return null;
  if (rate < 0 || rate > 1) return null;
  
  return Math.round(rate * 100);
}

/**
 * Add two numbers, return null if either is null
 */
function safeAdd(a, b) {
  if (a == null || b == null) return null;
  if (typeof a !== 'number' || typeof b !== 'number') return null;
  
  return a + b;
}

/**
 * Transform a single college record
 */
function transformCollege(college) {
  const name = college.name || 'Unknown College';
  const slug = slugify(name);
  const state = college.location?.state || '';
  
  // Calculate SAT and ACT averages
  const satMin = college.admissions?.satRange?.min;
  const satMax = college.admissions?.satRange?.max;
  const actMin = college.admissions?.actRange?.min;
  const actMax = college.admissions?.actRange?.max;
  
  // Calculate sticker prices (tuition + fees)
  const tuitionIn = college.financials?.tuitionInState;
  const tuitionOut = college.financials?.tuitionOutOfState;
  const feesIn = college.financials?.feesInState;
  const feesOut = college.financials?.feesOutOfState;
  
  return {
    // Basic Info
    name: name,
    slug: slug,
    city: college.location?.city || null,
    state: state,
    publicPrivate: CONTROL_TO_TYPE[college.control] || 'Unknown',
    degreeLevel: SECTOR_TO_DEGREE_LEVEL[college.sector] || 'Unknown',
    
    // Financials
    inStateTuition: tuitionIn ?? null,
    outStateTuition: tuitionOut ?? null,
    avgNetPrice: college.financials?.avgCostAttendance ?? null,
    stickerPriceInState: safeAdd(tuitionIn, feesIn),
    stickerPriceOutState: safeAdd(tuitionOut, feesOut),
    
    // Admissions
    acceptanceRate: convertAcceptanceRate(college.admissions?.acceptanceRate),
    satAvg: calculateAverage(satMin, satMax),
    actAvg: calculateAverage(actMin, actMax),
    
    // Metadata
    website: normalizeWebsite(college.website),
    canonicalUrl: `/colleges/${state.toLowerCase()}/${slug}`,
    isActive: true,
    
    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Reference to source
    ipedsId: college.ipedsId,
    sourceCollection: SOURCE_COLLECTION
  };
}

/**
 * Main transformation pipeline
 */
async function runTransformation() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    console.log('=' . repeat(80));
    console.log('IPEDS → UI TRANSFORMATION PIPELINE');
    console.log('=' . repeat(80));
    
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const sourceCollection = db.collection(SOURCE_COLLECTION);
    const targetCollection = db.collection(TARGET_COLLECTION);
    
    // Check source
    const sourceCount = await sourceCollection.countDocuments();
    console.log(`\n📊 Source: ${SOURCE_COLLECTION}`);
    console.log(`   Records: ${sourceCount.toLocaleString()}`);
    
    if (sourceCount === 0) {
      console.log('❌ Source collection is empty. Aborting.');
      return;
    }
    
    // Drop existing target collection
    console.log(`\n🗑️  Dropping existing ${TARGET_COLLECTION} collection...`);
    try {
      await targetCollection.drop();
      console.log('   ✓ Collection dropped');
    } catch (err) {
      console.log('   ℹ️  Collection does not exist (first run)');
    }
    
    // Process colleges in batches
    console.log(`\n⚙️  Transforming ${sourceCount.toLocaleString()} colleges...`);
    
    const BATCH_SIZE = 1000;
    let processed = 0;
    let inserted = 0;
    let errors = 0;
    
    const cursor = sourceCollection.find({});
    let batch = [];
    
    for await (const college of cursor) {
      try {
        const transformed = transformCollege(college);
        batch.push(transformed);
        processed++;
        
        // Insert in batches
        if (batch.length >= BATCH_SIZE) {
          await targetCollection.insertMany(batch, { ordered: false });
          inserted += batch.length;
          batch = [];
          
          // Progress update
          const progress = (processed / sourceCount * 100).toFixed(1);
          process.stdout.write(`\r   Progress: ${processed.toLocaleString()}/${sourceCount.toLocaleString()} (${progress}%)`);
        }
      } catch (err) {
        errors++;
        console.error(`\n   ⚠️  Error processing ${college.ipedsId}: ${err.message}`);
      }
    }
    
    // Insert remaining batch
    if (batch.length > 0) {
      await targetCollection.insertMany(batch, { ordered: false });
      inserted += batch.length;
    }
    
    console.log(`\n\n✓ Transformation complete`);
    console.log(`   Processed: ${processed.toLocaleString()}`);
    console.log(`   Inserted: ${inserted.toLocaleString()}`);
    console.log(`   Errors: ${errors}`);
    
    // Create indexes
    console.log(`\n📇 Creating indexes...`);
    await targetCollection.createIndex({ slug: 1 });
    await targetCollection.createIndex({ state: 1 });
    await targetCollection.createIndex({ publicPrivate: 1 });
    await targetCollection.createIndex({ degreeLevel: 1 });
    await targetCollection.createIndex({ name: 'text' });
    await targetCollection.createIndex({ isActive: 1 });
    console.log('   ✓ Indexes created');
    
    // Generate statistics
    console.log(`\n📈 Data Quality Report:`);
    console.log('   ' + '-'.repeat(60));
    
    const stats = {
      'Total Records': await targetCollection.countDocuments({}),
      'With Acceptance Rate': await targetCollection.countDocuments({ acceptanceRate: { $ne: null } }),
      'With SAT Average': await targetCollection.countDocuments({ satAvg: { $ne: null } }),
      'With ACT Average': await targetCollection.countDocuments({ actAvg: { $ne: null } }),
      'With In-State Tuition': await targetCollection.countDocuments({ inStateTuition: { $ne: null } }),
      'With Out-State Tuition': await targetCollection.countDocuments({ outStateTuition: { $ne: null } }),
      'With Avg Net Price': await targetCollection.countDocuments({ avgNetPrice: { $ne: null } }),
      'With Website': await targetCollection.countDocuments({ website: { $ne: null } }),
    };
    
    const total = stats['Total Records'];
    for (const [key, value] of Object.entries(stats)) {
      const pct = key === 'Total Records' ? 100 : (value / total * 100).toFixed(1);
      console.log(`   ${key.padEnd(30)}: ${value.toLocaleString().padStart(6)} (${pct}%)`);
    }
    
    // Sample records
    console.log(`\n📄 Sample Records:`);
    const samples = await targetCollection.find({}).limit(3).toArray();
    samples.forEach((sample, i) => {
      console.log(`\n   ${i + 1}. ${sample.name}`);
      console.log(`      Slug: ${sample.slug}`);
      console.log(`      Location: ${sample.city}, ${sample.state}`);
      console.log(`      Type: ${sample.publicPrivate} - ${sample.degreeLevel}`);
      console.log(`      URL: ${sample.canonicalUrl}`);
    });
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ TRANSFORMATION COMPLETE');
    console.log('='.repeat(80));
    console.log(`\n💾 New collection: ${DB_NAME}.${TARGET_COLLECTION}`);
    console.log(`📊 Total records: ${inserted.toLocaleString()}`);
    
  } catch (err) {
    console.error('\n❌ Fatal error:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the transformation
if (require.main === module) {
  runTransformation().catch(console.error);
}

module.exports = { transformCollege, slugify, normalizeWebsite };
