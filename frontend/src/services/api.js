import axios from 'axios';

// Get backend URL from environment variable
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Colleges API calls
export const collegesAPI = {
  getColleges: async (params = {}) => {
    const response = await api.get('/api/colleges', { params });
    const data = response.data;
    // Transform snake_case to camelCase
    if (data.colleges) {
      data.colleges = toCamelCase(data.colleges);
    }
    return data;
  },
  
  getCollege: async (id) => {
    const response = await api.get(`/api/colleges/${id}`);
    return toCamelCase(response.data);
  },
  
  saveCollege: async (collegeId) => {
    const response = await api.post('/api/users/saved-colleges', {
      item_id: collegeId,
      item_type: 'college',
    });
    return response.data;
  },
  
  unsaveCollege: async (collegeId) => {
    const response = await api.delete(`/api/users/saved-colleges/${collegeId}`);
    return response.data;
  },
  
  getSavedColleges: async () => {
    const response = await api.get('/api/users/saved-colleges');
    return response.data;
  },
};

// Scholarships API calls
export const scholarshipsAPI = {
  getScholarships: async (params = {}) => {
    const response = await api.get('/api/scholarships', { params });
    const data = response.data;
    // Transform snake_case to camelCase
    if (data.scholarships) {
      data.scholarships = toCamelCase(data.scholarships);
    }
    return data;
  },
  
  getScholarship: async (id) => {
    const response = await api.get(`/api/scholarships/${id}`);
    return toCamelCase(response.data);
  },
  
  saveScholarship: async (scholarshipId) => {
    const response = await api.post('/api/users/saved-scholarships', {
      item_id: scholarshipId,
      item_type: 'scholarship',
    });
    return response.data;
  },
  
  unsaveScholarship: async (scholarshipId) => {
    const response = await api.delete(`/api/users/saved-scholarships/${scholarshipId}`);
    return response.data;
  },
  
  getSavedScholarships: async () => {
    const response = await api.get('/api/users/saved-scholarships');
    return response.data;
  },
};

export default api;
