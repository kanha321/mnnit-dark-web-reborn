/**
 * Keyboard Manager
 * 
 * Handles keyboard events and processes Vim-style shortcuts
 */

import { 
  MODES,
  NAVIGATION,
  EXPLORER,
  EDITOR,
  ACTIONS,
  COMMANDS,
  FOCUS,
  DEFAULT_CONFIG
} from '../config/keyboard-bindings.js';
import { showToast } from './dom.js';

// Current state
let currentMode = MODES.NORMAL;
let keyBuffer = '';
let commandBuffer = '';
let keyTimeout = null;
let activeElement = null;
let config = { ...DEFAULT_CONFIG };

// Registered shortcut handlers
const shortcutHandlers = {
  [MODES.NORMAL]: new Map(),
  [MODES.INSERT]: new Map(),
  [MODES.COMMAND]: new Map(),
};

// Context-specific handlers
const contextHandlers = {
  'explorer': new Map(),
  'editor': new Map(),
  'panel': new Map(),
  'global': new Map(),
};

/**
 * Initialize keyboard shortcuts
 * @param {Object} options - Configuration options
 */
export function initKeyboardManager(options = {}) {
  config = { ...DEFAULT_CONFIG, ...options };
  
  // Set initial mode
  setMode(MODES.NORMAL);
  
  // Add global event listener
  document.addEventListener('keydown', handleKeyDown);
  
  // Create mode indicator if enabled
  if (config.showModeIndicator) {
    createModeIndicator();
  }
  
  // Initialize with document.body as the active element
  setActiveElement(document.body);
  
  console.log('Keyboard manager initialized in', currentMode, 'mode');
}

/**
 * Handle key down events
 * @param {KeyboardEvent} event - The key event
 */
function handleKeyDown(event) {
  // Don't handle events for input elements when not in command mode
  if (isInputElement(event.target) && currentMode !== MODES.COMMAND) {
    return;
  }
  
  // Handle escape key - always exits to normal mode
  if (event.key === 'Escape') {
    event.preventDefault();
    resetState();
    setMode(MODES.NORMAL);
    return;
  }
  
  // Handle command mode
  if (currentMode === MODES.COMMAND) {
    handleCommandMode(event);
    return;
  }
  
  const key = normalizeKey(event);
  
  // Handle : to enter command mode
  if (currentMode === MODES.NORMAL && key === ':') {
    event.preventDefault();
    setMode(MODES.COMMAND);
    updateCommandDisplay(':');
    return;
  }
  
  // Handle i to enter insert mode
  if (currentMode === MODES.NORMAL && key === 'i') {
    event.preventDefault();
    setMode(MODES.INSERT);
    return;
  }
  
  // Process key based on current mode
  switch (currentMode) {
    case MODES.NORMAL:
      handleNormalMode(event, key);
      break;
    case MODES.INSERT:
      // In insert mode, most keys should work normally
      // Only handle registered insert mode shortcuts
      handleInsertMode(event, key);
      break;
  }
}

/**
 * Handle keys in normal mode
 * @param {KeyboardEvent} event - The key event
 * @param {string} key - Normalized key representation
 */
function handleNormalMode(event, key) {
  // Update key buffer
  keyBuffer += key + ' ';
  
  // Clear timeout and set a new one
  clearTimeout(keyTimeout);
  keyTimeout = setTimeout(() => {
    keyBuffer = '';
  }, config.timeoutLen);
  
  // Trim the buffer for matching
  const trimmedBuffer = keyBuffer.trim();
  
  // Try to match shortcuts
  // 1. First check context-specific handlers for the current context
  const currentContext = getElementContext(activeElement);
  const contextHandlerMap = contextHandlers[currentContext];
  
  // 2. Then check global normal mode handlers
  const normalModeHandlers = shortcutHandlers[MODES.NORMAL];
  
  // Check both single key and key sequence matches
  if (contextHandlerMap && matchAndExecute(contextHandlerMap, trimmedBuffer, event)) {
    return;
  }
  
  if (matchAndExecute(normalModeHandlers, trimmedBuffer, event)) {
    return;
  }
  
  // Single key navigation
  handleNormalModeNavigation(key, event);
}

/**
 * Handle basic navigation in normal mode
 * @param {string} key - The pressed key
 * @param {Event} event - The keyboard event
 */
