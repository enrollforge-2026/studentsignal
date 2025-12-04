#!/usr/bin/env node

/**
 * Scholarship Enrichment Validator
 * 
 * Validates the manual enrichment file before proceeding to Phase 3
 * 
 * Usage: node validate_enrichment.js
 */

const fs = require('fs');
const path = require('path');

const ENRICHMENT_FILE = path.join(__dirname, 'scholarship_manual_enrichment.json');

// Validation rules
const RULES = {
  sponsor: {
    minLength: 5,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s&.,'-]+$/,
    errorMsg: 'Sponsor must be 5-100 characters, alphanumeric with basic punctuation'
  },
  website: {
    pattern: /^https:\/\/.+\..+/,
    errorMsg: 'Website must be a valid HTTPS URL'
  },
  applicationUrl: {
    pattern: /^https:\/\/.+\..+/,
    errorMsg: 'Application URL must be a valid HTTPS URL'
  }
};

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function validateField(fieldName, value, scholarshipName) {
  const errors = [];
  const rule = RULES[fieldName];

  if (!rule) {
    return errors;
  }

  // Check if empty
  if (!value || value.trim() === '') {
    errors.push({
      scholarship: scholarshipName,
      field: fieldName,
      error: 'Field is empty',
      severity: 'error'
    });
    return errors;
  }

  // Length validation
  if (rule.minLength && value.length < rule.minLength) {
    errors.push({
      scholarship: scholarshipName,
      field: fieldName,
      error: `Too short (${value.length} chars, minimum ${rule.minLength})`,
      severity: 'error'
    });
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push({
      scholarship: scholarshipName,
      field: fieldName,
      error: `Too long (${value.length} chars, maximum ${rule.maxLength})`,
      severity: 'error'
    });
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    errors.push({
      scholarship: scholarshipName,
      field: fieldName,
      error: rule.errorMsg,
      severity: 'error',
      value: value
    });
  }

  return errors;
}

function validateEnrichmentData() {
  console.log('='.repeat(80));
  console.log(colorize('SCHOLARSHIP ENRICHMENT VALIDATOR', 'cyan'));
  console.log('='.repeat(80));
  console.log();

  // Check if file exists
  if (!fs.existsSync(ENRICHMENT_FILE)) {
    console.log(colorize('❌ ERROR: Enrichment file not found', 'red'));
    console.log(`   Expected location: ${ENRICHMENT_FILE}`);
    process.exit(1);
  }

  console.log(colorize('✓', 'green') + ' Enrichment file found');
  console.log(`  Location: ${ENRICHMENT_FILE}`);
  console.log();

  // Parse JSON
  let data;
  try {
    const fileContent = fs.readFileSync(ENRICHMENT_FILE, 'utf8');
    data = JSON.parse(fileContent);
    console.log(colorize('✓', 'green') + ' JSON syntax valid');
  } catch (error) {
    console.log(colorize('❌ JSON PARSE ERROR', 'red'));
    console.log(`   ${error.message}`);
    process.exit(1);
  }

  console.log();

  // Validate structure
  if (!data.scholarships || !Array.isArray(data.scholarships)) {
    console.log(colorize('❌ STRUCTURE ERROR', 'red'));
    console.log('   Expected "scholarships" array not found');
    process.exit(1);
  }

  const scholarshipCount = data.scholarships.length;
  console.log(colorize('✓', 'green') + ` Found ${scholarshipCount} scholarships`);
  console.log();

  // Validate each scholarship
  const allErrors = [];
  const warnings = [];
  let completedCount = 0;
  let totalFields = scholarshipCount * 3; // 3 fields per scholarship
  let filledFields = 0;

  console.log('='.repeat(80));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(80));
  console.log();

  data.scholarships.forEach((scholarship, index) => {
    const scholarshipName = scholarship.name || `Scholarship #${index + 1}`;
    const slug = scholarship.slug || 'unknown';
    const enrichmentData = scholarship.enrichment_data;

    console.log(colorize(`${index + 1}. ${scholarshipName}`, 'blue'));
    console.log(`   Slug: ${slug}`);

    if (!enrichmentData) {
      console.log(colorize('   ❌ Missing enrichment_data section', 'red'));
      allErrors.push({
        scholarship: scholarshipName,
        field: 'enrichment_data',
        error: 'Section missing',
        severity: 'error'
      });
      console.log();
      return;
    }

    // Check each required field
    const requiredFields = ['sponsor', 'website', 'applicationUrl'];
    let scholarshipComplete = true;

    requiredFields.forEach(field => {
      const value = enrichmentData[field];
      const fieldErrors = validateField(field, value, scholarshipName);

      if (value && value.trim() !== '') {
        filledFields++;
        if (fieldErrors.length === 0) {
          console.log(colorize(`   ✓ ${field}`, 'green') + `: "${value}"`);
        } else {
          console.log(colorize(`   ⚠ ${field}`, 'yellow') + `: "${value}"`);
          scholarshipComplete = false;
        }
      } else {
        console.log(colorize(`   ✗ ${field}`, 'red') + ': EMPTY');
        scholarshipComplete = false;
      }

      allErrors.push(...fieldErrors);
    });

    if (scholarshipComplete) {
      completedCount++;
    }

    console.log();
  });

  // Summary
  console.log('='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log();

  console.log(`Total Scholarships:     ${scholarshipCount}`);
  console.log(`Fully Completed:        ${colorize(completedCount, completedCount === scholarshipCount ? 'green' : 'yellow')}/${scholarshipCount}`);
  console.log(`Fields Filled:          ${colorize(filledFields, filledFields === totalFields ? 'green' : 'yellow')}/${totalFields}`);
  console.log(`Completion:             ${Math.round((filledFields / totalFields) * 100)}%`);
  console.log();

  const errorCount = allErrors.filter(e => e.severity === 'error').length;
  const warningCount = allErrors.filter(e => e.severity === 'warning').length;

  console.log(`Errors:                 ${colorize(errorCount, errorCount === 0 ? 'green' : 'red')}`);
  console.log(`Warnings:               ${colorize(warningCount, warningCount === 0 ? 'green' : 'yellow')}`);
  console.log();

  // Display errors
  if (errorCount > 0) {
    console.log('='.repeat(80));
    console.log(colorize('ERRORS FOUND', 'red'));
    console.log('='.repeat(80));
    console.log();

    allErrors.forEach(err => {
      console.log(colorize(`❌ ${err.scholarship}`, 'red'));
      console.log(`   Field: ${err.field}`);
      console.log(`   Error: ${err.error}`);
      if (err.value) {
        console.log(`   Value: "${err.value}"`);
      }
      console.log();
    });
  }

  // Final verdict
  console.log('='.repeat(80));
  if (completedCount === scholarshipCount && errorCount === 0) {
    console.log(colorize('✅ VALIDATION PASSED', 'green'));
    console.log('   All scholarships are properly enriched and ready for Phase 3!');
    console.log();
    console.log('Next steps:');
    console.log('  1. Run ETL to populate scholarships_ui collection');
    console.log('  2. Create backend API endpoints');
    console.log('  3. Build frontend UI');
    process.exit(0);
  } else {
    console.log(colorize('❌ VALIDATION FAILED', 'red'));
    console.log(`   ${scholarshipCount - completedCount} scholarship(s) need attention`);
    console.log(`   ${errorCount} error(s) must be fixed`);
    console.log();
    console.log('Please review and fix the errors above, then run validation again.');
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  validateEnrichmentData();
}

module.exports = { validateEnrichmentData };
