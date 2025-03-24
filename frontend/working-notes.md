# Working Notes for MNNIT Dark Web Reborn Project

This file contains notes, ideas, and progress tracking for the project. It's intended for development use only.

## Current Status

- Created a Material 3 themed file browser interface
- Implemented a mock API for testing without backend
- Built an IDE-like interface with file explorer, editor, and info panel
- Reorganized code into a more scalable folder structure
- Applied dark theme as default and implemented proper Nerd Font icons
- Added resizable panels with localStorage persistence
- Added tree-view file explorer with animations similar to Neovim/Treesitter
- Improved hover preview functionality for better user experience

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
- [x] Tree-view file explorer with folder expansion/collapse
- [x] Smooth animations for user interactions
- [x] Preview tabs for quick file viewing on hover

## Recent Improvements

- **Tree-style File Explorer**: Implemented a Neovim Treesitter-like file explorer with expandable folders
- **Animation System**: Created a comprehensive animation system for smoother UI interactions
- **Enhanced Preview**: Added file preview on hover with auto-dismiss and conversion to permanent tabs
- **Modular Architecture**: Split explorer functionality into smaller, more maintainable modules
- **Folder Structure**: Created a dedicated folder for explorer-related code to improve organization
- **Visual Feedback**: Added animations for folder open/close, file selection, and hover states
- **Performance Optimizations**: Added CSS techniques to improve animation performance

## Backend Simulation

We've implemented a comprehensive mock backend to simulate server functionality:

### Mock File System Structure

The mock file system (`mock-api.js`) provides a virtual directory structure with:

- Root folder with common directories (documents, images, music, videos, downloads)
- Nested folder structure with up to 3 levels of depth
- Various file types with appropriate metadata
  - Documents (.pdf, .doc, .txt, etc.)
  - Images (.jpg, .png, etc.)
  - Code files (.js, .html, .css, etc.)
  - Media files (.mp3, .mp4, etc.)
  - Archives (.zip, .rar, etc.)

### Mock API Endpoints

Simulated endpoints that mimic RESTful behavior:

- `getFileList(path)`: Returns files and folders at the specified path
- `getFileDetails(path)`: Returns metadata for a specific file
- `getFileContent(path)`: Returns content for text-based files
- `uploadFile(file, destination)`: Simulates file upload functionality

### Simulated Network Behavior

To create a realistic experience, the mock API includes:

- Randomized response delays (200-700ms) to simulate network latency
- Progressive loading states for better UX during "network" operations
- Error simulation for edge cases to test resilience
- Loading indicators during async operations

### Example Mock Data

```javascript
// Directory structure simulation
const fileSystem = {
    '/': {
        type: 'directory',
        children: ['documents', 'images', 'music', 'videos', 'downloads', 'sample.txt', 'readme.md'],
        modified: '2023-10-15T10:30:00Z'
    },
    '/documents': {
        type: 'directory',
        children: ['work', 'personal', 'project-notes.txt', 'report.pdf'],
        modified: '2023-10-14T15:20:00Z'
    },
    // More directories...
};

// File metadata simulation
const fileDetails = {
    '/sample.txt': {
        size: 1024,
        modified: '2023-10-15T08:20:00Z',
        type: 'text/plain'
    },
    // More files...
};
```

## Tree View Implementation

The tree-view file explorer provides an IDE-like experience:

### Core Features

- Hierarchical display of files and folders
- Expandable/collapsible folders with state persistence
- Visual indentation showing file hierarchy
- Dynamic loading of folder contents when expanded
- Smooth animations for expanding/collapsing folders
- Visual guides with connecting lines between levels

### Technical Implementation

The tree view is built with:

1. A recursive rendering system for folder hierarchies
2. State tracking for expanded/collapsed folders
3. Dynamic loading of content to improve performance with large file systems
4. CSS grid and flexbox for precise layout control
5. CSS animations for smooth transitions
6. Event delegation for efficient event handling

### Animation System

We've created a comprehensive animation system with:

1. Entry animations for new elements
2. Transition animations for state changes
3. Interaction animations for user feedback
4. Loading state animations
5. CSS keyframes for complex animations
6. Performance optimizations (GPU acceleration, will-change, etc.)

