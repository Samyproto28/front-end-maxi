/**
 * Helpers Utility
 *
 * This file contains helper functions for common operations such as file downloads,
 * debouncing, data manipulation, and sorting.
 */

/**
 * Download a Blob as a file
 * @param {Blob} blob - The blob containing the file data
 * @param {string} filename - The name for the downloaded file
 */
export const downloadBlob = (blob, filename) => {
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Programmatically trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up: remove the link and revoke the URL
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Debounce function to limit the rate of function execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {Function} - Debounced function
 */
export const debounce = (fn, delay = 300) => {
  let timeoutId;

  return function (...args) {
    // Clear the previous timeout
    clearTimeout(timeoutId);

    // Set a new timeout
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * Group an array of objects by a specific key
 * @param {Array} array - Array of objects to group
 * @param {string} key - Property name to group by
 * @returns {Object} - Object with grouped arrays
 */
export const groupBy = (array, key) => {
  return array.reduce((acc, item) => {
    const group = item[key];
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Sort an array of objects by a specific key
 * @param {Array} array - Array of objects to sort
 * @param {string} key - Property name to sort by
 * @param {string} order - Sort order: 'asc' for ascending, 'desc' for descending (default: 'asc')
 * @returns {Array} - New sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  // Create a copy of the array to avoid mutating the original
  const sortedArray = [...array];

  return sortedArray.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};