function handleNormalModeNavigation(key, event) {
  // Handle basic navigation keys
  switch (key) {
    case NAVIGATION.UP:
      event.preventDefault();
      navigateDirection('up');
      break;
    case NAVIGATION.DOWN:
      event.preventDefault();
      navigateDirection('down');
      break;
    case NAVIGATION.LEFT:
      event.preventDefault();
      navigateDirection('left');
      break;
    case NAVIGATION.RIGHT:
      event.preventDefault();
      navigateDirection('right');
      break;
    case ACTIONS.SELECT:
      event.preventDefault();
      selectCurrent();
      break;
    case ACTIONS.EXECUTE:
      event.preventDefault();
      executeCurrent();
      break;
  }
}

/**
 * Handle insert mode shortcuts
 * @param {KeyboardEvent} event - The key event 
 * @param {string} key - Normalized key
 */
function handleInsertMode(event, key) {
  const insertModeHandlers = shortcutHandlers[MODES.INSERT];
  const handler = insertModeHandlers.get(key);
  
  if (handler) {
    event.preventDefault();
    handler(event);
  }
}

/**
 * Handle command mode input
 * @param {KeyboardEvent} event - The key event
 */
function handleCommandMode(event) {
  // Handle Enter to execute command
  if (event.key === 'Enter') {
    event.preventDefault();
    executeCommand(commandBuffer);
    return;
  }
  
  // Handle backspace
  if (event.key === 'Backspace') {
    event.preventDefault();
    commandBuffer = commandBuffer.slice(0, -1);
    updateCommandDisplay(commandBuffer.length ? commandBuffer : ':');
    return;
  }
  
  // Ignore control keys
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }
  
  // Add key to command buffer
  if (event.key.length === 1) {
    event.preventDefault();
    commandBuffer += event.key;
    updateCommandDisplay(commandBuffer);
  }
}

/**
 * Execute a command entered in command mode
 * @param {string} command - The command string (without the leading :)
 */
function executeCommand(command) {
  // Remove the leading : if present
  const cmd = command.startsWith(':') ? command.substring(1) : command;
  
  console.log('Executing command:', cmd);
  
  // Find matching command handler
  const commandHandlers = shortcutHandlers[MODES.COMMAND];
  
  // Check for exact matches first
  const handler = commandHandlers.get(cmd);
  if (handler) {
    handler();
    resetCommandMode();
    return;
  }
  
  // Handle built-in commands
  switch (cmd) {
    case COMMANDS.QUIT:
      // Close current tab or navigate back
      showToast('Quit command executed', 'info');
      break;
    case COMMANDS.SAVE:
      showToast('Save command executed', 'info');
      break;
    case COMMANDS.HELP:
      showToast('Help: Use j/k to navigate, o to open, i for insert mode', 'info');
      break;
    case COMMANDS.EXPLORER:
      focusExplorer();
      break;
    default:
      showToast(`Unknown command: ${cmd}`, 'error');
  }
  
  resetCommandMode();
}

/**
 * Reset command mode state
 */
function resetCommandMode() {
  commandBuffer = '';
  setMode(MODES.NORMAL);
  hideModeSpecificUI();
}

/**
 * Try to match and execute a shortcut from a handler map
 * @param {Map} handlerMap - Map of shortcuts to handlers
 * @param {string} keys - The key sequence to match
 * @param {Event} event - The original keyboard event
 * @returns {boolean} True if a handler was found and executed
 */
function matchAndExecute(handlerMap, keys, event) {
  // Check for direct match first
  if (handlerMap.has(keys)) {
    event.preventDefault();
    const handler = handlerMap.get(keys);
    handler(event);
    keyBuffer = ''; // Reset buffer after successful match
    return true;
  }
  
  // Check if this could be the beginning of a multi-key sequence
  for (const shortcut of handlerMap.keys()) {
    if (shortcut.startsWith(keys) && shortcut !== keys) {
      // This is a potential match in progress
      return true;
    }
  }
  
  return false;
}

/**
 * Register a keyboard shortcut
 * @param {string} keys - Key or key sequence
 * @param {Function} handler - Handler function
 * @param {string} mode - Which mode this applies to (normal, insert, command)
 * @param {string} context - Optional context (explorer, editor, panel, global)
 */
