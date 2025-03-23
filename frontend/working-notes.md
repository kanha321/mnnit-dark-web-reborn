# Working Notes for MNNIT Dark Web Reborn Project

This file contains notes, ideas, and progress tracking for the project. It's intended for development use only.

## Current Status

- Created a Material 3 themed file browser interface
- Implemented a mock API for testing without backend
- Built an IDE-like interface with file explorer, editor, and info panel
- Reorganized code into a more scalable folder structure
- Applied dark theme as default and implemented proper Nerd Font icons
- Added resizable panels with localStorage persistence

## Features Implemented

- [x] Basic file browser
- [x] Material 3 theming with light/dark modes
- [x] IDE-like layout
- [x] File info panel
- [x] Mock file content display
- [x] Tab-based editor interface
- [x] Modular code organization
- [x] Proper Nerd Font icon implementation
- [x] Dark theme by default
- [x] Resizable panels (explorer width & panel height)
- [x] Settings panel for theme switching
- [x] User preferences saved to localStorage

## Recent Improvements

- **Resizable Panels**: Added intuitive resize handles between panels with min/max constraints
- **Cleaner API**: Simplified component APIs for better developer experience
- **Code Optimization**: Reduced redundant code and improved performance
- **Simplified DOM Manipulation**: Streamlined element creation and event handling
- **Header Integration**: Added site header with "MNNIT's Dark Web" branding

## Code Organization

- CSS files are now split into modules:
  - `/pages/file-browser/css/layout.css` - Main layout grid
  - `/pages/file-browser/css/explorer.css` - File explorer styles
  - `/pages/file-browser/css/editor.css` - Editor area styles
  - `/pages/file-browser/css/info-panel.css` - Info panel styles
  - `/pages/file-browser/css/components.css` - Common UI components

- JS files are now split into modules:
  - `/pages/file-browser/js/main.js` - Entry point and shared state
  - `/pages/file-browser/js/explorer.js` - File explorer functionality
  - `/pages/file-browser/js/editor.js` - Editor functionality
  - `/pages/file-browser/js/info-panel.js` - Info panel functionality
  - `/pages/file-browser/js/utils.js` - Shared utilities
  - `/pages/file-browser/js/settings.js` - Settings management
  - `/pages/file-browser/js/resize.js` - Panel resize functionality

- Utility files:
  - `/utils/icons.js` - Nerd Font icons management
  - `/utils/mock-api.js` - Mock backend API
  - `/utils/dom.js` - DOM manipulation helpers

- Component files:
  - `/css/components/icon-button.css` - Reusable icon button component

## Todo

- [ ] Add syntax highlighting for code files
- [ ] Implement file search functionality
- [ ] Add file upload feature
- [ ] Add context menus for files/folders
- [ ] Implement better image preview with zoom controls
- [ ] Create proper documentation
- [ ] Add keyboard shortcuts for navigation
- [ ] Implement drag and drop file operations

## Ideas & Notes

### IDE Layout
The current IDE layout divides the screen into three main areas:
- Left: File explorer
- Center: Editor/preview area
- Bottom: File info panel (replacing terminal)

### Nerd Font Implementation

Nerd Font icons must be implemented via JavaScript rather than direct CSS because:
1. Unicode characters for these icons can cause rendering issues in different browsers
2. Some platforms may not properly support all Unicode ranges used by Nerd Font
3. JavaScript allows dynamic icon selection based on context and theme

We've created dedicated icon utilities:

- `icons.js` - Maps file types to appropriate Nerd Font icons using JavaScript escape sequences
- `icon-initializer.js` - Provides automatic icon initialization throughout the application

Our implementation has several key components:

1. Icon mappings using escape sequences (not direct Unicode characters):
```javascript
const FILE_ICONS = {
  js: '\ue781',      // JavaScript icon
  html: '\ue736',    // HTML icon
  css: '\ue749',     // CSS icon
  folder: '\uf07b',  // Folder icon
  default: '\uf15b'  // Default file icon
};
```

2. Helper functions to set icons based on context:
```javascript
// Get appropriate icon for a file
function getFileIcon(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return FILE_ICONS[extension] || FILE_ICONS.default;
}

// Set the icon content
function setIcon(element, iconChar) {
  if (element) element.textContent = iconChar;
}
```

