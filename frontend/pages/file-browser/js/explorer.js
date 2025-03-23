/**
 * File explorer functionality
 */

import { getFileList } from '../../../utils/mock-api.js';
import { createElement, showToast } from '../../../utils/dom.js';
import { state } from './main.js';
import { openFileInEditor } from './editor.js';
import { handleFileHover, handleFileHoverEnd, isFileBeingPreviewed, convertPreviewToPermanent } from './hover-preview.js';
import { getFileIcon, getFolderIconByName } from './utils.js';
import { getUIIcon, setIcon } from '../../../utils/icons.js';

// Initialize the file explorer
export function initExplorer() {
  // Initial file listing
  loadFiles(state.currentPath);
  
  // Set up event listeners
  const pathUpBtn = document.getElementById('path-up');
  if (pathUpBtn) {
    pathUpBtn.addEventListener('click', navigateUp);
    
    // Initialize the up icon directly
    const upIconElement = pathUpBtn.querySelector('.icon-element');
    if (upIconElement) {
      upIconElement.textContent = getUIIcon('up');
    }
  }
  
  const refreshBtn = document.getElementById('refresh-files');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadFiles(state.currentPath));
    
    // Initialize the refresh icon directly
    const refreshIconElement = refreshBtn.querySelector('.icon-element');
    if (refreshIconElement) {
      refreshIconElement.textContent = getUIIcon('refresh');
    }
  }
  
  // Activity bar buttons
  const activityButtons = document.querySelectorAll('.activity-bar .icon-btn:not(#settings-button)');
  activityButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.activity-bar .icon-btn').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });
  
  // Breadcrumb navigation
  const breadcrumbsEl = document.getElementById('breadcrumbs');
  if (breadcrumbsEl) {
    breadcrumbsEl.addEventListener('click', handleBreadcrumbClick);
  }
}

// Load files from the specified path
export async function loadFiles(path) {
  try {
    const fileListEl = document.getElementById('file-list');
    if (fileListEl) {
      fileListEl.classList.add('loading');
      fileListEl.innerHTML = '<div class="loading-indicator">Loading files...</div>';
    }
    
    const files = await getFileList(path);
    state.currentFiles = files;
    state.currentPath = path;
    
    updateBreadcrumbs();
    renderFileExplorer(files);
    
    if (!state.pathHistory.includes(path)) {
      state.pathHistory.push(path);
    }
    
    document.title = `${path === '/' ? 'Root' : path.split('/').pop()} - MNNIT Dark Web`;
    
  } catch (error) {
    console.error('Failed to load files:', error);
    showToast(`Failed to load files: ${error.message}`, 'error');
    
    const fileListEl = document.getElementById('file-list');
    if (fileListEl) {
      fileListEl.innerHTML = `
        <div class="error-message">
          <p>Failed to load files</p>
          <p class="error-details">${error.message}</p>
          <button class="md-button" onclick="window.location.reload()">Retry</button>
        </div>
      `;
    }
  } finally {
    const fileListEl = document.getElementById('file-list');
    if (fileListEl) {
      fileListEl.classList.remove('loading');
    }
  }
}

// Render the file explorer
function renderFileExplorer(files) {
  const fileListEl = document.getElementById('file-list');
  if (!fileListEl) return;
  
  fileListEl.innerHTML = '';
  
  if (files.length === 0) {
    fileListEl.appendChild(
      createElement('div', { 
        className: 'empty-folder fade-in',
        textContent: 'This folder is empty'
      })
    );
    return;
  }
  
  // Group files by type (folders first, then files)
  const folders = files.filter(file => file.isDirectory);
  const regularFiles = files.filter(file => !file.isDirectory);
  
  // Sort alphabetically within each group
  folders.sort((a, b) => a.name.localeCompare(b.name));
  regularFiles.sort((a, b) => a.name.localeCompare(b.name));
  
  // Combine the groups
  const sortedFiles = [...folders, ...regularFiles];
  
  // Create the file list items
  sortedFiles.forEach((file, index) => {
    const fileItem = createFileExplorerItem(file);
    
    // Add a staggered animation class
    fileItem.classList.add('slide-in-right');
    fileItem.style.animationDelay = `${index * 0.03}s`;
    
    fileListEl.appendChild(fileItem);
  });
}