export function registerShortcut(keys, handler, mode = MODES.NORMAL, context = 'global') {
  if (mode === MODES.COMMAND) {
    // For command mode, we strip the leading : if present
    const cmd = keys.startsWith(':') ? keys.substring(1) : keys;
    shortcutHandlers[mode].set(cmd, handler);
  } else if (context && contextHandlers[context]) {
    // For context-specific shortcuts
    contextHandlers[context].set(keys, handler);
  } else {
    // For mode-specific shortcuts
    shortcutHandlers[mode].set(keys, handler);
  }
}

/**
 * Set the active element for context-aware shortcuts
 * @param {HTMLElement} element - The active element
 */
export function setActiveElement(element) {
  if (element) {
    activeElement = element;
    
    // Remove active class from all focusable elements
    document.querySelectorAll('.kb-active').forEach(el => {
      el.classList.remove('kb-active');
    });
    
    // Add active class to the new element
    element.classList.add('kb-active');
  }
}

/**
 * Set the current mode
 * @param {string} mode - The mode to set
 */
export function setMode(mode) {
  if (Object.values(MODES).includes(mode)) {
    currentMode = mode;
    updateModeIndicator();
    
    // Update document body class for mode-specific CSS
    document.body.classList.remove(...Object.values(MODES).map(m => `mode-${m}`));
    document.body.classList.add(`mode-${mode}`);
  }
}

/**
 * Get the current mode
 * @returns {string} Current mode
 */
export function getMode() {
  return currentMode;
}

/**
 * Reset all state
 */
function resetState() {
  keyBuffer = '';
  commandBuffer = '';
  clearTimeout(keyTimeout);
  hideModeSpecificUI();
}

/**
 * Create the mode indicator element
 */
function createModeIndicator() {
  const existingIndicator = document.getElementById('mode-indicator');
  if (existingIndicator) return;
  
  const indicator = document.createElement('div');
  indicator.id = 'mode-indicator';
  indicator.className = 'mode-indicator';
  document.body.appendChild(indicator);
  
  updateModeIndicator();
}

/**
 * Update the mode indicator text and style
 */
function updateModeIndicator() {
  const indicator = document.getElementById('mode-indicator');
  if (!indicator) return;
  
  // Clear existing classes
  indicator.className = 'mode-indicator';
  
  // Add mode-specific class
  indicator.classList.add(`mode-${currentMode}`);
  
  // Set text
  switch (currentMode) {
    case MODES.NORMAL:
      indicator.textContent = 'NORMAL';
      break;
    case MODES.INSERT:
      indicator.textContent = 'INSERT';
      break;
    case MODES.COMMAND:
      indicator.textContent = 'COMMAND';
      break;
  }
  
  // Make sure it's visible
  indicator.style.display = 'block';
}

/**
 * Update the command display
 * @param {string} text - The text to display
 */
function updateCommandDisplay(text) {
  let commandDisplay = document.getElementById('command-display');
  
  if (!commandDisplay) {
    commandDisplay = document.createElement('div');
    commandDisplay.id = 'command-display';
    commandDisplay.className = 'command-display';
    document.body.appendChild(commandDisplay);
  }
  
  commandDisplay.textContent = text;
  commandDisplay.style.display = 'block';
}

/**
 * Hide mode-specific UI elements
 */
function hideModeSpecificUI() {
  const commandDisplay = document.getElementById('command-display');
  if (commandDisplay) {
    commandDisplay.style.display = 'none';
  }
}

/**
 * Check if an element is an input element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if it's an input element
 */
function isInputElement(element) {
  const tagName = element.tagName.toLowerCase();
  return tagName === 'input' || 
         tagName === 'textarea' || 
         element.isContentEditable;
}

/**
 * Normalize key representation
 * @param {KeyboardEvent} event - The keyboard event 
 * @returns {string} Normalized key string
 */
function normalizeKey(event) {
  let key = event.key.toLowerCase();
  
  // Handle special keys
  if (key === ' ') key = 'space';
  if (key === 'arrowup') key = 'up';
  if (key === 'arrowdown') key = 'down';
  if (key === 'arrowleft') key = 'left';
  if (key === 'arrowright') key = 'right';
  
  // Add modifiers
  const modifiers = [];
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.altKey) modifiers.push('alt');
  if (event.shiftKey && key !== key.toUpperCase()) modifiers.push('shift');
  if (event.metaKey) modifiers.push('meta');
  
  return modifiers.length > 0 ? 
    modifiers.join('+') + '+' + key : 
    key;
}

