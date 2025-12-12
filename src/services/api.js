/**
 * Base API service using Axios
 * Singleton pattern for consistent configuration across the application
 *
 * This service provides:
 * - Automatic token injection from localStorage/sessionStorage
 * - Centralized error handling for HTTP responses
 * - Configurable baseURL from environment variables
 */

import axios from 'axios';

// Create singleton instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor: Add auth tokens automatically
api.interceptors.request.use(
  config => {
    // Try to get token from localStorage or sessionStorage
    // Checks multiple common token key names for flexibility
    const token = localStorage.getItem('token') ||
                  sessionStorage.getItem('token') ||
                  localStorage.getItem('authToken') ||
                  sessionStorage.getItem('authToken') ||
                  localStorage.getItem('accessToken') ||
                  sessionStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    // Handle request interceptor errors
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors centrally
api.interceptors.response.use(
  response => {
    // Successful response - return as-is
    return response;
  },
  error => {
    // Handle specific HTTP error statuses

    // 422: Validation Errors (Laravel format)
    if (error.response?.status === 422) {
      // Return structured validation errors for form handling
      return Promise.reject(error.response.data);
    }

    // 404: Not Found
    if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config?.url);
      return Promise.reject(error);
    }

    // 500: Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data || error.message);
      return Promise.reject(error);
    }

    // Other errors - return as-is for component-level handling
    return Promise.reject(error);
  }
);

// Export singleton instance
export default api;