```css
/* Example animation implementation */
@keyframes expandChildren {
  from {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
  }
}
```

## Code Organization

- CSS files are now split into modules:
  - `/pages/file-browser/css/layout.css` - Main layout grid
  - `/pages/file-browser/css/explorer.css` - File explorer styles
  - `/pages/file-browser/css/editor.css` - Editor area styles
  - `/pages/file-browser/css/info-panel.css` - Info panel styles
  - `/pages/file-browser/css/components.css` - Common UI components
  - `/pages/file-browser/css/explorer-tree.css` - Tree view styles
  - `/pages/file-browser/css/animations/` - Animation styles broken into modules

- JS files are now split into modules:
  - `/pages/file-browser/js/main.js` - Entry point and shared state
  - `/pages/file-browser/js/editor.js` - Editor functionality
  - `/pages/file-browser/js/info-panel.js` - Info panel functionality
  - `/pages/file-browser/js/settings.js` - Settings management
  - `/pages/file-browser/js/resize.js` - Panel resize functionality
  - `/pages/file-browser/js/hover-preview.js` - File preview on hover

- The explorer functionality has been modularized:
  - `/pages/file-browser/js/explorer/index.js` - Explorer entry point
  - `/pages/file-browser/js/explorer/tree-view.js` - Tree rendering logic
  - `/pages/file-browser/js/explorer/file-handlers.js` - File interaction handlers
  - `/pages/file-browser/js/explorer/navigation.js` - Breadcrumb navigation
  - `/pages/file-browser/js/explorer/utils.js` - Explorer-specific utilities

- Utility files:
  - `/utils/icons.js` - Nerd Font icons management
  - `/utils/mock-api.js` - Mock backend API
  - `/utils/dom.js` - DOM manipulation helpers

## Todo

- [ ] Add syntax highlighting for code files
- [ ] Implement file search functionality
- [ ] Add file upload feature
- [ ] Add context menus for files/folders
- [ ] Implement better image preview with zoom controls
- [ ] Create proper documentation
- [ ] Add keyboard shortcuts for navigation
- [ ] Implement drag and drop file operations
- [ ] Add file modification and creation functionality
- [ ] Implement file and folder filtering

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

### Tree View Implementation Notes

The tree view uses a recursive rendering approach:
- Parent paths track their expanded/collapsed state
- Children are only loaded when a folder is expanded
- Visual connecting lines created with pseudo-elements
- Depth-based indentation for hierarchy visualization

Challenges addressed:
- Performance with large file systems
- Animation smoothness
- State management between renders
- Consistent behavior across browsers

### Future Backend Integration

When implementing the real backend API:

1. Replace mock API functions with real endpoints:
```javascript
// Current mock implementation
async function getFileList(path) {
  await delay(300); // Simulated network delay
  return fileSystem[path].children.map(/* transform to file objects */);
}

// Future real implementation
async function getFileList(path) {
  const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
  if (!response.ok) throw new Error('Failed to load files');
  return response.json();
}
```

2. Error handling model to maintain:
```javascript
try {
  const files = await getFileList(path);
  renderFiles(files);
} catch (error) {
  showErrorMessage(error.message);
} finally {
  hideLoadingIndicator();
}
```

3. Authentication integration points already in place
4. File operation endpoints to implement:
   - GET /api/files?path={path} - Get file listing
   - GET /api/files/{id} - Get file details
   - GET /api/files/{id}/content - Get file content
   - POST /api/files - Create/upload new file
   - PUT /api/files/{id} - Update file
   - DELETE /api/files/{id} - Delete file
   - POST /api/folders - Create new folder

## References

- [Material 3 Design Guidelines](https://m3.material.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Consider for full code editing
- [Highlight.js](https://highlightjs.org/) - For syntax highlighting
- [Nerd Fonts](https://www.nerdfonts.com/cheat-sheet) - Reference for icon codes
- [Neovim/NvimTree](https://github.com/nvim-tree/nvim-tree.lua) - Inspiration for tree view
