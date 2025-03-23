/**
 * Editor component functionality
 */

import { getFileDetails } from '../../../utils/mock-api.js';
import { createElement, showToast } from '../../../utils/dom.js';
import { state } from './main.js';
import { updateInfoPanel } from './info-panel.js';
import { getFileIcon } from './utils.js';
import { getUIIcon, setIcon } from '../../../utils/icons.js';

// Initialize the editor area
export function initEditor() {
  const editorArea = document.getElementById('editor-content');
  if (!editorArea) return;
  
  // Display default placeholder
  editorArea.innerHTML = `
    <div class="preview-placeholder">
      <div class="preview-placeholder-icon">📄</div>
      <p>Select a file to preview or edit</p>
    </div>
  `;
}

// Open a file in the editor
export async function openFileInEditor(file) {
  try {
    // Get file details
    const details = await getFileDetails(file.path);
    
    // Check if file is already open
    const existingIndex = state.openFiles.findIndex(f => f.path === file.path);
    if (existingIndex !== -1) {
      state.activeFile = state.openFiles[existingIndex];
    } else {
      // Add to open files
      state.activeFile = { ...file, details };
      state.openFiles.push(state.activeFile);
    }
    
    // Update editor tabs
    updateEditorTabs();
    
    // Update editor content
    updateEditorContent(state.activeFile);
    
    // Update file info panel
    updateInfoPanel(state.activeFile);
    
  } catch (error) {
    showToast(`Failed to open file: ${error.message}`, 'error');
  }
}

// Update the editor tabs to support preview tabs
export function updateEditorTabs() {
  const tabsContainer = document.getElementById('editor-tabs');
  if (!tabsContainer) return;
  
  tabsContainer.innerHTML = '';
  
  state.openFiles.forEach(file => {
    const isActive = state.activeFile && state.activeFile.path === file.path;
    const isPreview = file.isPreview === true;
    
    const tab = createElement('div', {
      className: `editor-tab ${isActive ? 'active' : ''} ${isPreview ? 'preview-tab' : ''}`,
      'data-path': file.path,
      onClick: () => {
        state.activeFile = file;
        updateEditorTabs();
        updateEditorContent(file);
        updateInfoPanel(file);
      }
    });

    // Add file icon
    const iconSpan = createElement('span', {
      className: 'tab-icon',
    });
    setIcon(iconSpan, getFileIcon(file.name.replace('Preview: ', '')));
    tab.appendChild(iconSpan);
    
    // Add file name
    tab.appendChild(createElement('span', {
      className: 'tab-name',
      textContent: isPreview ? 'Preview' : file.name
    }));
    
    // Add close button with proper icon
    const closeSpan = createElement('span', {
      className: 'tab-close',
      onClick: (event) => {
        event.stopPropagation();
        closeFile(file);
      }
    });
    setIcon(closeSpan, getUIIcon('close'));
    tab.appendChild(closeSpan);
    
    tabsContainer.appendChild(tab);
  });
}

// Close a file tab
export function closeFile(file) {
  const index = state.openFiles.findIndex(f => f.path === file.path);
  if (index === -1) return;
  
  // Get the tab element
  const tabElement = document.querySelector(`.editor-tab[data-path="${file.path}"]`);
  
  if (tabElement) {
    // Add closing animation
    tabElement.classList.add('fade-out');
    tabElement.style.transform = 'scale(0.8)';
    tabElement.style.opacity = '0';
    
    setTimeout(() => {
      // Remove the file from state
      state.openFiles.splice(index, 1);
      
      // If closing active file, activate another one
      if (state.activeFile && state.activeFile.path === file.path) {
        state.activeFile = state.openFiles.length > 0 ? state.openFiles[state.openFiles.length - 1] : null;
      }
      
      // Update UI
      updateEditorTabs();
      
      if (state.activeFile) {
        updateEditorContent(state.activeFile);
        updateInfoPanel(state.activeFile);
      } else {
        // No files are open
        initEditor();
        updateInfoPanel();
      }
    }, 200);
  } else {
    // If tab element not found, proceed without animation
    state.openFiles.splice(index, 1);
    
    // If closing active file, activate another one
    if (state.activeFile && state.activeFile.path === file.path) {
      state.activeFile = state.openFiles.length > 0 ? state.openFiles[state.openFiles.length - 1] : null;
    }
    
    // Update UI
    updateEditorTabs();
    
    if (state.activeFile) {
      updateEditorContent(state.activeFile);
      updateInfoPanel(state.activeFile);
    } else {
      // No files are open
      initEditor();
      updateInfoPanel();
    }
  }
}

