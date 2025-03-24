/**
 * API utility functions for making requests to the backend
 */

import { logApiRequest, logApiResponse, logApiError, createApiTimer } from './api-debug.js';
import { createHttpError, handleApiError } from './error-handler.js';
import { setLoadingState, createOperationKey } from './api-loading.js';

// Base URL for API endpoints - use explicit development URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @param {string} operationKey - Key for tracking loading state
 * @returns {Promise<any>} Response data
 */
async function fetchAPI(endpoint, options = {}, operationKey) {
    const method = options.method || 'GET';
    const timer = createApiTimer();
    
    // Set loading state if operation key provided
    if (operationKey) {
        setLoadingState(operationKey, true);
    }
    
    // Ensure endpoint doesn't start with a slash when combining with base URL
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    const url = `${API_BASE_URL}/${normalizedEndpoint}`;
    
    try {
        // Log the request with full URL for debugging
        logApiRequest(method, url, options);
        
        // Start timer
        timer.start();
        
        // Make the request with the full URL
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        // End timer
        const duration = timer.end();
        
        // Handle non-OK responses
        if (!response.ok) {
            const error = await createHttpError(response);
            logApiError(method, endpoint, error, duration);
            throw error;
        }
        
        // Parse and return the response
        const data = await response.json();
        logApiResponse(method, endpoint, data, duration);
        return data;
    } catch (error) {
        // Handle errors
        handleApiError(error, `${method} ${endpoint}`);
        throw error;
    } finally {
        // Reset loading state
        if (operationKey) {
            setLoadingState(operationKey, false);
        }
    }
}

/**
 * Get file listing for a directory
 * @param {string} path - Directory path to list
 * @returns {Promise<Array>} List of files and directories
 */
export async function getFileList(path = '/') {
    const operationKey = createOperationKey('list', 'files', path);
    return fetchAPI(`/files?path=${encodeURIComponent(path)}`, {}, operationKey);
}

/**
 * Get details for a specific file
 * @param {string} filePath - Path to the file
 * @returns {Promise<object>} File details
 */
export async function getFileDetails(filePath) {
    const operationKey = createOperationKey('get', 'file_details', filePath);
    return fetchAPI(`/files/details?path=${encodeURIComponent(filePath)}`, {}, operationKey);
}

/**
 * Get content of a text file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} File content
 */
export async function getFileContent(filePath) {
    const operationKey = createOperationKey('get', 'file_content', filePath);
    const response = await fetchAPI(`/files/content?path=${encodeURIComponent(filePath)}`, {}, operationKey);
    return response.content;
}

/**
 * Upload a file to the server
 * @param {File} file - File object to upload
 * @param {string} destination - Destination directory path
 * @returns {Promise<object>} Upload result
 */
export async function uploadFile(file, destination = '/') {
    const operationKey = createOperationKey('upload', 'file', file.name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination', destination);
    
    setLoadingState(operationKey, true);
    
    try {
        logApiRequest('POST', '/files/upload', { file: file.name, destination });
        
        const timer = createApiTimer();
        timer.start();
        
        const response = await fetch(`${API_BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData,
        });
        
        const duration = timer.end();
        
        if (!response.ok) {
            const error = await createHttpError(response);
            logApiError('POST', '/files/upload', error, duration);
            throw error;
        }
        
        const data = await response.json();
        logApiResponse('POST', '/files/upload', data, duration);
        return data;
    } catch (error) {
        handleApiError(error, `upload file ${file.name}`);
        throw error;
    } finally {
        setLoadingState(operationKey, false);
    }
}

/**
 * Download a file by opening it in a new tab or triggering browser download
 * @param {string} filePath - Path to the file
 */
export function downloadFile(filePath) {
  // Create the download URL
  const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const downloadUrl = `${API_BASE_URL}/files/download?path=${encodeURIComponent(filePath)}`;
  
  // Log the download attempt
  logApiRequest('GET', 'Download File', { path: filePath, url: downloadUrl });
  
  // Create a hidden anchor element to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = filePath.split('/').pop(); // Extract filename from path
  downloadLink.target = '_blank'; // Open in new tab (fallback behavior)
  
  // Append to body, click, and remove
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  return downloadUrl; // Return the URL for potential further use
}

// Export additional utilities for advanced usage
export { setLoadingState, isLoading } from './api-loading.js';
export { handleApiError } from './error-handler.js';
