/**
 * Error handling utilities for the application
 */

import { showToast } from './dom.js';

/**
 * Handle API errors consistently
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 * @param {boolean} [showToastMessage=true] - Whether to show a toast message
 * @param {function} [customHandler] - Optional custom handler function
 * @returns {Error} The original error for chaining
 */
export function handleApiError(error, operation, showToastMessage = true, customHandler) {
  // Log the error
  console.error(`API Error during ${operation}:`, error);
  
  // Extract message - handle both Error objects and response error objects
  let errorMessage = error.message;
  
  // If this is a response with error property
  if (error.error) {
    errorMessage = error.error;
  }
  
  // Show toast if requested
  if (showToastMessage) {
    showToast(`Error: ${errorMessage}`, 'error');
  }
  
  // Run custom handler if provided
  if (customHandler && typeof customHandler === 'function') {
    try {
      customHandler(error);
    } catch (handlerError) {
      console.error('Error in custom error handler:', handlerError);
    }
  }
  
  // Return the original error for further handling/chaining
  return error;
}

/**
 * Create an error message from an HTTP error
 * @param {Response} response - Fetch Response object
 * @returns {Promise<Error>} Error with context
 */
export async function createHttpError(response) {
  let errorMessage = `HTTP error ${response.status}`;
  
  try {
    // Try to extract more detailed error info from response
    const errorData = await response.json();
    if (errorData && errorData.error) {
      errorMessage = errorData.error;
    }
  } catch (e) {
    // If we can't parse JSON, use status text
    errorMessage = `${errorMessage}: ${response.statusText}`;
  }
  
  const error = new Error(errorMessage);
  error.status = response.status;
  error.response = response;
  return error;
}