// Update the editor content
export function updateEditorContent(file) {
  const editorContent = document.getElementById('editor-content');
  if (!editorContent) return;
  
  // Apply fade-out animation before changing content
  editorContent.classList.add('fade-out');
  
  setTimeout(() => {
    editorContent.innerHTML = '';
    
    const fileType = file.details.type || '';
    
    // For images
    if (fileType.startsWith('image/')) {
      const imagePreview = createElement('div', {
        className: 'image-preview scale-in'
      }, [
        createElement('img', {
          src: `data:${fileType};base64,iVBORw0KGgoAAAANSUhEUgAAAGQAA...`,
          alt: file.name
        })
      ]);
      editorContent.appendChild(imagePreview);
    } else if (fileType.includes('text/') || fileType.includes('application/json') || 
        fileType.includes('javascript') || fileType.includes('css') ||
        file.name.match(/\.(txt|md|js|html|css|json|xml|py|c|cpp|h|java)$/i)) {
      
      // For text files, add animation
      const codePreview = createElement('pre', {
        className: 'code-preview slide-in-up',
        textContent: generateMockContent(file)
      });
      editorContent.appendChild(codePreview);
    } else {
      // For other files
      const placeholder = createElement('div', {
        className: 'preview-placeholder scale-in',
      }, [
        createElement('div', {
          className: 'preview-placeholder-icon'
        }),
        createElement('p', {
          textContent: `${file.name} (${file.details.type || 'Unknown type'})`,
          className: 'fade-in'
        }),
        createElement('p', {
          textContent: 'Preview not available for this file type',
          className: 'fade-in',
          style: 'animation-delay: 0.1s'
        })
      ]);
      editorContent.appendChild(placeholder);
      
      // Set the icon separately using the setIcon function
      const iconElement = editorContent.querySelector('.preview-placeholder-icon');
      if (iconElement) {
        setIcon(iconElement, file.isDirectory ? getFolderIconByName(file.name) : getFileIcon(file.name));
      }
    }
    
    // Remove fade-out and add fade-in
    editorContent.classList.remove('fade-out');
    editorContent.classList.add('fade-in');
    
    // Remove animation class after it completes
    setTimeout(() => {
      editorContent.classList.remove('fade-in');
    }, 300);
    
  }, 150); // Short delay for the fade-out animation
}

// Export generateMockContent for use in hover-preview.js
export function generateMockContent(file) {
  // Same content generation logic as before
  
  if (file.name.endsWith('.js') || file.name.replace('Preview: ', '').endsWith('.js')) {
    return `// File: ${file.path}\n\n/**\n * Sample JavaScript code\n * @param {string} name - The name to greet\n * @returns {string} A greeting message\n */\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\n// Initialize application\nconst appName = 'File Explorer';\nconst version = '1.0.0';\n\n/**\n * Main application entry point\n */\nfunction init() {\n  console.log(\`Starting \${appName} v\${version}\`);\n  const message = greet('User');\n  document.getElementById('output').textContent = message;\n}\n\n// Call init when document is ready\ndocument.addEventListener('DOMContentLoaded', init);\n`;
  } else if (file.name.endsWith('.html') || file.name.replace('Preview: ', '').endsWith('.html')) {
    return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${file.name.split('.')[0]}</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <header>\n    <h1>Welcome to ${file.name.split('.')[0]}</h1>\n    <nav>\n      <ul>\n        <li><a href="#">Home</a></li>\n        <li><a href="#">About</a></li>\n        <li><a href="#">Contact</a></li>\n      </ul>\n    </nav>\n  </header>\n  \n  <main>\n    <section id="intro">\n      <h2>Introduction</h2>\n      <p>This is a sample HTML file to demonstrate the editor preview.</p>\n    </section>\n    \n    <section id="features">\n      <h2>Features</h2>\n      <ul>\n        <li>File browsing</li>\n        <li>Preview on hover</li>\n        <li>Syntax highlighting</li>\n      </ul>\n    </section>\n  </main>\n  \n  <footer>\n    <p>&copy; 2023 File Explorer Demo</p>\n  </footer>\n\n  <script src="script.js"></script>\n</body>\n</html>`;
  }
  
  // Return generic text content
  return `This is generated content for ${file.name.replace('Preview: ', '')}.\nThe file is located at ${file.path}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.`;
}
