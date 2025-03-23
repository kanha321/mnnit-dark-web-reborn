/**
 * Streamlined resize functionality for panels
 */

// Configuration
const PANEL_CONFIG = {
  'explorer-width': { 
    default: 250,
    min: 150, 
    max: 500,
    unit: 'px'
  },
  'panel-height': { 
    default: 22,
    min: 10, 
    max: 50,
    unit: '%'
  }
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
    } else if (property === 'panel-height') {
      const delta = startPos.y - e.clientY;
      const deltaPercent = (delta / window.innerHeight) * 100;
      setSize(property, startSize + deltaPercent);
    }
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
