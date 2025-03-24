/**
 * Debug utilities for API requests
 * Helps with logging and troubleshooting API calls
 */

// Configuration for API debugging
const DEBUG_CONFIG = {
  enabled: true,  // Master toggle for debug logging
  logRequests: true,  // Log outgoing requests
  logResponses: true, // Log incoming responses
  logErrors: true,    // Log errors in detail
  timeRequests: true  // Time request duration
};

/**
 * Log API request if debugging is enabled
 * @param {string} method - HTTP method 
 * @param {string} endpoint - API endpoint being called
 * @param {object} options - Request options
 */
export function logApiRequest(method, endpoint, options) {
  if (!DEBUG_CONFIG.enabled || !DEBUG_CONFIG.logRequests) return;
  
  console.group(`🔄 API Request: ${method} ${endpoint}`);
  console.log('Options:', options);
  console.groupEnd();
}

/**
 * Log API response if debugging is enabled
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint called
 * @param {object} data - Response data
 * @param {number} duration - Request duration in ms
 */
export function logApiResponse(method, endpoint, data, duration) {
  if (!DEBUG_CONFIG.enabled || !DEBUG_CONFIG.logResponses) return;
  
  console.group(`✅ API Response: ${method} ${endpoint} (${duration}ms)`);
  console.log('Data:', data);
  console.groupEnd();
}

/**
 * Log API error if debugging is enabled
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint called
 * @param {Error} error - Error object
 * @param {number} duration - Request duration in ms
 */
export function logApiError(method, endpoint, error, duration) {
  if (!DEBUG_CONFIG.enabled || !DEBUG_CONFIG.logErrors) return;
  
  console.group(`❌ API Error: ${method} ${endpoint} (${duration}ms)`);
  console.error('Error:', error);
  console.trace('Stack trace:');
  console.groupEnd();
}

/**
 * Create timing functions for measuring API request duration
 * @returns {object} Object with start and end timing functions
 */
export function createApiTimer() {
  if (!DEBUG_CONFIG.enabled || !DEBUG_CONFIG.timeRequests) {
    return { 
      start: () => {}, 
      end: () => 0 
    };
  }
  
  const startTime = performance.now();
  return {
    start: () => {},
    end: () => Math.round(performance.now() - startTime)
  };
}
