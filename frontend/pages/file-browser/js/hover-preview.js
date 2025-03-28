/**
 * Enhanced hover preview functionality
 * Shows file content in a preview tab instantly when hovering over files
 */

import { getFileContent, getFileDetails } from '../../../utils/api.js'; // Changed from mock-api to real api
import { state } from './main.js';
import { updateEditorTabs, updateEditorContent, generateMockContent } from './editor.js';
import { updateInfoPanel } from './info-panel.js';

// Preview state
let previewTimer;
let previewActive = false;
let previousActiveFile = null;
let lastPreviewFilePath = null;

// Initialize hover preview
export function initHoverPreview() {
  // Nothing special to initialize
}

// Handle file hover start - now instant
export const handleFileHover = async (file) => {
  if (!file || file.isDirectory) return;
  
  // Clear any existing preview timer
  clearTimeout(previewTimer);
  
  // Skip if already previewing this file
  if (lastPreviewFilePath === file.path) return;
  lastPreviewFilePath = file.path;
  
  try {
    // Save current active file to restore later
    if (state.activeFile && !previewActive) {
      previousActiveFile = state.activeFile;
    }
    
    // Get file details
    let details;
    try {
      details = await getFileDetails(file.path);
    } catch (error) {
      console.error('Error getting file details:', error);
      return;
    }
    
    // Check if the file is already open in a regular tab
    const existingFileIndex = state.openFiles.findIndex(f => f.path === file.path && !f.isPreview);
    
    // If file is already open in a regular tab, don't create a preview tab
    if (existingFileIndex !== -1) {
      // Just activate the existing tab
      state.activeFile = state.openFiles[existingFileIndex];
      updateEditorTabs();
      updateEditorContent(state.activeFile);
      updateInfoPanel(state.activeFile);
      return;
    }
    
    // Create a special preview file object
    const previewFile = {
      ...file,
      details,
      isPreview: true,
      name: `Preview: ${file.name}`
    };
    
    // Set as active file
    state.activeFile = previewFile;
    previewActive = true;
    
    // Find if we already have a preview tab
    const existingPreviewIndex = state.openFiles.findIndex(f => f.isPreview);
    
    if (existingPreviewIndex !== -1) {
      // Update existing preview tab
      state.openFiles[existingPreviewIndex] = previewFile;
    } else {
      // Add preview tab
      state.openFiles.push(previewFile);
    }
    
    // Update UI
    updateEditorTabs();
    updateEditorContent(previewFile);
    updateInfoPanel(previewFile);
    
  } catch (error) {
    console.error('Preview error:', error);
  }
};

// Handle file hover end - use a very short delay to avoid flickering
export const handleFileHoverEnd = () => {
  // Clear any existing preview timer
  clearTimeout(previewTimer);
  
  // Set a very short delay to prevent flicker when moving between files
  previewTimer = setTimeout(() => {
    if (!previewActive) return;
    
    // Reset last previewed file
    lastPreviewFilePath = null;
    
    // Remove preview tab
    const previewIndex = state.openFiles.findIndex(f => f.isPreview);
    if (previewIndex !== -1) {
      state.openFiles.splice(previewIndex, 1);
    }
    
    // Restore previous active file
    if (previousActiveFile) {
      state.activeFile = previousActiveFile;
    } else if (state.openFiles.length > 0) {
      state.activeFile = state.openFiles[state.openFiles.length - 1];
    } else {
      state.activeFile = null;
    }
    
    // Update UI
    updateEditorTabs();
    
    if (state.activeFile) {
      updateEditorContent(state.activeFile);
      updateInfoPanel(state.activeFile);
    } else {
      // No files open, reset editor
      const editorContent = document.getElementById('editor-content');
      if (editorContent) {
        editorContent.innerHTML = `
          <div class="preview-placeholder fade-in">
            <div class="preview-placeholder-icon">📄</div>
            <p>Select a file to preview or edit</p>
          </div>
        `;
      }
      updateInfoPanel(null);
    }
    
    previewActive = false;
    previousActiveFile = null;
  }, 50); // Just a minimal delay to prevent flickering
};

// Helper function to check if a file is currently being previewed
export function isFileBeingPreviewed(filePath) {
  return previewActive && lastPreviewFilePath === filePath;
}

// Helper function to convert a preview to a permanent tab
export function convertPreviewToPermanent() {
  if (!previewActive || !lastPreviewFilePath) return;
  
  // Find the preview tab
  const previewIndex = state.openFiles.findIndex(f => f.isPreview);
  if (previewIndex !== -1) {
    // Convert preview to permanent by removing isPreview flag
    const file = { ...state.openFiles[previewIndex] };
    delete file.isPreview;
    file.name = file.name.replace('Preview: ', '');
    
    // Replace preview with permanent
    state.openFiles[previewIndex] = file;
    state.activeFile = file;
    
    // Reset preview state
    previewActive = false;
    lastPreviewFilePath = null;
    
    // Update UI
    updateEditorTabs();
    updateEditorContent(file);
  }
}
