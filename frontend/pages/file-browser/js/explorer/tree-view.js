/**
 * Tree view implementation - Clean implementation
 */

import { getFileList } from '../../../../utils/api.js';
import { showToast } from '../../../../utils/dom.js';
import { state } from '../main.js';
import { createFileItem } from './file-handlers.js';
import { updateBreadcrumbs } from './navigation.js';
import { getPathDepth } from './utils.js';
import { getFolderIconByName } from '../utils.js';

// Track expanded folders
export const expandedFolders = new Set(['/']); // Root is expanded by default

// Initialize tree view
export function initTreeView() {
  // Add event listener for breadcrumb navigation
  const breadcrumbsEl = document.getElementById('breadcrumbs');
  if (breadcrumbsEl) {
    breadcrumbsEl.addEventListener('click', event => {
      const breadcrumbItem = event.target.closest('.breadcrumb-item');
      if (breadcrumbItem) {
        const path = breadcrumbItem.getAttribute('data-path');
        loadFilesTree(path);
      }
    });
  }
}

// Load files in a tree structure
export async function loadFilesTree(rootPath = '/') {
  const fileListEl = document.getElementById('file-list');
  if (!fileListEl) return;

  try {
    // Show loading state
    fileListEl.classList.add('loading');
    fileListEl.innerHTML = '<div class="loading-indicator">Loading files...</div>';
    
    // Load files
    const rootFiles = await getFileList(rootPath);
    
    // Update state
    state.currentPath = rootPath;
    state.currentFiles = rootFiles;
    
    // Update UI
    updateBreadcrumbs();
    renderFileTree(rootFiles, rootPath, fileListEl);
    updatePageTitle(rootPath);
    updatePathHistory(rootPath);
    
  } catch (error) {
    handleLoadError(error, fileListEl);
  } finally {
    fileListEl.classList.remove('loading');
  }
}

// Render the file tree
export function renderFileTree(files, parentPath, container) {
  // Clear container and handle empty state
  container.innerHTML = '';
  
  if (files.length === 0) {
    container.innerHTML = '<div class="empty-folder">This folder is empty</div>';
    return;
  }
  
  // Sort and render files
  const sortedFiles = sortFilesForTree(files);
  
  sortedFiles.forEach((file, index) => {
    // Create container for the file item
    const fileItemContainer = document.createElement('div');
    fileItemContainer.className = 'file-tree-item-container';
    fileItemContainer.setAttribute('data-path', file.path);
    fileItemContainer.style.animationDelay = `${index * 0.02}s`;
    
    // Create the file item with correct indentation
    const level = getPathDepth(file.path) - 1;
    const fileItem = createFileItem(file, level);
    fileItemContainer.appendChild(fileItem);
    
    // Add to container
    container.appendChild(fileItemContainer);
    
    // For directories, create children container
    if (file.isDirectory) {
      createFolderChildrenContainer(fileItemContainer, file, fileItem);
    }
  });
}

// Create the children container for a folder
function createFolderChildrenContainer(fileItemContainer, file, fileItem) {
  const childrenContainer = document.createElement('div');
  childrenContainer.className = 'folder-children';
  childrenContainer.style.display = 'none';
  childrenContainer.setAttribute('data-parent', file.path);
  fileItemContainer.appendChild(childrenContainer);
  
  // If folder is already expanded, load its children
  if (expandedFolders.has(file.path)) {
    toggleFolder(file, fileItem, true);
  }
}

// Toggle folder expansion with clean animations
export async function toggleFolder(file, fileItemElement, forceExpand = null) {
  // Determine if we're expanding or collapsing
  const isExpanded = forceExpand !== null ? !forceExpand : expandedFolders.has(file.path);
  
  // Get necessary elements
  const fileItemContainer = fileItemElement.closest('.file-tree-item-container');
  const childrenContainer = fileItemContainer?.querySelector('.folder-children');
  const toggleIcon = fileItemElement.querySelector('.folder-toggle');
  const fileIcon = fileItemElement.querySelector('.file-icon');
  
  if (!childrenContainer) return;
  
  // Remove any existing animation classes
  childrenContainer.classList.remove('sliding-down', 'sliding-up');
  
  if (isExpanded) {
    // COLLAPSE FOLDER
    collapseFolder(file, fileItemElement, childrenContainer, toggleIcon, fileIcon);
  } else {
    // EXPAND FOLDER
    expandFolder(file, fileItemElement, childrenContainer, toggleIcon, fileIcon);
  }
}

