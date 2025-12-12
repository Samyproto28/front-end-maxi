/**
 * Constants Utility
 *
 * This file contains application-wide constants including API endpoints,
 * configuration values, status codes, and other shared constants.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// ============================================
// ELECTORAL DOMAIN CONSTANTS
// ============================================

/**
 * Cargos electorales disponibles en el sistema
 * Representa los diferentes tipos de cargos electivos en Argentina
 */
export const CARGOS = Object.freeze({
  DIPUTADOS: 'DIPUTADOS',
  SENADORES: 'SENADORES'
});

/**
 * Estados posibles de un telegrama en el sistema
 * Flujo: PENDIENTE → EN_PROCESO → VALIDADO | RECHAZADO
 */
export const ESTADOS_TELEGRAMA = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  VALIDADO: 'VALIDADO',
  RECHAZADO: 'RECHAZADO'
});

/**
 * Estados posibles de una mesa de votación
 * Ciclo: ABIERTA → CERRADA → EN_ESCRUTINIO → FINALIZADA
 */
export const ESTADOS_MESA = Object.freeze({
  ABIERTA: 'ABIERTA',
  CERRADA: 'CERRADA',
  EN_ESCRUTINIO: 'EN_ESCRUTINIO',
  FINALIZADA: 'FINALIZADA'
});

/**
 * Tipos de voto reconocidos por el sistema electoral
 */
export const TIPOS_VOTO = Object.freeze({
  LISTA: 'LISTA',
  BLANCO: 'BLANCO',
  NULO: 'NULO',
  RECURRIDO: 'RECURRIDO'
});

/**
 * Roles de usuario en el sistema
 * Determina permisos y acceso a funcionalidades
 */
export const ROLES_USUARIO = Object.freeze({
  ADMIN: 'ADMIN',
  FISCAL: 'FISCAL',
  OPERADOR: 'OPERADOR',
  CONSULTA: 'CONSULTA'
});

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

// Common Status Values
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DELETED: 'deleted'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  MODERATOR: 'moderator'
};

// Permission Levels
export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  ADMIN: 'admin'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'user_preferences'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s-()]+$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHA: /^[a-zA-Z]+$/,
  NUMERIC: /^\d+$/
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Date Formats
export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  US: 'MM/DD/YYYY',
  EU: 'DD/MM/YYYY',
  FULL: 'MMMM DD, YYYY',
  SHORT: 'MMM DD, YYYY',
  TIME: 'HH:mm:ss',
  DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
  RELATIVE: 'relative'
};

// Time Zones
export const TIMEZONES = {
  UTC: 'UTC',
  EST: 'America/New_York',
  PST: 'America/Los_Angeles',
  GMT: 'Europe/London',
  CET: 'Europe/Berlin'
};

// Validation Rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  XS: 480,
  SM: 768,
  MD: 1024,
  LG: 1280,
  XL: 1920
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Sort Directions
export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
};

// Form Field Types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TELEPHONE: 'tel',
  URL: 'url',
  DATE: 'date',
  DATETIME: 'datetime-local',
  TIME: 'time',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file',
  IMAGE: 'image'
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#06b6d4',
  LIGHT: '#f3f4f6',
  DARK: '#1f2937'
};

// API Endpoints (to be customized based on actual API)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: '/users/profile'
  },
  DATA: {
    BASE: '/data',
    BY_ID: (id) => `/data/${id}`,
    SEARCH: '/data/search'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  SENT: 'Sent successfully',
  LOADED: 'Loaded successfully'
};
