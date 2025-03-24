/**
 * Cache Manager
 * Handles background caching of file contents to make previews instant
 */

import { getFileList, getFileContent } from './api.js';
import { isTextFile } from './file-utils.js';

// In-memory cache for file contents
const fileContentCache = new Map();
const pendingRequests = new Map();
const visitedDirectories = new Set();
const enqueuedPaths = new Set();

// Queue for level-by-level traversal
let cachingQueue = [];
let isCachingActive = false;
let cachingPaused = false;

// Cache stats for monitoring
const cacheStats = {
  totalCached: 0,
  totalRequested: 0,
  hits: 0,
  misses: 0,
  errors: 0
};

/**
 * Initialize cache system
 */
export function initCacheManager() {
  console.log('Initializing file content cache system');
  
  // Listen for visibility change to pause/resume caching
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      pauseCaching();
    } else if (document.visibilityState === 'visible') {
      resumeCaching();
    }
  });
  
  // Listen for online/offline events
  window.addEventListener('online', resumeCaching);
  window.addEventListener('offline', pauseCaching);
  
  // Clear any existing cache state
  resetCacheState();
}

/**
 * Reset the cache state
 */
function resetCacheState() {
  fileContentCache.clear();
  pendingRequests.clear();
  visitedDirectories.clear();
  enqueuedPaths.clear();
  cachingQueue = [];
  isCachingActive = false;
  cachingPaused = false;
  
  // Reset stats
  cacheStats.totalCached = 0;
  cacheStats.totalRequested = 0;
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  cacheStats.errors = 0;
}

/**
 * Start background caching from a root path
 * @param {string} rootPath - Starting directory path
 */
export function startBackgroundCaching(rootPath = '/') {
  if (isCachingActive) {
    console.log('Background caching already running');
    return;
  }
  
  console.log('Starting background caching from:', rootPath);
  isCachingActive = true;
  cachingPaused = false;
  
  // Add root path as the first level to process
  enqueuePath(rootPath, 0);
  
  // Start the background caching process with a small delay
  setTimeout(() => {
    processNextCacheLevel();
  }, 1000);
}

/**
 * Add a path to the caching queue if not already added
 * @param {string} dirPath - Directory path
 * @param {number} level - Nesting level
 */
function enqueuePath(dirPath, level) {
  const key = `${dirPath}:${level}`;
  if (!enqueuedPaths.has(key)) {
    cachingQueue.push({ path: dirPath, level });
    enqueuedPaths.add(key);
  }
}

/**
 * Process the next level of directories in the cache queue
 */
async function processNextCacheLevel() {
  // Exit if queue is empty or caching is paused
  if (cachingQueue.length === 0 || !isCachingActive || cachingPaused) {
    if (cachingQueue.length === 0) {
      console.log('Background caching completed');
      isCachingActive = false;
    }
    return;
  }
  
  // Find all items at the current level (lowest level number)
  let minLevel = Number.MAX_SAFE_INTEGER;
  for (const item of cachingQueue) {
    if (item.level < minLevel) {
      minLevel = item.level;
    }
  }
  
  const currentLevelItems = cachingQueue.filter(item => item.level === minLevel);
  cachingQueue = cachingQueue.filter(item => item.level !== minLevel);
  
  console.log(`Caching level ${minLevel} - ${currentLevelItems.length} directories`);
  
  // Process each directory at this level
  try {
    for (const item of currentLevelItems) {
      if (visitedDirectories.has(item.path)) continue;
      visitedDirectories.add(item.path);
      
      await cacheDirectoryContents(item.path, item.level);
      
      // Small delay between directories to avoid overloading
      await idlePause(200);
    }
    
    // After current level is done, schedule the next level with a short delay
    setTimeout(() => {
      processNextCacheLevel();
    }, 500);
  } catch (error) {
    console.error('Error in background caching:', error);
    
    // Try to recover by continuing with the next level after a longer delay
    setTimeout(() => {
      processNextCacheLevel();
    }, 5000);
  }
}

/**
 * Cache contents of a directory
 * @param {string} dirPath - Directory path to cache
 * @param {number} currentLevel - Current nesting level
 */
async function cacheDirectoryContents(dirPath, currentLevel) {
  try {
    const files = await getFileList(dirPath);
    
    // First queue the next level of directories
    const directories = files.filter(file => file.isDirectory);
    directories.forEach(dir => {
      enqueuePath(dir.path, currentLevel + 1);
    });
    
    // Then cache the contents of text files in this directory
    const textFiles = files.filter(file => !file.isDirectory && isTextFile(file.name));
    
    for (const file of textFiles) {
      // Skip if already cached or pending
      if (fileContentCache.has(file.path) || pendingRequests.has(file.path)) continue;
      
      // Process files with lower priority using idle callback
      await idleFetch(() => cacheFileContent(file.path));
    }
  } catch (error) {
    console.error(`Failed to cache directory ${dirPath}:`, error);
    cacheStats.errors++;
  }
}