// Handle folder collapse animation
function collapseFolder(file, fileItemElement, childrenContainer, toggleIcon, fileIcon) {
  // Update state
  fileItemElement.classList.add('closing');
  expandedFolders.delete(file.path);
  
  // Update icons
  if (toggleIcon) toggleIcon.classList.remove('expanded');
  if (fileIcon) fileIcon.innerHTML = getFolderIconByName(file.name, false);
  
  // Apply animation
  childrenContainer.classList.add('sliding-up');
  childrenContainer.classList.remove('expanding');
  
  // Handle animation end
  const onAnimationEnd = () => {
    childrenContainer.style.display = 'none';
    childrenContainer.classList.remove('sliding-up');
    fileItemElement.classList.remove('closing');
    childrenContainer.removeEventListener('animationend', onAnimationEnd);
  };
  
  childrenContainer.addEventListener('animationend', onAnimationEnd);
}

// Handle folder expansion animation
async function expandFolder(file, fileItemElement, childrenContainer, toggleIcon, fileIcon) {
  // Update state
  fileItemElement.classList.add('opening');
  expandedFolders.add(file.path);
  
  // Update icons
  if (toggleIcon) toggleIcon.classList.add('expanded');
  if (fileIcon) fileIcon.innerHTML = getFolderIconByName(file.name, true);
  
  // Check if we need to load children
  if (childrenContainer.children.length === 0) {
    await loadFolderChildren(file, childrenContainer);
  } else {
    // Just show existing children with animation
    showFolderChildren(childrenContainer);
  }
  
  // Handle animation end
  const onAnimationEnd = () => {
    childrenContainer.classList.remove('sliding-down');
    fileItemElement.classList.remove('opening');
    childrenContainer.removeEventListener('animationend', onAnimationEnd);
  };
  
  childrenContainer.addEventListener('animationend', onAnimationEnd);
}

// Load folder children
async function loadFolderChildren(file, childrenContainer) {
  // Show loading indicator
  childrenContainer.innerHTML = '<div class="loading-indicator-small">Loading contents</div>';
  childrenContainer.style.display = 'block';
  
  try {
    // Load children
    const childFiles = await getFileList(file.path);
    
    // Clear loading indicator
    childrenContainer.innerHTML = '';
    
    // Create child items
    renderFileTree(childFiles, file.path, childrenContainer);
    
    // Apply animation
    setTimeout(() => {
      childrenContainer.classList.add('sliding-down', 'expanding');
    }, 20);
    
  } catch (error) {
    console.error(`Failed to load children for ${file.path}:`, error);
    childrenContainer.innerHTML = '<div class="error-message-small">Failed to load contents</div>';
  }
}

// Show existing folder children with animation
function showFolderChildren(childrenContainer) {
  childrenContainer.style.display = 'block';
  childrenContainer.classList.add('sliding-down', 'expanding');
}

// Sort files for tree view (folders first, then files alphabetically)
export function sortFilesForTree(files) {
  const folders = files.filter(file => file.isDirectory);
  const regularFiles = files.filter(file => !file.isDirectory);
  
  folders.sort((a, b) => a.name.localeCompare(b.name));
  regularFiles.sort((a, b) => a.name.localeCompare(b.name));
  
  return [...folders, ...regularFiles];
}

// Update the page title based on the current path
function updatePageTitle(path) {
  document.title = `${path === '/' ? 'Root' : path.split('/').pop()} - MNNIT Dark Web`;
}

// Update path history for navigation
function updatePathHistory(path) {
  if (!state.pathHistory.includes(path)) {
    state.pathHistory.push(path);
  }
}

// Handle loading errors
function handleLoadError(error, container) {
  console.error('Failed to load files:', error);
  showToast(`Failed to load files: ${error.message}`, 'error');
  
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <p>Failed to load files</p>
        <p class="error-details">${error.message}</p>
        <button class="md-button" onclick="window.location.reload()">Retry</button>
      </div>
    `;
  }
}
