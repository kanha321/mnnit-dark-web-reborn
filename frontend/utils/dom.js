/**
 * Streamlined DOM manipulation utilities
 */

// Create element with attributes and children
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  
  // Set attributes using Object.entries for cleaner iteration
  Object.entries(attributes).forEach(([key, value]) => {
    // Handle special cases
    if (key === 'className') element.className = value;
    else if (key === 'textContent') element.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } 
    else element.setAttribute(key, value);
  });
  
  // Add children (if any)
  if (children.length > 0) {
    children.forEach(child => {
      if (typeof child === 'string') element.append(child);
      else if (child instanceof Node) element.append(child);
    });
  }
  
  return element;
}

// Show toast notification (streamlined)
function showToast(message, type = 'info', duration = 3000) {
  // Create and add toast element
  const toast = Object.assign(document.createElement('div'), {
    className: `toast toast-${type}`,
    textContent: message
  });
  
  document.body.appendChild(toast);
  
  // Animation sequence with cleanup
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  });
}

export { createElement, showToast };