3. Automatic initialization that runs after DOM is loaded and when fonts are ready:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  initializeIcons();
  document.fonts.ready.then(() => {
    initializeIcons(); // Re-initialize once fonts are loaded
  });
});
```

4. Data attribute approach for declarative icon assignment:
```html
<span class="file-icon" data-file-icon="script.js"></span>
<span class="folder-icon" data-folder-icon="documents"></span>
<button class="action-button"><span data-ui-icon="refresh"></span></button>
```

### Theme Implementation

We've set dark theme as the default for our application:

1. CSS default is set to dark mode:
```css
:root {
  color-scheme: dark light;
}
```

2. Default HTML class is "dark":
```html
<body class="dark">
```

3. JavaScript preference detection prioritizes dark mode:
```javascript
function getPreferredTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  return THEMES.DARK; // Default to dark
}
```

### Modular Architecture Benefits

The new modular structure offers several advantages:
- Better separation of concerns
- Easier to locate specific functionality
- More maintainable as codebase grows
- Allows for more focused testing
- Reduces merge conflicts when multiple people work on the codebase

### Debug Information
Some issues to watch out for:
- Editor needs proper syntax highlighting
- Browser compatibility testing needed for font rendering across platforms

### Temporary Code
```javascript
// Used for debugging hover preview positioning
function checkPosition(element) {
  const rect = element.getBoundingClientRect();
  console.log({
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  });
}
```

### Possible Improvements
1. Consider using a virtual scrolling library for large file lists
2. Add keyboard shortcuts for common operations
3. Implement drag-and-drop for file uploads and organization
4. Add file system operations (create, rename, delete)
5. Add search with regex support
6. Consider WebAssembly for heavy file operations
7. Implement code linting and formatting in the editor
8. Add theme selection dropdown beyond just light/dark toggle
9. Add high-contrast mode for accessibility

### Component System

We're building a reusable component-based system to ensure consistency across the UI:

#### Icon Button Component

The `icon-btn` class provides a standardized way to create icon-based buttons with consistent styling:

```html
<!-- Basic usage -->
<button class="icon-btn" title="Home">
  <span class="icon-element" data-ui-icon="home"></span>
</button>

<!-- Size variants -->
<button class="icon-btn small" title="Close">
  <span class="icon-element" data-ui-icon="close"></span>
</button>

<button class="icon-btn large" title="Add">
  <span class="icon-element" data-ui-icon="plus"></span>
</button>

<!-- Style variants -->
<button class="icon-btn filled" title="Refresh">
  <span class="icon-element" data-ui-icon="refresh"></span>
</button>

<button class="icon-btn primary" title="Star">
  <span class="icon-element" data-ui-icon="star"></span>
</button>

<!-- Shape variants -->
<button class="icon-btn circular" title="Add">
  <span class="icon-element" data-ui-icon="plus"></span>
</button>

<!-- Position variants -->
<button class="icon-btn fixed-bottom-left" title="Settings">
  <span class="icon-element" data-ui-icon="settings"></span>
</button>

<!-- State variants -->
<button class="icon-btn active" title="Explorer">
  <span class="icon-element" data-ui-icon="home"></span>
</button>

<button class="icon-btn disabled" title="Delete" disabled>
  <span class="icon-element" data-ui-icon="delete"></span>
</button>
```

The component provides:
- Consistent sizing and alignment
- Hover, active, and focus states
- Multiple variants for different use cases
- Automatic tooltips from the title attribute
- Accessibility support with focus styles
- Semantic HTML with button elements

## References

- [Material 3 Design Guidelines](https://m3.material.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Consider for full code editing
- [Highlight.js](https://highlightjs.org/) - For syntax highlighting
- [Nerd Fonts](https://www.nerdfonts.com/cheat-sheet) - Reference for icon codes

## Notes on Integration with Backend

When implementing the real backend API:
1. Replace mock-api.js functions with real API calls
2. Ensure proper error handling for network failures
3. Add authentication handling
4. Consider adding a caching layer for frequently accessed files
5. Implement real-time file update notifications
