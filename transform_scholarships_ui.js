#!/usr/bin/env node

/**
 * Scholarship ETL Pipeline - Phase 2
 * 
 * Transforms raw scholarship data into UI-optimized flat schema
 * Source: Backend seed data (8 scholarships)
 * Target: studentsignal.scholarships_ui
 */

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

// Configuration
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'studentsignal';
const SOURCE_DATA_FILE = './backend/seed_data.py'; // Reference only
const TARGET_COLLECTION = 'scholarships_ui';

// Source: Extracted from seed_data.py
const SOURCE_SCHOLARSHIPS = [
  {
    id: uuidv4(),
    name: "National Merit Scholarship",
    amount: "Up to $2,500",
    deadline: "October 15, 2025",
    type: "Merit-Based",
    category: "Academic Excellence",
    description: "Awarded to top-performing students based on PSAT/NMSQT scores.",
    eligibility: ["High school seniors", "U.S. citizens", "Top PSAT scores"],
    renewable: true,
    application_required: true,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
  },
  {
    id: uuidv4(),
    name: "Coca-Cola Scholars Program",
    amount: "$20,000",
    deadline: "October 31, 2025",
    type: "Merit-Based",
    category: "Leadership",
    description: "Recognizes students who demonstrate leadership, service, and academic achievement.",
    eligibility: ["High school seniors", "Minimum 3.0 GPA", "Leadership experience"],
    renewable: false,
    application_required: true,
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800"
  },
  {
    id: uuidv4(),
    name: "Gates Scholarship",
    amount: "Full Cost of Attendance",
    deadline: "September 15, 2025",
    type: "Need-Based",
    category: "Minority Students",
    description: "Covers the full cost of attendance for exceptional minority students with financial need.",
    eligibility: ["High school seniors", "Pell Grant eligible", "Minority students"],
    renewable: true,
    application_required: true,
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800"
  },
  {
    id: uuidv4(),
    name: "STEM Excellence Scholarship",
    amount: "$5,000",
    deadline: "January 15, 2026",
    type: "Merit-Based",
    category: "STEM",
    description: "For students pursuing degrees in Science, Technology, Engineering, or Mathematics.",
    eligibility: ["College students", "STEM major", "Minimum 3.5 GPA"],
    renewable: true,
    application_required: true,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800"
  },
  {
    id: uuidv4(),
    name: "First Generation College Scholarship",
    amount: "$10,000",
    deadline: "December 1, 2025",
    type: "Need-Based",
    category: "First Generation",
    description: "Supporting first-generation college students in their educational journey.",
    eligibility: ["First-generation college students", "Financial need", "Minimum 2.5 GPA"],
    renewable: true,
    application_required: true,
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800"
  },
  {
    id: uuidv4(),
    name: "Athletic Excellence Scholarship",
    amount: "$15,000",
    deadline: "November 30, 2025",
    type: "Athletic",
    category: "Sports",
    description: "For student-athletes demonstrating excellence in their sport and academics.",
    eligibility: ["High school seniors", "Varsity athlete", "Minimum 3.0 GPA"],
    renewable: true,
    application_required: true,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
  },
  {
    id: uuidv4(),
    name: "Women in Technology Scholarship",
    amount: "$7,500",
    deadline: "February 28, 2026",
    type: "Merit-Based",
    category: "Women in STEM",
    description: "Encouraging women to pursue careers in technology and computer science.",
    eligibility: ["Female students", "Technology or CS major", "Minimum 3.0 GPA"],
    renewable: false,
    application_required: true,
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"
  },
  {
    id: uuidv4(),
    name: "Community Service Leadership Award",
    amount: "$3,000",
    deadline: "March 31, 2026",
    type: "Merit-Based",
    category: "Community Service",
    description: "Recognizes students with outstanding community service contributions.",
    eligibility: ["College students", "100+ volunteer hours", "Leadership roles"],
    renewable: false,
    application_required: true,
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"
  }
];

/**
 * Generate URL-friendly slug from name
 */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse amount string to extract min/max numeric values
 * 
 * Examples:
 * "Up to $2,500" → { min: 0, max: 2500, type: "range" }
 * "$20,000" → { min: 20000, max: 20000, type: "fixed" }
 * "Full Cost of Attendance" → { min: null, max: null, type: "full-ride" }
 * "$5,000-$10,000" → { min: 5000, max: 10000, type: "range" }
 */
