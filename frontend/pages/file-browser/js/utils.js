/**
 * Shared utilities for the file browser
 */

import { getFileIcon as getNerdFileIcon, getFolderIcon } from '../../../utils/icons.js';

// Format file size in human-readable format
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

// Get an appropriate icon for the file type using Nerd Font
export function getFileIcon(filename) {
  return getNerdFileIcon(filename);
}

// Get an appropriate icon for a folder
export function getFolderIconByName(folderName, isOpen = false) {
  return getFolderIcon(folderName, isOpen);
}
