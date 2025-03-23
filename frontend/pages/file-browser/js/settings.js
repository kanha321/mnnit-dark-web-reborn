/**
 * Settings functionality - streamlined implementation
 */

import { getUIIcon, setIcon } from '../../../utils/icons.js';

const THEMES = { LIGHT: 'light', DARK: 'dark' };

// Initialize settings
export function initSettings() {
  const settingsBtn = document.getElementById('settings-button');
  const settingsPanel = document.getElementById('settings-panel');
  const closeBtn = document.getElementById('close-settings');
  
  // Setup icons
  if (settingsBtn) {
    setIcon(settingsBtn.querySelector('.icon-element'), getUIIcon('settings'));
    settingsBtn.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent document click from firing
      toggleSettings();
    });
  }
  
  if (closeBtn) {
    setIcon(closeBtn.querySelector('.icon-element'), getUIIcon('close'));
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent document click from firing
      closeSettingsPanel();
    });
  }
  
  // Setup theme options
  document.querySelectorAll('.theme-option').forEach(option => {
    const theme = option.dataset.theme;
    if (!theme) return;
    
    // Add theme icon
    const icon = document.createElement('span');
    icon.className = 'theme-icon';
    setIcon(icon, theme === 'light' ? getUIIcon('sun') : getUIIcon('moon'));
    option.prepend(icon, ' ');
    
    // Add click handler
    option.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent document click from firing
      applyTheme(theme);
      updateActiveTheme();
      closeSettingsPanel();
    });
  });
  
  // Close panel when clicking outside (with proper animation)
  document.addEventListener('click', event => {
    // Check if settings panel is visible and click is outside the panel and settings button
    if (settingsPanel?.classList.contains('visible') && 
        !settingsPanel.contains(event.target) && 
        event.target !== settingsBtn && 
        !settingsBtn?.contains(event.target)) {
      closeSettingsPanel();
    }
  });
  
  // Prevent clicks inside the panel from closing it
  if (settingsPanel) {
    settingsPanel.addEventListener('click', event => {
      event.stopPropagation();
    });
  }
  
  // Set initial active theme
  updateActiveTheme();
}

// Properly close settings panel with animation
function closeSettingsPanel() {
  const panel = document.getElementById('settings-panel');
  if (!panel || !panel.classList.contains('visible')) return;
  
  // Start closing animation using CSS classes instead of inline styles
  panel.classList.add('closing');
  
  // Wait for the animation to finish before hiding the panel
  panel.addEventListener('transitionend', function onTransitionEnd() {
    panel.classList.remove('visible');
    panel.classList.remove('closing');
    panel.removeEventListener('transitionend', onTransitionEnd);
  }, { once: true }); // Use { once: true } to auto-remove the listener
}

// Toggle settings panel
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  if (!panel) return;
  
  if (panel.classList.contains('visible')) {
    closeSettingsPanel();
  } else {
    // Reset any closing animation state
    panel.classList.remove('closing');
    // Show the panel
    panel.classList.add('visible');
    // Update active theme
    updateActiveTheme();
  }
}

// Update active theme option
function updateActiveTheme() {
  const currentTheme = document.body.classList.contains(THEMES.LIGHT) ? THEMES.LIGHT : THEMES.DARK;
  
  document.querySelectorAll('.theme-option').forEach(option => {
    option.classList.toggle('active', option.dataset.theme === currentTheme);
  });
}

// Apply theme with transition effect
function applyTheme(theme) {
  // Add transition for smooth theme change
  document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
  
  // Remove all theme classes
  Object.values(THEMES).forEach(t => document.body.classList.remove(t));
  
  // Add selected theme
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
  
  // Update active theme option
  updateActiveTheme();
  
  // Remove transition after theme change to avoid affecting other animations
  setTimeout(() => {
    document.body.style.transition = '';
  }, 500);
}