// Create a file explorer item - cleaner implementation
function createFileExplorerItem(file) {
  // Create the element with direct HTML for better performance
  const fileItem = document.createElement('div');
  fileItem.className = `file-item ${file.isDirectory ? 'directory' : 'file'}${
    state.activeFile?.path === file.path ? ' active' : ''
  }`;
  fileItem.setAttribute('data-path', file.path);
  
  // Use template literal for inner HTML - more readable and faster than multiple DOM operations
  fileItem.innerHTML = `
    <span class="file-icon">${file.isDirectory ? 
      getFolderIconByName(file.name) : 
      getFileIcon(file.name)}</span>
    <span class="file-name">${file.name}</span>
    <span class="file-download-icon">${getUIIcon('download')}</span>
  `;
  
  // Add click event handler
  fileItem.addEventListener('click', () => handleFileClick(file));
  
  // Add hover event handlers for files (not directories)
  if (!file.isDirectory) {
    fileItem.addEventListener('mouseenter', () => handleFileHover(file));
    fileItem.addEventListener('mouseleave', () => handleFileHoverEnd());
    
    // Add download click handler
    const downloadIcon = fileItem.querySelector('.file-download-icon');
    if (downloadIcon) {
      downloadIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent opening the file when clicking download
        handleFileDownload(file);
      });
    }
  }
  
  return fileItem;
}

// Update the breadcrumb navigation
function updateBreadcrumbs() {
  const breadcrumbs = document.getElementById('breadcrumbs');
  if (!breadcrumbs) return;
  
  breadcrumbs.innerHTML = '';
  
  const pathParts = state.currentPath === '/' ? [''] : state.currentPath.split('/').filter(Boolean);
  let currentPathBuildup = '';
  
  // Add root
  breadcrumbs.appendChild(
    createElement('span', {
      className: 'breadcrumb-item root',
      'data-path': '/',
      textContent: 'Home'
    })
  );
  
  // Add path parts
  pathParts.forEach((part) => {
    // Add separator
    breadcrumbs.appendChild(
      createElement('span', {
        className: 'breadcrumb-separator',
        textContent: '/'
      })
    );
    
    currentPathBuildup += `/${part}`;
    
    // Add path part
    breadcrumbs.appendChild(
      createElement('span', {
        className: 'breadcrumb-item',
        'data-path': currentPathBuildup,
        textContent: part
      })
    );
  });
}

// Handle breadcrumb click
function handleBreadcrumbClick(event) {
  const breadcrumbItem = event.target.closest('.breadcrumb-item');
  if (breadcrumbItem) {
    const path = breadcrumbItem.getAttribute('data-path');
    loadFiles(path);
  }
}

// Handle clicking on a file or folder
export function handleFileClick(file) {
  if (file.isDirectory) {
    // Add a subtle animation before loading the directory
    const explorer = document.querySelector('.file-explorer');
    explorer.classList.add('pulse');
    
    setTimeout(() => {
      loadFiles(file.path);
      explorer.classList.remove('pulse');
    }, 150);
  } else {
    // Check if the file is being previewed and convert it to permanent
    if (isFileBeingPreviewed(file.path)) {
      convertPreviewToPermanent();
    } else {
      // Open the file in the editor as a permanent tab (original behavior)
      openFileInEditor(file);
    }
  }
}

// Navigate up one directory
export function navigateUp() {
  if (state.currentPath === '/') return;
  
  const pathParts = state.currentPath.split('/').filter(Boolean);
  pathParts.pop();
  const parentPath = pathParts.length === 0 ? '/' : '/' + pathParts.join('/');
  
  loadFiles(parentPath);
}

// Handle file download
function handleFileDownload(file) {
  // This is a placeholder implementation
  // In a real application, this would initiate a download of the file
  console.log(`Downloading file: ${file.path}`);
  showToast(`Downloading ${file.name}...`, 'info');
  
  // Simulate download completion after a delay
  setTimeout(() => {
    showToast(`Downloaded ${file.name} successfully!`, 'success');
  }, 1500);
}
