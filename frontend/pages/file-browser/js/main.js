/**
 * Main entry point for file browser functionality
 */

import { initExplorer, loadFilesTree } from './explorer/index.js';
import { initEditor } from './editor.js';
import { initInfoPanel } from './info-panel.js';
import { initSettings } from './settings.js';
import { initResize } from './resize.js';
import { initHoverPreview } from './hover-preview.js';
import { initializeIcons } from '../../../utils/icons.js';

// State management - shared across modules
export const state = {
  currentPath: '/',
  pathHistory: ['/'],
  currentFiles: [],
  openFiles: [],
  activeFile: null
};

// Initialize all browser components
function initFileBrowser() {
  // Initialize components
  initExplorer(); // This initializes the tree view implementation
  initEditor();
  initInfoPanel();
  initSettings();
  initResize();
  initHoverPreview();
  
  // Initialize Nerd Font icons
  initializeIcons();
  
  console.log('File browser initialized with tree view');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFileBrowser);

// Re-initialize icons when fonts are loaded
document.fonts.ready.then(() => {
  initializeIcons();
  console.log('Icons re-initialized after fonts loaded');
});
