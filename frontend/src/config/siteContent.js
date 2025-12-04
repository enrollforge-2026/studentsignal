/**
 * Site Content Management
 * 
 * This file contains all editable text content for the StudentSignal platform.
 * Edit this file to change text across the site without modifying component code.
 * 
 * IMPORTANT: After editing this file, the frontend will automatically reload with your changes.
 */

const siteContent = {
  // ========================================
  // COLLEGE SEARCH PAGE
  // ========================================
  collegeSearch: {
    hero: {
      title: "College Search",
      subtitle: "Student Signal simplifies the process of discovering and connecting with top Colleges and Universities. Explore colleges for free, check admission rates, and access other valuable information to help you create your perfect college list.",
      searchPlaceholder: "Search Colleges"
    },
    filters: {
      title: "Filters",
      clearAll: "Clear all",
      labels: {
        location: "Location",
        levelOfInstitution: "Level of Institution",
        institutionType: "Institution Type",
        cost: "Cost (Avg Net Price)",
        selectivity: "Selectivity (Acceptance Rate)",
        satScoreRange: "SAT Score Range",
        actScoreRange: "ACT Score Range"
      },
      placeholders: {
        location: "City or State",
        minCost: "Min $",
        maxCost: "Max $"
      }
    },
    results: {
      browsingText: "Browsing {count} Colleges",
      sortByLabel: "Sort by:",
      noResultsTitle: "No colleges found matching your criteria",
      noResultsButton: "Clear All Filters"
    },
    card: {
      ctaButton: "Will you get accepted?"
    }
  },

  // ========================================
  // SCHOLARSHIP SEARCH PAGE
  // ========================================
  scholarshipSearch: {
    hero: {
      title: "Scholarship Search",
      subtitle: "Find and apply to scholarships that match your profile. Explore thousands of opportunities for free.",
      searchPlaceholder: "Search Scholarships"
    }
  },

  // ========================================
  // HOME PAGE
  // ========================================
  homePage: {
    hero: {
      title: "Your Path to College Success Starts Here",
      subtitle: "Discover colleges, find scholarships, and plan your future with StudentSignal"
    }
  },

  // ========================================
  // COMMON TEXT
  // ========================================
  common: {
    buttons: {
      learnMore: "Learn More",
      getStarted: "Get Started",
      apply: "Apply Now",
      save: "Save",
      cancel: "Cancel"
    },
    labels: {
      loading: "Loading...",
      error: "Something went wrong",
      success: "Success!"
    }
  }
};

export default siteContent;
