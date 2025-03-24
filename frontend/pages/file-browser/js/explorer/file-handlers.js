/**
 * File handlers for the explorer - Clean implementation
 */

import { getUIIcon } from '../../../../utils/icons.js';
import { showToast } from '../../../../utils/dom.js';
import { getFileIcon, getFolderIconByName } from '../utils.js';
import { handleFileHover, handleFileHoverEnd, isFileBeingPreviewed, convertPreviewToPermanent } from '../hover-preview.js';
import { toggleFolder, expandedFolders } from './tree-view.js';
import { openFileInEditor } from '../editor.js';
import { getFileContent, downloadFile } from '../../../../utils/api.js';

// Create a file item with appropriate event handlers
export function createFileItem(file, level = 0) {
  // Create the base file item
  const fileItem = document.createElement('div');
  fileItem.className = `file-item ${file.isDirectory ? 'directory' : 'file'} tree-item`;
  fileItem.setAttribute('data-path', file.path);
  
  // Create indentation based on level
  const indentation = createIndentation(level);
  
  // Generate item content based on type
  if (file.isDirectory) {
    createFolderItem(fileItem, file, indentation);
  } else {
    createFileTypeItem(fileItem, file, indentation);
  }
  
  return fileItem;
}

// Create indentation elements
function createIndentation(level) {
  let indentation = '';
  for (let i = 0; i < level; i++) {
    indentation += '<span class="tree-indent"></span>';
  }
  return indentation;
}

// Create folder item
function createFolderItem(fileItem, file, indentation) {
  // Generate HTML content
  fileItem.innerHTML = `
    ${indentation}
    <span class="folder-toggle ${expandedFolders.has(file.path) ? 'expanded' : ''}">${expandedFolders.has(file.path) ? '▼' : '►'}</span>
    <span class="file-icon">${getFolderIconByName(file.name, expandedFolders.has(file.path))}</span>
    <span class="file-name">${file.name}</span>
  `;
  
  // Add click handlers
  fileItem.addEventListener('click', (event) => {
    // Only handle clicks directly on the fileItem, not on child elements
    if (event.target === fileItem) {
      toggleFolder(file, fileItem);
    }
  });
  
  // Add folder toggle handler
  const toggleBtn = fileItem.querySelector('.folder-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFolder(file, fileItem);
    });
  }
}

// Create regular file item
function createFileTypeItem(fileItem, file, indentation) {
  // Determine if it's a text file for copy action
  const isTextFile = isTextFileType(file.name);
  
  // Generate HTML content - with action buttons
  fileItem.innerHTML = `
    ${indentation}
    <span class="file-indent"></span>
    <span class="file-icon">${getFileIcon(file.name)}</span>
    <span class="file-name">${file.name}</span>
    <span class="file-action-buttons">
      ${isTextFile ? `<span class="file-copy-icon">${getUIIcon('copy')}</span>` : ''}
      <span class="file-download-icon">${getUIIcon('download')}</span>
    </span>
  `;
  
  // Add click handler
  fileItem.addEventListener('click', () => handleFileClick(file));
  
  // Add hover handlers
  fileItem.addEventListener('mouseenter', () => handleFileHover(file));
  fileItem.addEventListener('mouseleave', () => handleFileHoverEnd());
  
  // Add action handlers
  addFileActionHandlers(fileItem, file);
}

// Add action button handlers (download, copy)
function addFileActionHandlers(fileItem, file) {
  // Add download handler
  const downloadIcon = fileItem.querySelector('.file-download-icon');
  if (downloadIcon) {
    downloadIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      handleFileDownload(file);
    });
  }
  
  // Add copy handler for text files
  const copyIcon = fileItem.querySelector('.file-copy-icon');
  if (copyIcon) {
    copyIcon.addEventListener('click', (event) => {
      event.stopPropagation();
      handleFileCopy(file);
    });
  }
}

// Handle file click
export function handleFileClick(file) {
  if (!file.isDirectory) {
    // Check if file is being previewed
    if (isFileBeingPreviewed(file.path)) {
      convertPreviewToPermanent();
    } else {
      // Open file in editor
      openFileInEditor(file);
    }
  }
}

// Handle file download
export function handleFileDownload(file) {
  showToast(`Downloading ${file.name}...`, 'info');
  
  try {
    downloadFile(file.path);
    
    setTimeout(() => {
      showToast(`Download started for ${file.name}`, 'success');
    }, 500);
  } catch (error) {
    console.error(`Failed to download file: ${file.path}`, error);
    showToast(`Failed to download file: ${error.message}`, 'error');
  }
}

// Handle file content copy
export async function handleFileCopy(file) {
  try {
    showToast(`Copying ${file.name} contents...`, 'info');
    const content = await getFileContent(file.path);
    await copyToClipboard(content);
    showToast(`Copied ${file.name} contents to clipboard!`, 'success');
  } catch (error) {
    console.error(`Failed to copy file content: ${error.message}`);
    showToast(`Failed to copy: ${error.message}`, 'error');
  }
}

// Helper to copy content to clipboard
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    if (!document.execCommand('copy')) {
      throw new Error('Failed to copy text');
    }
    
    document.body.removeChild(textArea);
  } catch (error) {
    console.error("Failed to copy: ", error);
    throw error;
  }
}

// Check file type by extension
function isTextFileType(filename) {
  const textExtensions = [
    'txt', 'md', 'markdown', 'js', 'ts', 'jsx', 'tsx', 'html', 'htm', 'css', 'scss',
    'json', 'xml', 'yaml', 'yml', 'ini', 'config', 'conf', 'sh', 'bash', 'py', 'c',
    'cpp', 'h', 'hpp', 'cs', 'go', 'rs', 'svg', 'log'
  ];
  
  const extension = filename.split('.').pop().toLowerCase();
  return textExtensions.includes(extension);
}
