/**
 * Formatting Utilities for College Data Display
 * 
 * Safe formatters with null handling and fallbacks
 */

/**
 * Format currency with commas and dollar sign
 * @param {number|null} amount - Amount to format
 * @param {string} fallback - Fallback text if null (default: "N/A")
 * @returns {string} Formatted currency or fallback
 */
export const formatCurrency = (amount, fallback = "N/A") => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return fallback;
  }
  return `$${Number(amount).toLocaleString()}`;
};

/**
 * Format percentage with % sign
 * @param {number|null} value - Value to format (0-100 scale)
 * @param {string} fallback - Fallback text if null (default: "N/A")
 * @returns {string} Formatted percentage or fallback
 */
export const formatPercentage = (value, fallback = "N/A") => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return `${Number(value)}%`;
};

/**
 * Format test score (SAT/ACT)
 * @param {number|null} score - Score to format
 * @param {string} fallback - Fallback text if null (default: "N/A")
 * @returns {string} Formatted score or fallback
 */
export const formatTestScore = (score, fallback = "N/A") => {
  if (score === null || score === undefined || isNaN(score)) {
    return fallback;
  }
  return String(Number(score));
};

/**
 * Format location (city, state)
 * @param {string|null} city - City name
 * @param {string|null} state - State abbreviation
 * @returns {string} Formatted location
 */
export const formatLocation = (city, state) => {
  const parts = [];
  if (city) parts.push(city);
  if (state) parts.push(state);
  
  if (parts.length === 0) return "Location not available";
  return parts.join(", ");
};

/**
 * Format college type tag
 * @param {string|null} publicPrivate - Public/Private type
 * @param {string|null} degreeLevel - Degree level
 * @returns {string} Formatted tag
 */
export const formatCollegeTag = (publicPrivate, degreeLevel) => {
  const parts = [];
  if (publicPrivate) parts.push(publicPrivate);
  if (degreeLevel) parts.push(degreeLevel);
  
  if (parts.length === 0) return "";
  return parts.join(" · ");
};

/**
 * Get display value or fallback
 * @param {any} value - Value to display
 * @param {string} fallback - Fallback text (default: "N/A")
 * @returns {any} Value or fallback
 */
export const getDisplayValue = (value, fallback = "N/A") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
};

/**
 * StudentSignal Brand Colors
 */
export const COLORS = {
  primary: '#1a5d3a',      // Forest Green
  secondary: '#f5a623',    // Orange
  success: '#2d8659',      // Light Green
  danger: '#dc2626',       // Red
  info: '#3b82f6',         // Blue
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

/**
 * Get badge color based on college type
 * @param {string} publicPrivate - Public/Private type
 * @returns {object} Tailwind color classes
 */
export const getBadgeColors = (publicPrivate) => {
  const colors = {
    'Public': {
      bg: 'bg-[#1a5d3a]',
      text: 'text-white',
      border: 'border-[#1a5d3a]'
    },
    'Private': {
      bg: 'bg-[#f5a623]',
      text: 'text-white',
      border: 'border-[#f5a623]'
    },
    'Private For-Profit': {
      bg: 'bg-gray-600',
      text: 'text-white',
      border: 'border-gray-600'
    }
  };
  
  return colors[publicPrivate] || colors['Public'];
};
