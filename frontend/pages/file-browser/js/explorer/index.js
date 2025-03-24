/**
 * Explorer module main entry point
 * Exports all explorer functionality and initializes the explorer component
 */

import { initTreeView, loadFilesTree } from './tree-view.js';
import { handleFileClick } from './file-handlers.js';
import { navigateUp, updateBreadcrumbs } from './navigation.js';
import { getUIIcon, setIcon } from '../../../../utils/icons.js';
import { state } from '../main.js';

// Initialize the file explorer
export function initExplorer() {
  // Initial file listing using tree view
  loadFilesTree('/');
  
  // Set up event listeners
  const pathUpBtn = document.getElementById('path-up');
  if (pathUpBtn) {
    pathUpBtn.addEventListener('click', navigateUp);
    
    // Initialize the up icon directly
    const upIconElement = pathUpBtn.querySelector('.icon-element');
    if (upIconElement) {
      setIcon(upIconElement, getUIIcon('up'));
    }
  }
  
  const refreshBtn = document.getElementById('refresh-files');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadFilesTree(state.currentPath));
    
    // Initialize the refresh icon directly
    const refreshIconElement = refreshBtn.querySelector('.icon-element');
    if (refreshIconElement) {
      setIcon(refreshIconElement, getUIIcon('refresh'));
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
  
  // Initialize tree view
  initTreeView();
}

// Re-export all public functions from submodules
export { 
  loadFilesTree,
  handleFileClick, 
  navigateUp,
  updateBreadcrumbs
};
