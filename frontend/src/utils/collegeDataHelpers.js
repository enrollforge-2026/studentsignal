/**
 * College Data Helpers - IPEDS 2022 Schema
 * 
 * Helper functions to safely access and format IPEDS college data
 * with fallbacks for null/missing values
 */

/**
 * Get full location string from location object
 * @param {Object} location - Location object with city, state, zip
 * @returns {string} Formatted location string
 */
export const getLocationString = (location) => {
  if (!location) return 'Location not available';
  
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  
  return parts.length > 0 ? parts.join(', ') : 'Location not available';
};

/**
 * Get state abbreviation from location
 * @param {Object} location - Location object
 * @returns {string} State abbreviation or 'N/A'
 */
export const getState = (location) => {
  return location?.state || 'N/A';
};

/**
 * Get control type label (Public/Private)
 * @param {number} control - Control code (1=Public, 2=Private nonprofit, 3=Private for-profit)
 * @returns {string} Control type label
 */
export const getControlType = (control) => {
  const controlMap = {
    1: 'Public',
    2: 'Private',
    3: 'Private For-Profit'
  };
  return controlMap[control] || 'Unknown';
};

/**
 * Get acceptance rate as percentage
 * @param {Object} admissions - Admissions object
 * @returns {number|null} Acceptance rate as percentage (0-100)
 */
export const getAcceptanceRate = (admissions) => {
  if (!admissions?.acceptanceRate) return null;
  return Math.round(admissions.acceptanceRate * 100);
};

/**
 * Get SAT range string
 * @param {Object} admissions - Admissions object
 * @returns {string} SAT range (e.g., "1200-1400") or fallback
 */
export const getSATRange = (admissions) => {
  const satRange = admissions?.satRange;
  if (!satRange || !satRange.min || !satRange.max) {
    return 'Not reported';
  }
  return `${satRange.min}-${satRange.max}`;
};

/**
 * Get ACT range string
 * @param {Object} admissions - Admissions object
 * @returns {string} ACT range (e.g., "25-30") or fallback
 */
export const getACTRange = (admissions) => {
  const actRange = admissions?.actRange;
  if (!actRange || !actRange.min || !actRange.max) {
    return 'Not reported';
  }
  return `${actRange.min}-${actRange.max}`;
};

/**
 * Get undergraduate enrollment
 * @param {Object} enrollment - Enrollment object
 * @returns {number|null} Undergraduate enrollment count
 */
export const getEnrollment = (enrollment) => {
  return enrollment?.undergrad || null;
};

/**
 * Format enrollment with commas
 * @param {Object} enrollment - Enrollment object
 * @returns {string} Formatted enrollment (e.g., "15,000") or fallback
 */
export const getEnrollmentFormatted = (enrollment) => {
  const count = getEnrollment(enrollment);
  if (!count) return 'Not available';
  return count.toLocaleString();
};

/**
 * Get in-state tuition
 * @param {Object} financials - Financials object
 * @returns {number|null} In-state tuition
 */
export const getTuitionInState = (financials) => {
  return financials?.tuitionInState || null;
};

/**
 * Get out-of-state tuition
 * @param {Object} financials - Financials object
 * @returns {number|null} Out-of-state tuition
 */
export const getTuitionOutOfState = (financials) => {
  return financials?.tuitionOutOfState || null;
};

/**
 * Format tuition as currency
 * @param {number} amount - Tuition amount
 * @returns {string} Formatted currency (e.g., "$50,000") or fallback
 */
export const formatTuition = (amount) => {
  if (!amount && amount !== 0) return 'Not available';
  return `$${amount.toLocaleString()}`;
};

/**
 * Get 4-year graduation rate
 * @param {Object} outcomes - Outcomes object
 * @returns {number|null} Graduation rate as decimal (0-1)
 */
export const getGradRate4yr = (outcomes) => {
  return outcomes?.gradRate4yr || null;
};

/**
 * Get 6-year graduation rate
 * @param {Object} outcomes - Outcomes object
 * @returns {number|null} Graduation rate as decimal (0-1)
 */
export const getGradRate6yr = (outcomes) => {
  return outcomes?.gradRate6yr || null;
};

/**
 * Format graduation rate as percentage
 * @param {number} rate - Graduation rate as decimal
 * @returns {string} Formatted percentage or fallback
 */
export const formatGradRate = (rate) => {
  if (!rate && rate !== 0) return 'Not available';
  return `${Math.round(rate * 100)}%`;
};

/**
 * Get gender percentages
 * @param {Object} diversity - Diversity object
 * @returns {Object} Object with male and female percentages
 */
export const getGenderDistribution = (diversity) => {
  const genderPct = diversity?.genderPct || {};
  return {
    male: genderPct.male ? Math.round(genderPct.male * 100) : null,
    female: genderPct.female ? Math.round(genderPct.female * 100) : null
  };
};

/**
 * Get race/ethnicity percentages
 * @param {Object} diversity - Diversity object
 * @returns {Object} Race/ethnicity percentages as percentages (0-100)
 */
export const getRaceEthnicityDistribution = (diversity) => {
  const raceEthnicityPct = diversity?.raceEthnicityPct || {};
  const result = {};
  
  for (const [key, value] of Object.entries(raceEthnicityPct)) {
    result[key] = value ? Math.round(value * 100) : 0;
  }
  
  return result;
};

/**
 * Get college website URL
 * @param {string} website - Website URL
 * @returns {string} Website URL or fallback
 */
export const getWebsite = (website) => {
  return website || '#';
};

/**
 * Get college name with fallback to alias
 * @param {Object} college - College object
 * @returns {string} College name
 */
export const getCollegeName = (college) => {
  return college.name || college.alias || 'Unknown College';
};

/**
 * Get college ID (ipedsId)
 * @param {Object} college - College object
 * @returns {string} College ID
 */
export const getCollegeId = (college) => {
  return college.ipedsId || college.id || '';
};

/**
 * Get Pell percentage
 * @param {Object} diversity - Diversity object
 * @returns {number|null} Pell grant recipient percentage
 */
export const getPellPercentage = (diversity) => {
  const pellPct = diversity?.pellPct;
  if (!pellPct && pellPct !== 0) return null;
  return Math.round(pellPct * 100);
};

/**
 * Generate a placeholder image URL for colleges
 * @param {string} name - College name
 * @returns {string} Placeholder image URL
 */
export const getCollegeImage = (name) => {
  // Use a consistent placeholder image service
  const encodedName = encodeURIComponent(name || 'College');
  return `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80`;
};

/**
 * Check if college has complete admissions data
 * @param {Object} admissions - Admissions object
 * @returns {boolean} True if has acceptance rate and test scores
 */
export const hasCompleteAdmissionsData = (admissions) => {
  if (!admissions) return false;
  return !!(
    admissions.acceptanceRate ||
    (admissions.satRange && (admissions.satRange.min || admissions.satRange.max)) ||
    (admissions.actRange && (admissions.actRange.min || admissions.actRange.max))
  );
};

/**
 * Check if college has financial data
 * @param {Object} financials - Financials object
 * @returns {boolean} True if has tuition data
 */
export const hasFinancialData = (financials) => {
  if (!financials) return false;
  return !!(financials.tuitionInState || financials.tuitionOutOfState);
};
