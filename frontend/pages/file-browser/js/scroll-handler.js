/**
 * Scroll handler for auto-hide scrollbars
 * Adds scrolling class to elements when scrolling and removes after timeout with smooth fade
 */

// Configurable timeouts
const SCROLLBAR_FADE_DELAY = 800;     // Time before starting to fade out (ms)
const SCROLLBAR_FADE_DURATION = 600;  // Duration of the fade-out animation (ms)

// Maps to store timeouts and states for each element
const scrollTimeouts = new Map();
const fadeOutTimeouts = new Map();
const activeElements = new Set();

// Initialize scroll handlers
export function initScrollHandlers() {
  const scrollableElements = document.querySelectorAll('.file-list-container, .editor-content, .panel-content, .code-preview');
  
  scrollableElements.forEach(element => {
    // Add scroll event listener to each scrollable element
    element.addEventListener('scroll', () => handleScroll(element), { passive: true });
    
    // Add mouse enter/leave events to handle hover states
    element.addEventListener('mouseenter', () => handleMouseEnter(element), { passive: true });
    element.addEventListener('mouseleave', () => handleMouseLeave(element), { passive: true });
    
    // Mark element as initialized
    element.hasScrollListener = true;
  });
  
  // Re-initialize scroll handlers when DOM changes significantly
  const observeDOM = new MutationObserver(() => {
    const newScrollableElements = document.querySelectorAll('.file-list-container, .editor-content, .panel-content, .code-preview');
    
    newScrollableElements.forEach(element => {
      if (!element.hasScrollListener) {
        element.addEventListener('scroll', () => handleScroll(element), { passive: true });
        element.addEventListener('mouseenter', () => handleMouseEnter(element), { passive: true });
        element.addEventListener('mouseleave', () => handleMouseLeave(element), { passive: true });
        element.hasScrollListener = true;
      }
    });
  });
  
  // Observe the entire document for changes
  observeDOM.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Handle scroll event for an element
function handleScroll(element) {
  // Add to active set
  activeElements.add(element);
  
  // Show scrollbar immediately
  element.classList.remove('scrollbar-fading', 'scrollbar-hidden');
  element.classList.add('scrolling');
  
  // Clear any existing timeouts for this element
  clearAllTimeouts(element);
  
  // Set timeout to start fade out after delay
  scrollTimeouts.set(element, setTimeout(() => {
    // Only fade if the element isn't being hovered
    if (!element.matches(':hover')) {
      startFadeOut(element);
    }
  }, SCROLLBAR_FADE_DELAY));
}

// Handle mouse enter - keep scrollbars visible
function handleMouseEnter(element) {
  // Clear any fade timeouts
  clearAllTimeouts(element);
  
  // Show scrollbars
  element.classList.remove('scrollbar-fading', 'scrollbar-hidden');
  
  // Don't add scrolling class unless actually scrolling
  // This prevents scrollbar from showing during hover if not needed
  if (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
    element.classList.add('scrolling');
  }
}

// Handle mouse leave - start fade if not actively scrolling
function handleMouseLeave(element) {
  // If not actively scrolling recently, start fade
  if (!activeElements.has(element)) {
    startFadeOut(element);
  }
}

// Start the fade-out process
function startFadeOut(element) {
  // Start fade animation
  element.classList.add('scrollbar-fading');
  element.classList.remove('scrolling');
  
  // Remove from active set
  activeElements.delete(element);
  
  // After animation completes, hide completely
  fadeOutTimeouts.set(element, setTimeout(() => {
    element.classList.add('scrollbar-hidden');
    element.classList.remove('scrollbar-fading');
  }, SCROLLBAR_FADE_DURATION));
}

// Clear all timeouts for an element
function clearAllTimeouts(element) {
  if (scrollTimeouts.has(element)) {
    clearTimeout(scrollTimeouts.get(element));
    scrollTimeouts.delete(element);
  }
  
  if (fadeOutTimeouts.has(element)) {
    clearTimeout(fadeOutTimeouts.get(element));
    fadeOutTimeouts.delete(element);
  }
}
