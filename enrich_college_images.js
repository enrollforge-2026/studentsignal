#!/usr/bin/env node

/**
 * College Image Enrichment Script
 * 
 * Fetches real college images and updates colleges_ui collection
 * Priority:
 * 1. OpenGraph image from website
 * 2. Favicon/Apple Touch Icon
 * 3. Branded fallback based on college type
 */

const { MongoClient } = require('mongodb');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Configuration
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'studentsignal';
const COLLECTION_NAME = 'colleges_ui';
const BATCH_SIZE = 50;
const REQUEST_TIMEOUT = 5000; // 5 seconds
const RATE_LIMIT_DELAY = 100; // 100ms between requests

// Branded Fallback Images (Unsplash)
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

/**
 * Fetch HTML content from URL with timeout
 */
function fetchUrl(url, timeout = REQUEST_TIMEOUT) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'StudentSignal/1.0 (Image Enrichment Bot)',
          'Accept': 'text/html,application/xhtml+xml'
        },
        timeout: timeout
      };
      
      const req = client.request(options, (res) => {
        let data = '';
        
        // Only process if status is 2xx
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        
        res.on('data', (chunk) => {
          data += chunk;
          // Limit data size to 1MB
          if (data.length > 1024 * 1024) {
            req.destroy();
            reject(new Error('Response too large'));
          }
        });
        
        res.on('end', () => {
          resolve(data);
        });
      });
      
      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      req.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Extract OpenGraph image from HTML
 */
function extractOgImage(html) {
  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch) {
    return ogImageMatch[1];
  }
  
  // Try alternate format
  const ogImageAlt = html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
  if (ogImageAlt) {
    return ogImageAlt[1];
  }
  
  return null;
}

/**
 * Extract favicon or apple-touch-icon from HTML
 */
