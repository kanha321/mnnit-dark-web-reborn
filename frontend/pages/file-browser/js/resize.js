/**
 * Streamlined resize functionality for panels
 */

// Configuration - removed panel-height
const PANEL_CONFIG = {
  'explorer-width': { 
    default: 250,
    min: 150, 
    max: 500,
    unit: 'px'
  }
  // Removed panel-height configuration
};

// Initialize resize functionality
export function initResize() {
  // Load saved sizes
  loadSizes();
  
  // Set up resize handles
  document.querySelectorAll('.resize-handle').forEach(handle => {
    const isVertical = handle.classList.contains('vertical');
    handle.style.cursor = isVertical ? 'ew-resize' : 'ns-resize';
    handle.addEventListener('mousedown', handleResizeStart);
  });
  
  // Initialize responsive layout
  initResponsiveLayout();
}

// Load sizes from localStorage
function loadSizes() {
  try {
    const savedSizes = JSON.parse(localStorage.getItem('panel-sizes')) || {};
    
    Object.keys(PANEL_CONFIG).forEach(key => {
      const config = PANEL_CONFIG[key];
      const size = savedSizes[key] || config.default;
      setSize(key, size);
    });
  } catch (error) {
    // Reset to defaults on error
    Object.keys(PANEL_CONFIG).forEach(key => 
      setSize(key, PANEL_CONFIG[key].default)
    );
  }
}

// Set size with constraints
function setSize(prop, value) {
  const { min, max, unit } = PANEL_CONFIG[prop];
  const clampedValue = Math.max(min, Math.min(value, max));
  document.documentElement.style.setProperty(`--${prop}`, `${clampedValue}${unit}`);
}

// Handle resize start
function handleResizeStart(event) {
  event.preventDefault();
  const property = event.target.dataset.resize;
  if (!property) return;

  const startPos = { x: event.clientX, y: event.clientY };
  const startSize = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(`--${property}`),
    10
  );
  
  // Add resizing class
  document.body.classList.add('resizing');
  
  // Setup move and up handlers
  function handleMove(e) {
    e.preventDefault();
    
    if (property === 'explorer-width') {
      const delta = e.clientX - startPos.x;
      setSize(property, startSize + delta);
    }
    // Removed panel-height resizing handler
  }
  
  function handleUp() {
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleUp);
    document.body.classList.remove('resizing');
    
    // Save sizes
    try {
      const sizes = Object.keys(PANEL_CONFIG).reduce((acc, key) => {
        const value = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(`--${key}`),
          10
        );
        acc[key] = value;
        return acc;
      }, {});
      
      localStorage.setItem('panel-sizes', JSON.stringify(sizes));
    } catch (error) {
      console.error('Error saving sizes:', error);
    }
  }
  
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleUp);
}

// Add responsiveness toggle for mobile
export function initResponsiveLayout() {
  // Create toggle button for mobile
  const activityBar = document.querySelector('.activity-bar');
  if (activityBar && !document.getElementById('sidebar-toggle')) {
    const sidebarToggle = document.createElement('button');
    sidebarToggle.id = 'sidebar-toggle';
    sidebarToggle.className = 'icon-btn';
    sidebarToggle.setAttribute('data-tooltip', 'Toggle Sidebar');
    sidebarToggle.innerHTML = '<span class="icon-element" data-ui-icon="menu"></span>';
    
    // Insert at the top
    if (activityBar.firstChild) {
      activityBar.insertBefore(sidebarToggle, activityBar.firstChild);
    } else {
      activityBar.appendChild(sidebarToggle);
    }
    
    // Add click handler
    sidebarToggle.addEventListener('click', toggleSidebar);
  }
  
  // Handle initial state based on screen size
  handleResponsiveLayout();
  
  // Listen for window resize
  window.addEventListener('resize', handleResponsiveLayout);
}

// Toggle sidebar visibility on mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.file-explorer');
  if (sidebar) {
    sidebar.classList.toggle('visible');
  }
}

// Handle responsive layout changes
function handleResponsiveLayout() {
  const sidebar = document.querySelector('.file-explorer');
  const isMobile = window.innerWidth <= 768;
  
  if (sidebar) {
    // On mobile, hide sidebar by default
    if (isMobile) {
      sidebar.classList.remove('visible');
    } else {
      // On desktop, always show sidebar
      sidebar.style.display = 'flex';
    }
  }
  
  // Show/hide sidebar toggle button
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.style.display = isMobile ? 'flex' : 'none';
  }
}
