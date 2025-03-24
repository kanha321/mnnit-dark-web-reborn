/**
 * Cache status indicator
 * Shows a small indicator for the current caching status
 */

import { getCacheStats } from '../../../utils/cache-manager.js';

let updateInterval = null;
let statusElement = null;

// Initialize cache status
export function initCacheStatus() {
  // Create status element if debug mode is enabled
  if (window.localStorage.getItem('debugMode') === 'true') {
    createStatusElement();
    startStatusUpdates();
  }
}

// Create the status element
function createStatusElement() {
  // Check if it already exists
  if (document.getElementById('cache-status')) return;
  
  // Create container element
  statusElement = document.createElement('div');
  statusElement.id = 'cache-status';
  statusElement.className = 'cache-status';
  statusElement.style.cssText = `
    position: fixed;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    z-index: 9999;
    opacity: 0.7;
    transition: opacity 0.2s;
    font-family: monospace;
  `;
  
  // Add hover effect
  statusElement.addEventListener('mouseenter', () => {
    statusElement.style.opacity = '1';
  });
  
  statusElement.addEventListener('mouseleave', () => {
    statusElement.style.opacity = '0.7';
  });
  
  // Append to document body
  document.body.appendChild(statusElement);
}

// Start status updates
function startStatusUpdates() {
  // Clear any existing interval
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  
  // Update immediately and then periodically
  updateStatus();
  updateInterval = setInterval(updateStatus, 1000);
}

// Update the status element with current cache stats
function updateStatus() {
  if (!statusElement) return;
  
  const stats = getCacheStats();
  
  // Format cache size in KB
  const formatCacheSize = (size) => {
    if (size === 0) return '0';
    // Assuming average text file size is 2KB
    return `~${Math.round(size * 2)}KB`;
  };
  
  // Create status text
  let statusText = `📦 Cache: ${stats.cacheSize}/${stats.totalRequested} files (${formatCacheSize(stats.cacheSize)})`;
  
  // Add hit/miss ratio if there are any accesses
  const totalAccesses = stats.hits + stats.misses;
  if (totalAccesses > 0) {
    const hitRatio = Math.round((stats.hits / totalAccesses) * 100);
    statusText += ` | ${hitRatio}% hit`;
  }
  
  // Add activity status
  if (stats.active) {
    if (stats.paused) {
      statusText += ' | ⏸️ Paused';
    } else {
      statusText += ' | 🔄 Active';
    }
    statusText += ` (${stats.queueSize} queued)`;
  } else {
    statusText += ' | ✅ Done';
  }
  
  statusElement.textContent = statusText;
}

// Show cache status element (for external use)
export function showCacheStatus() {
  if (!statusElement) {
    createStatusElement();
  }
  statusElement.style.display = 'block';
  
  if (!updateInterval) {
    startStatusUpdates();
  }
}

// Hide cache status element (for external use)
export function hideCacheStatus() {
  if (statusElement) {
    statusElement.style.display = 'none';
  }
  
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}
