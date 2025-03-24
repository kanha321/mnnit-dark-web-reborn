/**
 * Enhanced hover preview functionality with cache support
 */

import { getFileDetails } from '../../../utils/api.js'; 
import { state } from './main.js';
import { updateEditorTabs, updateEditorContent, generateMockContent } from './editor.js';
// Removed import for info-panel.js
import { getCachedContent, getContentWithCache, prioritizeCachingForDirectory } from '../../../utils/cache-manager.js';
import { isTextFile, getSyntaxLanguage } from '../../../utils/file-utils.js';

// Preview state
let previewTimer;
let previewActive = false;
let previousActiveFile = null;
let lastPreviewFilePath = null;
let previewDebounceTimer = null;

// Initialize hover preview
export function initHoverPreview() {
  // Nothing special to initialize
}

// Handle file hover start with cache support for instant previews
export const handleFileHover = async (file) => {
  // Clear any existing timers
  clearTimeout(previewTimer);
  clearTimeout(previewDebounceTimer);
  
  if (!file) return;
  
  // If directory, prioritize caching its contents for better UX
  if (file.isDirectory) {
    prioritizeCachingForDirectory(file.path);
    return;
  }
  
  // Skip if not a text file that we can preview
  if (!isTextFile(file.name)) return;
  
  // Use debounce to avoid constantly creating preview tabs when moving mouse quickly
  previewDebounceTimer = setTimeout(async () => {
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
      
      // If file is already open in a regular tab, just activate it
      if (existingFileIndex !== -1) {
        state.activeFile = state.openFiles[existingFileIndex];
        updateEditorTabs();
        updateEditorContent(state.activeFile);
        // Removed updateInfoPanel call
        return;
      }
      
      // Create a special preview file object
      const previewFile = {
        ...file,
        details,
        isPreview: true,
        name: `Preview: ${file.name}`,
        isLoading: true
      };
      
      // Check if content is cached
      const cachedContent = getCachedContent(file.path);
      if (cachedContent) {
        previewFile.content = cachedContent;
        previewFile.isLoading = false;
      }
      
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
      
      // Update UI with cached content if available
      updateEditorTabs();
      updateEditorContent(previewFile);
      // Removed updateInfoPanel call
      
      // If content not cached, fetch it in background
      if (previewFile.isLoading) {
        try {
          const content = await getContentWithCache(file.path);
          
          // Only update if we're still hovering over this file
          if (lastPreviewFilePath === file.path) {
            // Find the preview tab again
            const currentPreviewIndex = state.openFiles.findIndex(f => f.isPreview);
            if (currentPreviewIndex !== -1) {
              // Update the content
              state.openFiles[currentPreviewIndex].content = content;
              state.openFiles[currentPreviewIndex].isLoading = false;
              
              // Update UI if this is still the active file
              if (state.activeFile && state.activeFile.path === file.path) {
                updateEditorContent(state.openFiles[currentPreviewIndex]);
              }
            }
          }
        } catch (error) {
          console.error('Error loading preview content:', error);
          
          // Update preview with error state
          const currentPreviewIndex = state.openFiles.findIndex(f => f.isPreview);
          if (currentPreviewIndex !== -1 && lastPreviewFilePath === file.path) {
            state.openFiles[currentPreviewIndex].isLoading = false;
            state.openFiles[currentPreviewIndex].loadError = error.message;
            
            if (state.activeFile && state.activeFile.path === file.path) {
              updateEditorContent(state.openFiles[currentPreviewIndex]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Preview error:', error);
    }
  }, 100); // Short debounce to avoid preview creation when just moving over files
};

// Handle file hover end - use a very short delay to avoid flickering
export const handleFileHoverEnd = () => {
  // Clear any existing preview timer
  clearTimeout(previewTimer);
  clearTimeout(previewDebounceTimer);
  
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
      // Removed updateInfoPanel call
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
      // Removed updateInfoPanel call
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
