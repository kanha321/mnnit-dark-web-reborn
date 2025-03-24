/**
 * API loading state management
 * Tracks loading states for different API operations
 */

// Loading state store for API operations
const loadingStates = {};

/**
 * Set loading state for a specific operation
 * @param {string} operationKey - Unique key for the operation
 * @param {boolean} isLoading - Whether the operation is loading
 */
export function setLoadingState(operationKey, isLoading) {
  loadingStates[operationKey] = isLoading;
  notifyLoadingStateListeners(operationKey, isLoading);
}

// Listeners for loading state changes
const loadingStateListeners = {};

/**
 * Subscribe to loading state changes for a specific operation
 * @param {string} operationKey - The operation key to listen for
 * @param {function} callback - Function to call when loading state changes
 * @returns {function} Unsubscribe function
 */
export function subscribeToLoadingState(operationKey, callback) {
  if (!loadingStateListeners[operationKey]) {
    loadingStateListeners[operationKey] = new Set();
  }
  
  loadingStateListeners[operationKey].add(callback);
  
  // Immediately notify with current state
  const currentState = loadingStates[operationKey] || false;
  callback(currentState);
  
  // Return unsubscribe function
  return () => {
    if (loadingStateListeners[operationKey]) {
      loadingStateListeners[operationKey].delete(callback);
    }
  };
}

/**
 * Notify all listeners for a specific operation
 * @param {string} operationKey - The operation key
 * @param {boolean} isLoading - Current loading state
 */
function notifyLoadingStateListeners(operationKey, isLoading) {
  if (loadingStateListeners[operationKey]) {
    for (const listener of loadingStateListeners[operationKey]) {
      try {
        listener(isLoading);
      } catch (error) {
        console.error('Error in loading state listener:', error);
      }
    }
  }
}

/**
 * Check if an operation is currently loading
 * @param {string} operationKey - The operation key to check
 * @returns {boolean} Whether the operation is loading
 */
export function isLoading(operationKey) {
  return loadingStates[operationKey] || false;
}

/**
 * Create standard operation keys for common API operations
 * @param {string} type - Operation type (list, get, create, etc.)
 * @param {string} resource - Resource being operated on (files, users, etc.)
 * @param {string} [id] - Optional identifier for specific resource
 * @returns {string} Formatted operation key
 */
export function createOperationKey(type, resource, id) {
  return id ? `${type}_${resource}_${id}` : `${type}_${resource}`;
}