function parseAmountString(amountStr) {
  if (!amountStr) {
    return { min: null, max: null, type: 'unknown' };
  }

  const str = amountStr.trim();

  // Check for full-ride/varies keywords
  const fullRideKeywords = ['full cost', 'full tuition', 'full ride', 'varies'];
  if (fullRideKeywords.some(keyword => str.toLowerCase().includes(keyword))) {
    return { min: null, max: null, type: 'full-ride' };
  }

  // Extract all numbers from string
  const numbers = str.match(/\d+(?:,\d{3})*(?:\.\d+)?/g);
  
  if (!numbers || numbers.length === 0) {
    return { min: null, max: null, type: 'unknown' };
  }

  // Clean numbers (remove commas)
  const cleanNumbers = numbers.map(n => parseInt(n.replace(/,/g, '')));

  // Check for range patterns
  if (str.toLowerCase().includes('up to')) {
    return {
      min: 0,
      max: cleanNumbers[0],
      type: 'range'
    };
  }

  // Check for explicit range (e.g., "$5,000-$10,000" or "$5,000 to $10,000")
  if (cleanNumbers.length === 2) {
    return {
      min: Math.min(...cleanNumbers),
      max: Math.max(...cleanNumbers),
      type: 'range'
    };
  }

  // Single fixed amount
  return {
    min: cleanNumbers[0],
    max: cleanNumbers[0],
    type: 'fixed'
  };
}

/**
 * Parse deadline string to ISO 8601 date
 * 
 * Input: "October 15, 2025"
 * Output: "2025-10-15T23:59:59.000Z"
 */
function parseDeadlineString(deadlineStr) {
  if (!deadlineStr) return null;

  try {
    // Parse the date string
    const date = new Date(deadlineStr);
    
    // Check if valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${deadlineStr}`);
      return null;
    }

    // Set to end of day (23:59:59)
    date.setHours(23, 59, 59, 999);

    return date.toISOString();
  } catch (error) {
    console.error(`Error parsing deadline "${deadlineStr}":`, error);
    return null;
  }
}

/**
 * Generate tags from type and category
 */
function generateTags(type, category) {
  const tags = [];

  // Add type-based tags
  if (type) {
    const typeTag = type.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    tags.push(typeTag);
  }

  // Add category-based tags
  if (category) {
    const categoryWords = category.toLowerCase().split(/\s+/);
    categoryWords.forEach(word => {
      if (word.length > 2) { // Skip short words like "in", "of"
        tags.push(word);
      }
    });
  }

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Load enrichment data from JSON file
 */
function loadEnrichmentData() {
  const fs = require('fs');
  const path = require('path');
  const enrichmentPath = path.join(__dirname, 'scholarship_manual_enrichment.json');
  
  if (!fs.existsSync(enrichmentPath)) {
    console.warn('⚠️  Enrichment file not found. Scholarships will have null sponsor/website fields.');
    return {};
  }

  try {
    const enrichmentFile = fs.readFileSync(enrichmentPath, 'utf8');
    const enrichmentData = JSON.parse(enrichmentFile);
    
    // Convert array format to slug-based lookup object
    const enrichmentMap = {};
    if (enrichmentData.scholarships && Array.isArray(enrichmentData.scholarships)) {
      enrichmentData.scholarships.forEach(scholarship => {
        if (scholarship.slug && scholarship.enrichment_data) {
          enrichmentMap[scholarship.slug] = scholarship.enrichment_data;
        }
      });
    }
    
    return enrichmentMap;
  } catch (error) {
    console.error('❌ Error loading enrichment data:', error.message);
    return {};
  }
}

/**
 * Transform single scholarship record
 */
function transformScholarship(scholarship, enrichmentData = {}) {
  const amountParsed = parseAmountString(scholarship.amount);
  const deadlineISO = parseDeadlineString(scholarship.deadline);
  const slug = slugify(scholarship.name);
  const tags = generateTags(scholarship.type, scholarship.category);

  // Get enrichment data for this scholarship
  const enrichment = enrichmentData[slug] || {};

  return {
    // Core Identity
    id: scholarship.id,
    slug: slug,
    name: scholarship.name,

    // Financial
    amount: scholarship.amount, // Display text
    amountMin: amountParsed.min,
    amountMax: amountParsed.max,
    amountType: amountParsed.type,

    // Deadlines
    deadline: deadlineISO,
    deadlineDisplay: scholarship.deadline, // Original text
    isRolling: false, // Default

    // Categorization
    type: scholarship.type,
    category: scholarship.category,
    tags: tags,

    // Content
    description: scholarship.description,
    eligibility: scholarship.eligibility,

    // Application Info
    renewable: scholarship.renewable,
    applicationRequired: scholarship.application_required,
    website: enrichment.website || null,
    applicationUrl: enrichment.applicationUrl || null,

    // Sponsor
    sponsor: enrichment.sponsor || null,
    sponsorWebsite: enrichment.website || null, // Use same as website for now

    // Metadata
    imageUrl: scholarship.image,
    isActive: true,
    featured: false,

    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),

    // Source tracking
    sourceCollection: 'seed'
  };
}

/**
 * Main ETL process
 */
