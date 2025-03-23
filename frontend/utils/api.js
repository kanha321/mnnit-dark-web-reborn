/**
 * API utility functions for making requests to the backend
 */

// Base URL for API endpoints
const API_BASE_URL = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// File listing API
async function getFileList(path = '/') {
    return fetchAPI(`/files?path=${encodeURIComponent(path)}`);
}

// File details API
async function getFileDetails(filePath) {
    return fetchAPI(`/files/details?path=${encodeURIComponent(filePath)}`);
}

// File upload API
async function uploadFile(file, destination = '/') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('destination', destination);
    
    return fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type here, it will be set automatically with boundary
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
        }
        return response.json();
    });
}

// Export the API functions
export {
    getFileList,
    getFileDetails,
    uploadFile
};