/**
 * Schedule work during idle periods
 * @param {number} ms - Maximum time to wait in milliseconds
 * @returns {Promise} Resolves after operation completes
 */
function idlePause(ms = 100) {
  return new Promise(resolve => {
    if (window.requestIdleCallback) {
      // Use requestIdleCallback if available
      requestIdleCallback(resolve, { timeout: ms });
    } else {
      // Fall back to setTimeout
      setTimeout(resolve, ms);
    }
  });
}

/**
 * Execute a function during idle time
 * @param {Function} fn - Function to execute 
 * @returns {Promise} Result of the function
 */
function idleFetch(fn) {
  return new Promise(resolve => {
    if (window.requestIdleCallback) {
      requestIdleCallback(() => resolve(fn()), { timeout: 500 });
    } else {
      setTimeout(() => resolve(fn()), 0);
    }
  });
}

/**
 * Cache a specific file's content
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} Cached content
 */
async function cacheFileContent(filePath) {
  // Skip if already cached
  if (fileContentCache.has(filePath)) {
    return fileContentCache.get(filePath);
  }
  
  // Return existing promise if already being fetched
  if (pendingRequests.has(filePath)) {
    return pendingRequests.get(filePath);
  }
  
  cacheStats.totalRequested++;
  
  // Create a promise to fetch the content
  const contentPromise = getFileContent(filePath)
    .then(content => {
      // Store in cache
      fileContentCache.set(filePath, content);
      pendingRequests.delete(filePath);
      cacheStats.totalCached++;
      return content;
    })
    .catch(error => {
      pendingRequests.delete(filePath);
      cacheStats.errors++;
      console.warn(`Failed to cache content for ${filePath}:`, error);
      throw error;
    });
  
  // Store the promise in pending requests
  pendingRequests.set(filePath, contentPromise);
  return contentPromise;
}

/**
 * Get cached content for a file
 * @param {string} filePath - Path to file
 * @returns {string|null} Cached content or null if not cached
 */
export function getCachedContent(filePath) {
  if (fileContentCache.has(filePath)) {
    cacheStats.hits++;
    return fileContentCache.get(filePath);
  }
  cacheStats.misses++;
  return null;
}

/**
 * Get content with cache priority (use cache if available, otherwise fetch)
 * @param {string} filePath - Path to file
 * @returns {Promise<string>} File content
 */
export async function getContentWithCache(filePath) {
  // Return from cache if available
  if (fileContentCache.has(filePath)) {
    cacheStats.hits++;
    return fileContentCache.get(filePath);
  }
  
  // Return existing promise if request is already pending
  if (pendingRequests.has(filePath)) {
    return pendingRequests.get(filePath);
  }
  
  cacheStats.misses++;
  cacheStats.totalRequested++;
  
  // Fetch and cache the content
  const contentPromise = getFileContent(filePath)
    .then(content => {
      fileContentCache.set(filePath, content);
      pendingRequests.delete(filePath);
      cacheStats.totalCached++;
      return content;
    })
    .catch(error => {
      pendingRequests.delete(filePath);
      cacheStats.errors++;
      throw error;
    });
  
  pendingRequests.set(filePath, contentPromise);
  return contentPromise;
}

/**
 * Check if a file is cached
 * @param {string} filePath - Path to file
 * @returns {boolean} True if cached
 */
export function isContentCached(filePath) {
  return fileContentCache.has(filePath);
}

/**
 * Pause the background caching process
 */
export function pauseCaching() {
  console.log('Pausing background caching');
  cachingPaused = true;
}

/**
 * Resume the background caching process if it was paused
 */
export function resumeCaching() {
  if (cachingPaused && isCachingActive) {
    console.log('Resuming background caching');
    cachingPaused = false;
    processNextCacheLevel();
  }
}

/**
 * Add directory to caching queue with high priority
 * @param {string} dirPath - Directory path to prioritize
 */
export function prioritizeCachingForDirectory(dirPath) {
  // Skip if already visited
  if (visitedDirectories.has(dirPath)) return;
  
  // Add to front of queue to process next
  cachingQueue.unshift({ path: dirPath, level: 0 });
  enqueuedPaths.add(`${dirPath}:0`);
  
  // Start processing if not already active
  if (!isCachingActive && !cachingPaused) {
    isCachingActive = true;
    processNextCacheLevel();
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  return {
    ...cacheStats,
    cacheSize: fileContentCache.size,
    pendingRequests: pendingRequests.size,
    visitedDirs: visitedDirectories.size,
    queueSize: cachingQueue.length,
    active: isCachingActive,
    paused: cachingPaused
  };
}

/**
 * Clear cache for a specific path
 * @param {string} filePath - Path to clear from cache
 */
export function clearCacheFor(filePath) {
  fileContentCache.delete(filePath);
  pendingRequests.delete(filePath);
}