async function runETL() {
  const client = new MongoClient(MONGO_URL);

  try {
    console.log('=' .repeat(80));
    console.log('SCHOLARSHIP ETL PIPELINE - PHASE 2.5 (WITH ENRICHMENT)');
    console.log('=' .repeat(80));

    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const targetCollection = db.collection(TARGET_COLLECTION);

    // Check if collection exists
    const collections = await db.listCollections({ name: TARGET_COLLECTION }).toArray();
    if (collections.length > 0) {
      console.log(`\n⚠️  Collection ${TARGET_COLLECTION} already exists`);
      console.log('   Dropping existing collection...');
      await targetCollection.drop();
      console.log('   ✓ Collection dropped');
    }

    console.log(`\n📊 Source Data:`);
    console.log(`   Records: ${SOURCE_SCHOLARSHIPS.length}`);
    console.log(`   Source: Backend seed_data.py`);

    // Load enrichment data
    console.log(`\n📥 Loading enrichment data...`);
    const enrichmentData = loadEnrichmentData();
    const enrichedCount = Object.keys(enrichmentData).length;
    console.log(`   ✓ Loaded enrichment for ${enrichedCount} scholarships`);

    // Transform scholarships
    console.log(`\n⚙️  Transforming scholarships with enrichment...`);
    const transformedScholarships = SOURCE_SCHOLARSHIPS.map(s => transformScholarship(s, enrichmentData));

    // Display sample transformation
    console.log(`\n📋 SAMPLE TRANSFORMATION:`);
    console.log('\n--- BEFORE (Source) ---');
    console.log(JSON.stringify(SOURCE_SCHOLARSHIPS[0], null, 2));
    console.log('\n--- AFTER (Transformed) ---');
    console.log(JSON.stringify(transformedScholarships[0], null, 2));

    // Insert into database
    console.log(`\n💾 Inserting ${transformedScholarships.length} scholarships into ${TARGET_COLLECTION}...`);
    const result = await targetCollection.insertMany(transformedScholarships);
    console.log(`   ✓ Inserted ${result.insertedCount} records`);

    // Generate statistics
    console.log(`\n📈 TRANSFORMATION STATISTICS:`);
    console.log('=' .repeat(80));

    // Amount parsing stats
    const amountStats = {
      fixed: transformedScholarships.filter(s => s.amountType === 'fixed').length,
      range: transformedScholarships.filter(s => s.amountType === 'range').length,
      fullRide: transformedScholarships.filter(s => s.amountType === 'full-ride').length,
      unknown: transformedScholarships.filter(s => s.amountType === 'unknown').length,
    };

    console.log('\nAmount Types:');
    console.log(`  Fixed amount:     ${amountStats.fixed}`);
    console.log(`  Range:            ${amountStats.range}`);
    console.log(`  Full-ride:        ${amountStats.fullRide}`);
    console.log(`  Unknown:          ${amountStats.unknown}`);

    // Deadline parsing stats
    const deadlinesParsed = transformedScholarships.filter(s => s.deadline !== null).length;
    console.log(`\nDeadlines:`);
    console.log(`  Successfully parsed: ${deadlinesParsed}/${transformedScholarships.length}`);

    // Field completeness
    console.log(`\nField Completeness:`);
    console.log(`  slug:                ${transformedScholarships.filter(s => s.slug).length}/${transformedScholarships.length}`);
    console.log(`  amountMin:           ${transformedScholarships.filter(s => s.amountMin !== null).length}/${transformedScholarships.length}`);
    console.log(`  amountMax:           ${transformedScholarships.filter(s => s.amountMax !== null).length}/${transformedScholarships.length}`);
    console.log(`  tags:                ${transformedScholarships.filter(s => s.tags.length > 0).length}/${transformedScholarships.length}`);

    // Enrichment needs
    const needsEnrichment = {
      website: transformedScholarships.filter(s => !s.website).length,
      sponsor: transformedScholarships.filter(s => !s.sponsor).length,
      applicationUrl: transformedScholarships.filter(s => !s.applicationUrl).length,
    };

    console.log(`\nManual Enrichment Needed:`);
    console.log(`  website:          ${needsEnrichment.website}/${transformedScholarships.length}`);
    console.log(`  sponsor:          ${needsEnrichment.sponsor}/${transformedScholarships.length}`);
    console.log(`  applicationUrl:   ${needsEnrichment.applicationUrl}/${transformedScholarships.length}`);

    console.log('\n' + '=' .repeat(80));
    console.log('✅ ETL COMPLETE');
    console.log('=' .repeat(80));
    console.log(`\n💾 New collection: ${DB_NAME}.${TARGET_COLLECTION}`);
    console.log(`📊 Total records: ${result.insertedCount}`);
    console.log(`\n⚠️  Next Step: Phase 2.5 - Manual Enrichment`);
    console.log(`   Edit: /app/scholarship_manual_enrichment.json`);

  } catch (error) {
    console.error('\n❌ ETL Error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run ETL
if (require.main === module) {
  runETL().catch(console.error);
}

module.exports = { transformScholarship, parseAmountString, parseDeadlineString, slugify };
