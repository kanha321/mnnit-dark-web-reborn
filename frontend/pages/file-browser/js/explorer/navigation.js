/**
 * Explorer navigation functionality
 * Handles breadcrumbs and navigation between folders
 */

import { createElement } from '../../../../utils/dom.js';
import { state } from '../main.js';
import { loadFilesTree } from './tree-view.js';

// Navigate up one directory level
export function navigateUp() {
  if (state.currentPath === '/') return;
  
  const pathParts = state.currentPath.split('/').filter(Boolean);
  pathParts.pop();
  const parentPath = pathParts.length === 0 ? '/' : '/' + pathParts.join('/');
  
  loadFilesTree(parentPath);
}

// Update the breadcrumb navigation based on current path
export function updateBreadcrumbs() {
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
