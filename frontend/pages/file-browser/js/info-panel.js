/**
 * Info panel functionality
 */

import { createElement } from '../../../utils/dom.js';
import { formatFileSize } from './utils.js';

// Initialize the info panel
export function initInfoPanel() {
  const infoPanel = document.getElementById('info-panel-content');
  if (!infoPanel) return;
  
  // Default state with no file selected
  infoPanel.innerHTML = '<p>No file selected</p>';
}

// Update the info panel with file details
export function updateInfoPanel(file = null) {
  const infoPanel = document.getElementById('info-panel-content');
  if (!infoPanel) return;
  
  if (!file) {
    infoPanel.innerHTML = '<p>No file selected</p>';
    return;
  }
  
  // Build file details
  infoPanel.innerHTML = '';
  
  const detailsGrid = createElement('div', {
    className: 'file-details-grid'
  });
  
  // Add file details
  addDetailRow(detailsGrid, 'Name', file.name);
  addDetailRow(detailsGrid, 'Path', file.path);
  addDetailRow(detailsGrid, 'Size', formatFileSize(file.details.size));
  addDetailRow(detailsGrid, 'Type', file.details.type || 'Unknown');
  addDetailRow(detailsGrid, 'Modified', new Date(file.details.modified).toLocaleString());
  
  infoPanel.appendChild(detailsGrid);
}

// Helper to add a row to the details grid
function addDetailRow(grid, label, value) {
  grid.appendChild(
    createElement('div', {
      className: 'detail-label',
      textContent: label + ':'
    })
  );
  
  grid.appendChild(
    createElement('div', {
      className: 'detail-value',
      textContent: value
    })
  );
}
