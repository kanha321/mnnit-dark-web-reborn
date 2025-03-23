/**
 * Main JavaScript file for shared logic
 */

import { initializeIcons } from '../utils/icons.js';

// Theme management
const THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Get user's preferred theme from localStorage or system preference
function getPreferredTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    
    // Default to dark theme instead of checking system preference
    return THEMES.DARK;
}

// Apply the selected theme
function applyTheme(theme) {
    // Remove all theme classes first
    document.body.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    // Add the selected theme class
    document.body.classList.add(theme);
    
    // Save the selection to localStorage
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icon
    updateThemeToggleIcon(theme);
}

// Update the theme toggle icon based on current theme
function updateThemeToggleIcon(theme) {
    const themeToggle = document.querySelector('.theme-switch');
    if (!themeToggle) return;
    
    if (theme === THEMES.DARK) {
        themeToggle.innerHTML = '☀️'; // Light mode icon (sun)
        themeToggle.setAttribute('title', 'Switch to Light Theme');
    } else {
        themeToggle.innerHTML = '🌙'; // Dark mode icon (moon)
        themeToggle.setAttribute('title', 'Switch to Dark Theme');
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = getPreferredTheme();
    
    if (currentTheme === THEMES.DARK) {
        applyTheme(THEMES.LIGHT);
    } else {
        applyTheme(THEMES.DARK);
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    // Apply the preferred theme
    applyTheme(getPreferredTheme());
    
    // Set up theme toggle
    const themeToggle = document.querySelector('.theme-switch');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize Nerd Font icons
    initializeIcons();
    
    // Check if fonts are loaded
    document.fonts.ready.then(() => {
        document.body.classList.add('fonts-applied');
        // Reinitialize icons after fonts are loaded to ensure proper rendering
        initializeIcons();
    });
});
