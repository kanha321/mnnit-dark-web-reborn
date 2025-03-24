/**
 * Vim-style keyboard bindings configuration
 * 
 * This file defines all keyboard shortcuts used throughout the application,
 * following Vim-like patterns for consistency and efficiency.
 */

// Application modes
export const MODES = {
  NORMAL: 'normal',  // Default navigation mode
  INSERT: 'insert',  // Text editing mode
  COMMAND: 'command' // Command entry mode (for : commands)
};

// Basic navigation keys (Vim-style)
export const NAVIGATION = {
  UP: 'k',
  DOWN: 'j',
  LEFT: 'h',
  RIGHT: 'l',
  PAGE_UP: 'ctrl+b', // Like in Vim (backward)
  PAGE_DOWN: 'ctrl+f', // Like in Vim (forward)
  START_OF_LINE: '0',
  END_OF_LINE: '$',
  TOP: 'g g', // Press g twice
  BOTTOM: 'G',
};

// File explorer specific shortcuts
export const EXPLORER = {
  OPEN_FOLDER: 'o', // Open/close folder
  EXPAND_ALL: 'z o', // Expand folder and all subfolders
  COLLAPSE_ALL: 'z c', // Collapse folder and all subfolders
  PARENT_DIR: '-', // Go to parent directory
  REFRESH: 'R', // Refresh current directory
  NEW_FILE: 'a', // Add new file
  NEW_FOLDER: 'A', // Add new folder
  DELETE: 'd d', // Delete (press d twice)
  RENAME: 'r', // Rename
};

// Editor specific shortcuts
export const EDITOR = {
  SAVE: 'ctrl+s',
  UNDO: 'u',
  REDO: 'ctrl+r',
  FIND: '/',
  FIND_NEXT: 'n',
  FIND_PREV: 'N',
  CLOSE_TAB: 'ctrl+w',
  NEXT_TAB: 'g t',
  PREV_TAB: 'g T',
};

// Action keys
export const ACTIONS = {
  SELECT: 'space',
  EXECUTE: 'enter',
  ESCAPE: 'escape',
  TOGGLE_MODE: 'i', // Switch between NORMAL and INSERT modes
  COMMAND_MODE: ':', // Enter command mode
};

// Command palette commands (prefixed with :)
export const COMMANDS = {
  QUIT: 'q',
  SAVE: 'w',
  SAVE_QUIT: 'wq',
  FORCE_QUIT: 'q!',
  EXPLORER: 'e',
  SETTINGS: 'set',
  HELP: 'help',
};

// Focus movement between panels
export const FOCUS = {
  EXPLORER: 'ctrl+e',
  EDITOR: 'ctrl+p',
  TERMINAL: 'ctrl+t',
  NEXT_PANE: 'ctrl+w ctrl+w', // Like Vim's window movement
};

// Help reference - these aren't key bindings but help text for documentation
export const HELP = {
  NAVIGATION: 'Move around using h, j, k, l (left, down, up, right)',
  MODE_TOGGLE: 'Press i to enter insert mode, Esc to return to normal mode',
  COMMAND: 'Type : followed by a command (e.g. :w to save)',
  FOCUS: 'Use Ctrl+w then h, j, k, l to move between panels',
};

// Default configuration - used for initial setup and reset
export const DEFAULT_CONFIG = {
  enableVimMode: true,
  showModeIndicator: true,
  caseSensitiveCommands: false,
  timeoutLen: 1000, // ms to wait for multi-key commands
};

// For users familiar with VSCode Vim extension
export const VSCODE_COMPATIBILITY = {
  SIDEBAR_TOGGLE: 'ctrl+b',
  COMMAND_PALETTE: 'ctrl+shift+p',
  QUICK_OPEN: 'ctrl+p',
};
