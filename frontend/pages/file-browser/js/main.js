/**
 * Main entry point for file browser functionality
 */

import { initExplorer, loadFilesTree } from './explorer/index.js';
import { initEditor } from './editor.js';
// Removed import for info-panel.js
import { initSettings } from './settings.js';
import { initResize } from './resize.js';
import { initHoverPreview } from './hover-preview.js';
import { initializeIcons } from '../../../utils/icons.js';
import { initCacheManager, startBackgroundCaching } from '../../../utils/cache-manager.js';
import { initCacheStatus } from './cache-status.js';
import { initScrollHandlers } from './scroll-handler.js';
import { 
  initKeyboardManager, 
  registerShortcut, 
  MODES, 
  NAVIGATION, 
  EXPLORER 
} from '../../../utils/keyboard-manager.js';

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
  initExplorer();
  initEditor();
  // Removed initInfoPanel()
  initSettings();
  initResize();
  initHoverPreview();
  
  // Initialize cache system
  initCacheManager();
  initCacheStatus();
  
  // Initialize scroll handlers for auto-hide scrollbars
  initScrollHandlers();
  
  // Initialize Nerd Font icons
  initializeIcons();
  
  // Initialize keyboard shortcuts
  initKeyboardShortcuts();
  
  console.log('File browser initialized with caching system and keyboard shortcuts');
  
  // Start background caching after a delay to let the UI load first
  setTimeout(() => {
    startBackgroundCaching('/');
  }, 2000); // 2-second delay before starting caching
}

// Initialize keyboard shortcuts
function initKeyboardShortcuts() {
  // Initialize keyboard manager
  initKeyboardManager({
    showModeIndicator: true,
    enableVimMode: true
  });
  
  // Register explorer shortcuts
  registerShortcut(NAVIGATION.UP, () => {
    // Move selection up in file list
    console.log('Navigate up');
  }, MODES.NORMAL, 'explorer');
  
  registerShortcut(NAVIGATION.DOWN, () => {
    // Move selection down in file list
    console.log('Navigate down');
  }, MODES.NORMAL, 'explorer');
  
  registerShortcut(EXPLORER.OPEN_FOLDER, () => {
    // Toggle current folder
    const selectedItem = document.querySelector('.file-item.active');
    if (selectedItem && selectedItem.classList.contains('directory')) {
      const toggle = selectedItem.querySelector('.folder-toggle');
      if (toggle) toggle.click();
    }
  }, MODES.NORMAL, 'explorer');
  
  // Register editor shortcuts
  registerShortcut('ctrl+s', () => {
    // Save current file
    console.log('Save file');
  }, MODES.NORMAL, 'editor');
  
  // Register global shortcuts
  registerShortcut('?', () => {
    // Show keyboard shortcut help
    console.log('Show keyboard help');
  }, MODES.NORMAL, 'global');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFileBrowser);

// Re-initialize icons when fonts are loaded
document.fonts.ready.then(() => {
  initializeIcons();
  console.log('Icons re-initialized after fonts loaded');
});
