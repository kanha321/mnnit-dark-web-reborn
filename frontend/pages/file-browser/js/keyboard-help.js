/**
 * Keyboard shortcuts help dialog
 */

import {
  NAVIGATION,
  EXPLORER,
  EDITOR,
  ACTIONS,
  COMMANDS,
  FOCUS
} from '../../../config/keyboard-bindings.js';

// Create and show the keyboard shortcuts help modal
export function showKeyboardHelp() {
  // Check if help panel already exists
  let helpPanel = document.getElementById('keyboard-help-panel');
  
  if (!helpPanel) {
    helpPanel = createHelpPanel();
    document.body.appendChild(helpPanel);
  }
  
  // Show the panel
  helpPanel.classList.add('visible');
  
  // Add close handler
  const closeButton = helpPanel.querySelector('.help-close-button');
  if (closeButton) {
    closeButton.addEventListener('click', hideKeyboardHelp);
  }
  
  // Also close on ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideKeyboardHelp();
    }
  }, { once: true });
  
  // Close when clicking outside
  helpPanel.addEventListener('click', (event) => {
    if (event.target === helpPanel) {
      hideKeyboardHelp();
    }
  });
}

// Hide the keyboard shortcuts help modal
export function hideKeyboardHelp() {
  const helpPanel = document.getElementById('keyboard-help-panel');
  if (helpPanel) {
    helpPanel.classList.remove('visible');
  }
}

// Create the help panel
function createHelpPanel() {
  const panel = document.createElement('div');
  panel.id = 'keyboard-help-panel';
  panel.className = 'keyboard-help';
  
  panel.innerHTML = `
    <div class="keyboard-help-header">
      <h2>Keyboard Shortcuts</h2>
      <button class="help-close-button md-icon-button">×</button>
    </div>
    
    <div class="keyboard-help-content">
      <div class="keyboard-help-section">
        <h3>Navigation</h3>
        <div class="shortcut-list">
          <span class="shortcut-key">${NAVIGATION.UP}</span>
          <span class="shortcut-description">Move up</span>
          
          <span class="shortcut-key">${NAVIGATION.DOWN}</span>
          <span class="shortcut-description">Move down</span>
          
          <span class="shortcut-key">${NAVIGATION.LEFT}</span>
          <span class="shortcut-description">Move left</span>
          
          <span class="shortcut-key">${NAVIGATION.RIGHT}</span>
          <span class="shortcut-description">Move right</span>
          
          <span class="shortcut-key">${NAVIGATION.PAGE_UP}</span>
          <span class="shortcut-description">Page up</span>
          
          <span class="shortcut-key">${NAVIGATION.PAGE_DOWN}</span>
          <span class="shortcut-description">Page down</span>
          
          <span class="shortcut-key">${NAVIGATION.TOP}</span>
          <span class="shortcut-description">Go to top</span>
          
          <span class="shortcut-key">${NAVIGATION.BOTTOM}</span>
          <span class="shortcut-description">Go to bottom</span>
        </div>
      </div>
      
      <div class="keyboard-help-section">
        <h3>File Explorer</h3>
        <div class="shortcut-list">
          <span class="shortcut-key">${EXPLORER.OPEN_FOLDER}</span>
          <span class="shortcut-description">Open/close folder</span>
          
          <span class="shortcut-key">${EXPLORER.PARENT_DIR}</span>
          <span class="shortcut-description">Go to parent directory</span>
          
          <span class="shortcut-key">${EXPLORER.REFRESH}</span>
          <span class="shortcut-description">Refresh directory</span>
        </div>
      </div>
      
      <div class="keyboard-help-section">
        <h3>Editor</h3>
        <div class="shortcut-list">
          <span class="shortcut-key">${EDITOR.SAVE}</span>
          <span class="shortcut-description">Save file</span>
          
          <span class="shortcut-key">${EDITOR.FIND}</span>
          <span class="shortcut-description">Find in file</span>
          
          <span class="shortcut-key">${EDITOR.NEXT_TAB}</span>
          <span class="shortcut-description">Next tab</span>
          
          <span class="shortcut-key">${EDITOR.PREV_TAB}</span>
          <span class="shortcut-description">Previous tab</span>
        </div>
      </div>
      
      <div class="keyboard-help-section">
        <h3>Modes</h3>
        <div class="shortcut-list">
          <span class="shortcut-key">ESC</span>
          <span class="shortcut-description">Normal mode</span>
          
          <span class="shortcut-key">${ACTIONS.TOGGLE_MODE}</span>
          <span class="shortcut-description">Insert mode</span>
          
          <span class="shortcut-key">${ACTIONS.COMMAND_MODE}</span>
          <span class="shortcut-description">Command mode</span>
        </div>
      </div>
      
      <div class="keyboard-help-section">
        <h3>Commands (Type : followed by)</h3>
        <div class="shortcut-list">
          <span class="shortcut-key">${COMMANDS.QUIT}</span>
          <span class="shortcut-description">Quit current view</span>
          
          <span class="shortcut-key">${COMMANDS.SAVE}</span>
          <span class="shortcut-description">Save current file</span>
          
          <span class="shortcut-key">${COMMANDS.HELP}</span>
          <span class="shortcut-description">Show help</span>
        </div>
      </div>
      
      <div class="keyboard-help-section">
        <h3>Panel Focus</h3>
        <div class="shortcut-list">
          <span class="shortcut-key">${FOCUS.EXPLORER}</span>
          <span class="shortcut-description">Focus explorer</span>
          
          <span class="shortcut-key">${FOCUS.EDITOR}</span>
          <span class="shortcut-description">Focus editor</span>
          
          <span class="shortcut-key">${FOCUS.TERMINAL}</span>
          <span class="shortcut-description">Focus terminal/panel</span>
        </div>
      </div>
    </div>
  `;
  
  return panel;
}
