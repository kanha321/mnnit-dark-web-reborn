/**
 * Utility functions for file operations
 */
const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');

/**
 * Get the base directory for files
 * @returns {string} Absolute path to files directory
 */
function getFilesDir() {
  return path.join(__dirname, '../files');
}

/**
 * Check if a path is safe (no directory traversal)
 * @param {string} filePath - Path to check
 * @param {string} basePath - Base path that should contain filePath
 * @returns {boolean} True if path is safe
 */
function isPathSafe(filePath, basePath) {
  const resolvedPath = path.resolve(filePath);
  const resolvedBasePath = path.resolve(basePath);
  return resolvedPath.startsWith(resolvedBasePath);
}

/**
 * Get mime type for a file
 * @param {string} filePath - Path to file
 * @returns {string} Mime type
 */
function getMimeType(filePath) {
  return mime.lookup(filePath) || 'application/octet-stream';
}

/**
 * Format file info into a consistent structure
 * @param {string} absolutePath - Absolute path to file
 * @param {string} relativePath - Relative path from files directory
 * @returns {Object} Formatted file info
 */
async function formatFileInfo(absolutePath, relativePath) {
  const stats = await fs.stat(absolutePath);
  const isDirectory = stats.isDirectory();
  const name = path.basename(absolutePath);
  
  const fileInfo = {
    name,
    path: relativePath,
    isDirectory,
    size: stats.size,
    modified: stats.mtime.toISOString()
  };
  
  if (!isDirectory) {
    fileInfo.type = getMimeType(absolutePath);
  }
  
  return fileInfo;
}

module.exports = {
  getFilesDir,
  isPathSafe,
  getMimeType,
  formatFileInfo
};