/**
 * Get the context of an element
 * @param {HTMLElement} element - The element to check
 * @returns {string} The context name
 */
function getElementContext(element) {
  if (!element) return 'global';
  
  if (element.closest('.file-explorer')) {
    return 'explorer';
  } else if (element.closest('.editor-area')) {
    return 'editor';
  } else if (element.closest('.panel')) {
    return 'panel';
  }
  
  return 'global';
}

/**
 * Navigate in specified direction
 * @param {string} direction - Direction to navigate (up, down, left, right)
 */
function navigateDirection(direction) {
  const context = getElementContext(activeElement);
  
  switch (context) {
    case 'explorer':
      navigateExplorer(direction);
      break;
    case 'editor':
      navigateEditor(direction);
      break;
    case 'panel':
      navigatePanel(direction);
      break;
    default:
      // Try to find the first focusable element
      focusExplorer();
  }
}

/**
 * Navigate within the file explorer
 * @param {string} direction - Direction to navigate
 */
function navigateExplorer(direction) {
  const fileItems = Array.from(document.querySelectorAll('.file-item'));
  if (!fileItems.length) return;
  
  // Find current active item
  const currentIndex = fileItems.findIndex(item => item.classList.contains('kb-active'));
  let nextIndex = 0;
  
  if (currentIndex !== -1) {
    if (direction === 'down') {
      nextIndex = Math.min(currentIndex + 1, fileItems.length - 1);
    } else if (direction === 'up') {
      nextIndex = Math.max(currentIndex - 1, 0);
    }
  }
  
  setActiveElement(fileItems[nextIndex]);
  fileItems[nextIndex].scrollIntoView({ block: 'nearest' });
}

/**
 * Navigate within the editor area
 * @param {string} direction - Direction to navigate
 */
function navigateEditor(direction) {
  // Editor navigation depends on the content type
  // This is a basic implementation
  const editorContent = document.querySelector('.editor-content');
  if (!editorContent) return;
  
  // For now, just scroll
  const scrollAmount = 40;
  
  switch (direction) {
    case 'up':
      editorContent.scrollTop -= scrollAmount;
      break;
    case 'down':
      editorContent.scrollTop += scrollAmount;
      break;
    case 'left':
      editorContent.scrollLeft -= scrollAmount;
      break;
    case 'right':
      editorContent.scrollLeft += scrollAmount;
      break;
  }
}

/**
 * Navigate within the panel area
 * @param {string} direction - Direction to navigate
 */
function navigatePanel(direction) {
  // Basic panel navigation
  const panel = document.querySelector('.panel');
  if (!panel) return;
  
  // For now, just scroll
  const scrollAmount = 40;
  
  switch (direction) {
    case 'up':
      panel.scrollTop -= scrollAmount;
      break;
    case 'down':
      panel.scrollTop += scrollAmount;
      break;
  }
}

/**
 * Focus the file explorer
 */
function focusExplorer() {
  const explorer = document.querySelector('.file-explorer');
  if (!explorer) return;
  
  const firstItem = explorer.querySelector('.file-item');
  if (firstItem) {
    setActiveElement(firstItem);
    firstItem.scrollIntoView({ block: 'nearest' });
  }
}

/**
 * Select the current item
 */
function selectCurrent() {
  if (!activeElement) return;
  
  // Simulate a click on the active element
  activeElement.click();
}

/**
 * Execute action on current item
 */
function executeCurrent() {
  if (!activeElement) return;
  
  // For folders, toggle them
  if (activeElement.classList.contains('directory')) {
    // Find and click the folder toggle
    const toggle = activeElement.querySelector('.folder-toggle');
    if (toggle) {
      toggle.click();
    }
  } else {
    // For files, open them
    activeElement.click();
  }
}

// Export all public methods and constants
export {
  MODES,
  NAVIGATION,
  EXPLORER,
  EDITOR,
  ACTIONS,
  COMMANDS,
  FOCUS,
};
