/**
 * CollegeDataWrapper - Transforms IPEDS college data for UI components
 * 
 * This wrapper ensures backward compatibility by transforming the new IPEDS schema
 * to match the format expected by existing UI components
 */

import {
  getLocationString,
  getState,
  getControlType,
  getAcceptanceRate,
  getSATRange,
  getACTRange,
  getEnrollmentFormatted,
  getTuitionInState,
  getTuitionOutOfState,
  formatTuition,
  getGradRate4yr,
  formatGradRate,
  getWebsite,
  getCollegeName,
  getCollegeId,
  getCollegeImage
} from '../../utils/collegeDataHelpers';

/**
 * Transform IPEDS college data to legacy format for UI compatibility
 * @param {Object} college - IPEDS college object
 * @returns {Object} Transformed college object
 */
export const transformCollegeForUI = (college) => {
  if (!college) return null;

  return {
    // IDs
    id: getCollegeId(college),
    ipedsId: college.ipedsId,
    
    // Basic info
    name: getCollegeName(college),
    shortName: college.alias || college.name,
    
    // Location
    location: getLocationString(college.location),
    state: getState(college.location),
    city: college.location?.city,
    zip: college.location?.zip,
    
    // Type
    type: getControlType(college.control),
    control: college.control,
    
    // Admissions
    acceptanceRate: getAcceptanceRate(college.admissions),
    satRange: getSATRange(college.admissions),
    actRange: getACTRange(college.admissions),
    
    // Enrollment
    enrollment: college.enrollment?.undergrad,
    enrollmentFormatted: getEnrollmentFormatted(college.enrollment),
    
    // Financials
    tuitionInState: getTuitionInState(college.financials),
    tuitionOutState: getTuitionOutOfState(college.financials),
    tuitionInStateFormatted: formatTuition(getTuitionInState(college.financials)),
    tuitionOutStateFormatted: formatTuition(getTuitionOutOfState(college.financials)),
    
    // Outcomes
    graduationRate: getGradRate4yr(college.outcomes),
    graduationRateFormatted: formatGradRate(getGradRate4yr(college.outcomes)),
    
    // Website
    website: getWebsite(college.website),
    
    // Image (placeholder - IPEDS doesn't have images)
    image: getCollegeImage(college.name),
    
    // Diversity
    diversity: college.diversity,
    
    // Fields not in IPEDS (set to null/defaults)
    rating: null,
    ranking: null,
    directAdmission: false,
    majors: [],
    features: [],
    description: `${getCollegeName(college)} is located in ${getLocationString(college.location)}.`,
    
    // Raw IPEDS data for advanced components
    _raw: college
  };
};

/**
 * React Hook to transform college data
 * @param {Object} college - IPEDS college object
 * @returns {Object} Transformed college object
 */
export const useTransformedCollege = (college) => {
  if (!college) return null;
  return transformCollegeForUI(college);
};