function extractFavicon(html, baseUrl) {
  // Look for apple-touch-icon first (usually higher quality)
  const appleTouchMatch = html.match(/<link\s+[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i);
  if (appleTouchMatch) {
    return makeAbsoluteUrl(appleTouchMatch[1], baseUrl);
  }
  
  // Look for regular favicon
  const faviconMatch = html.match(/<link\s+[^>]*rel=["'](?:shortcut\s+)?icon["'][^>]*href=["']([^"']+)["']/i);
  if (faviconMatch) {
    return makeAbsoluteUrl(faviconMatch[1], baseUrl);
  }
  
  // Fallback to /favicon.ico
  return `${baseUrl}/favicon.ico`;
}

/**
 * Make URL absolute if relative
 */
function makeAbsoluteUrl(url, baseUrl) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  if (url.startsWith('/')) {
    return baseUrl + url;
  }
  return baseUrl + '/' + url;
}

/**
 * Get branded fallback image based on college type
 */
function getBrandedFallback(publicPrivate, degreeLevel) {
  const key = `${publicPrivate}_${degreeLevel}`;
  return FALLBACK_IMAGES[key] || FALLBACK_IMAGES['default'];
}

/**
 * Attempt to fetch college image
 */
async function fetchCollegeImage(college) {
  const website = college.website;
  
  // If no website, use branded fallback
  if (!website) {
    return {
      imageUrl: getBrandedFallback(college.publicPrivate, college.degreeLevel),
      source: 'fallback_no_website'
    };
  }
  
  try {
    // Normalize website URL
    let baseUrl = website;
    if (!baseUrl.startsWith('http')) {
      baseUrl = 'https://' + baseUrl;
    }
    baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    
    // Fetch homepage HTML
    const html = await fetchUrl(baseUrl);
    
    // Try to extract OpenGraph image
    const ogImage = extractOgImage(html);
    if (ogImage) {
      const absoluteUrl = makeAbsoluteUrl(ogImage, baseUrl);
      return {
        imageUrl: absoluteUrl,
        source: 'opengraph'
      };
    }
    
    // Try to extract favicon/apple-touch-icon
    const favicon = extractFavicon(html, baseUrl);
    if (favicon) {
      return {
        imageUrl: favicon,
        source: 'favicon'
      };
    }
    
    // No image found, use branded fallback
    return {
      imageUrl: getBrandedFallback(college.publicPrivate, college.degreeLevel),
      source: 'fallback_no_image'
    };
    
  } catch (error) {
    // Error fetching website, use branded fallback
    return {
      imageUrl: getBrandedFallback(college.publicPrivate, college.degreeLevel),
      source: `fallback_error:${error.message.substring(0, 50)}`
    };
  }
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main enrichment process
 */
async function enrichCollegeImages() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    console.log('=' . repeat(80));
    console.log('COLLEGE IMAGE ENRICHMENT');
    console.log('=' . repeat(80));
    
    await client.connect();
    console.log('✓ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Count total colleges
    const total = await collection.countDocuments({ isActive: true });
    console.log(`\n📊 Total colleges to process: ${total.toLocaleString()}`);
    
    // Stats
    const stats = {
      total: total,
      processed: 0,
      opengraph: 0,
      favicon: 0,
      fallback_no_website: 0,
      fallback_no_image: 0,
      fallback_error: 0,
      skipped: 0
    };
    
    // Process in batches
    const cursor = collection.find({ isActive: true });
    
    console.log(`\n⚙️  Processing colleges in batches of ${BATCH_SIZE}...`);
    console.log('   (Rate limited to avoid overwhelming servers)\n');
    
    let batch = [];
    
    for await (const college of cursor) {
      batch.push(college);
      
      if (batch.length >= BATCH_SIZE) {
        await processBatch(collection, batch, stats);
        batch = [];
        
        // Progress update
        const progress = (stats.processed / total * 100).toFixed(1);
        process.stdout.write(`\r   Progress: ${stats.processed.toLocaleString()}/${total.toLocaleString()} (${progress}%)`);
      }
    }
    
    // Process remaining
    if (batch.length > 0) {
      await processBatch(collection, batch, stats);
    }
    
    console.log('\n\n✓ Processing complete\n');
    
    // Print final stats
    console.log('=' . repeat(80));
    console.log('ENRICHMENT RESULTS');
    console.log('=' . repeat(80));
    console.log(`\nTotal Processed: ${stats.processed.toLocaleString()}`);
    console.log(`\nImage Sources:`);
    console.log(`  OpenGraph (og:image):        ${stats.opengraph.toLocaleString()} (${(stats.opengraph/stats.processed*100).toFixed(1)}%)`);
    console.log(`  Favicon/Apple Touch Icon:    ${stats.favicon.toLocaleString()} (${(stats.favicon/stats.processed*100).toFixed(1)}%)`);
    console.log(`  Fallback (no website):       ${stats.fallback_no_website.toLocaleString()} (${(stats.fallback_no_website/stats.processed*100).toFixed(1)}%)`);
    console.log(`  Fallback (no image found):   ${stats.fallback_no_image.toLocaleString()} (${(stats.fallback_no_image/stats.processed*100).toFixed(1)}%)`);
    console.log(`  Fallback (fetch error):      ${stats.fallback_error.toLocaleString()} (${(stats.fallback_error/stats.processed*100).toFixed(1)}%)`);
    
    const realImages = stats.opengraph + stats.favicon;
    const fallbacks = stats.fallback_no_website + stats.fallback_no_image + stats.fallback_error;
    
    console.log(`\n📊 Summary:`);
    console.log(`  Real Images:    ${realImages.toLocaleString()} (${(realImages/stats.processed*100).toFixed(1)}%)`);
    console.log(`  Fallback Images: ${fallbacks.toLocaleString()} (${(fallbacks/stats.processed*100).toFixed(1)}%)`);
    
    console.log('\n' + '=' . repeat(80));
    console.log('✅ ENRICHMENT COMPLETE');
    console.log('=' . repeat(80));
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

/**
 * Process a batch of colleges
 */
async function processBatch(collection, batch, stats) {
  for (const college of batch) {
    try {
      // Fetch image
      const result = await fetchCollegeImage(college);
      
      // Update database
      await collection.updateOne(
        { ipedsId: college.ipedsId },
        { 
          $set: { 
            imageUrl: result.imageUrl,
            updatedAt: new Date()
          } 
        }
      );
      
      // Update stats
      stats.processed++;
      if (result.source === 'opengraph') {
        stats.opengraph++;
      } else if (result.source === 'favicon') {
        stats.favicon++;
      } else if (result.source === 'fallback_no_website') {
        stats.fallback_no_website++;
      } else if (result.source === 'fallback_no_image') {
        stats.fallback_no_image++;
      } else if (result.source.startsWith('fallback_error')) {
        stats.fallback_error++;
      }
      
      // Rate limiting
      await sleep(RATE_LIMIT_DELAY);
      
    } catch (error) {
      console.error(`\n⚠️  Error processing ${college.name}:`, error.message);
      stats.skipped++;
    }
  }
}

// Run enrichment
if (require.main === module) {
  enrichCollegeImages().catch(console.error);
}

module.exports = { enrichCollegeImages, getBrandedFallback };
