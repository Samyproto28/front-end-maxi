/**
 * Formatters Utility
 *
 * This file contains formatting functions for dates, numbers, strings, and other data types.
 * Use these formatters to ensure consistent data presentation throughout the application.
 */

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format number with thousands separator
 * @param {number} number - Number to format
 * @param {number} decimals - Number of: 2)
 decimal places (defaultstring} locale - Locale for formatting ( * @param {default: 'en-US')
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number, decimals = 2, locale = 'en-US') => {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, options = {}, locale = 'en-US') => {
  if (!date) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
};

/**
 * Format date and time
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (date, locale = 'en-US') => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format time only
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted time string
 */
export const formatTime = (date, locale = 'en-US') => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'en-US')
 * @returns {string} - Formatted relative time string
 */
export const formatRelativeTime = (date, locale = 'en-US') => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (Math.abs(count) >= 1) {
      return rtf.format(-count, interval.unit);
    }
  }

  return 'just now';
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @param {string} format - Format pattern (default: '(XXX) XXX-XXXX')
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone, format = '(XXX) XXX-XXXX') => {
  if (!phone) return '';

  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Apply formatting pattern
  let formatted = format;
  let digitIndex = 0;

  formatted = formatted.replace(/X/g, () => {
    return cleaned[digitIndex++] || '';
  });

  return formatted;
};

/**
 * Format string to title case
 * @param {string} str - String to format
 * @returns {string} - Title case string
 */
export const formatTitleCase = (str) => {
  if (!str) return '';

  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Format string to sentence case
 * @param {string} str - String to format
 * @returns {string} - Sentence case string
 */
export const formatSentenceCase = (str) => {
  if (!str) return '';

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} - Truncated string
 */
export const truncateString = (str, maxLength, suffix = '...') => {
  if (!str) return '';
  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format file size to human readable string
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format number with Argentine locale (es-AR)
 * @param {number} numero - Number to format
 * @returns {string} - Formatted number with thousands separator
 */
export const formatNumero = (numero) => {
  if (numero === null || numero === undefined || isNaN(numero)) {
    return '';
  }

  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numero);
};

/**
 * Format percentage value
 * @param {number} valor - Percentage value (0-100)
 * @param {number} decimales - Number of decimal places (default: 2)
 * @returns {string} - Formatted percentage string
 */
export const formatPorcentaje = (valor, decimales = 2) => {
  if (valor === null || valor === undefined || isNaN(valor)) {
    return '';
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'percent',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales
  }).format(valor / 100);
};

/**
 * Format date with Argentine locale (es-AR)
 * @param {Date|string|number} fecha - Date to format
 * @returns {string} - Formatted date string (DD/MM/YYYY)
 */
export const formatFecha = (fecha) => {
  if (!fecha) return '';

  const dateObj = fecha instanceof Date ? fecha : new Date(fecha);

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Format time with Argentine locale (es-AR)
 * @param {Date|string|number} fecha - Date to format
 * @returns {string} - Formatted time string (HH:mm:ss)
 */
export const formatHora = (fecha) => {
  if (!fecha) return '';

  const dateObj = fecha instanceof Date ? fecha : new Date(fecha);

  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(dateObj);
};
