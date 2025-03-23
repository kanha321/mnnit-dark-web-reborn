/**
 * Utility for managing Nerd Font icons
 * 
 * This file provides functions and constants for working with
 * Nerd Font icons. Nerd Fonts must be loaded for these icons to display correctly.
 * 
 * References:
 * - https://www.nerdfonts.com/cheat-sheet
 */

// File type icons (using JavaScript escape sequences for Unicode characters)
const FILE_ICONS = {
  // Documents
  pdf: '\uf1c1',     // nf-fa-file_pdf_o
  doc: '\uf1c2',     // nf-fa-file_word_o
  docx: '\uf1c2',    // nf-fa-file_word_o
  txt: '\uf15c',     // nf-fa-file_text_o
  md: '\ue73e',      // nf-dev-markdown
  
  // Code
  js: '\ue781',      // nf-dev-javascript
  ts: '\ue628',      // nf-seti-typescript
  html: '\ue736',    // nf-dev-html5
  css: '\ue749',     // nf-dev-css3
  scss: '\ue74b',    // nf-dev-sass
  less: '\ue758',    // nf-dev-less
  json: '\ue60b',    // nf-seti-json
  xml: '\ufabf',     // nf-mdi-xml
  yaml: '\ue73b',    // nf-dev-yaml
  py: '\ue73c',      // nf-dev-python
  rb: '\ue739',      // nf-dev-ruby
  php: '\ue73d',     // nf-dev-php
  java: '\ue738',    // nf-dev-java
  c: '\ue61e',       // nf-custom-c
  cpp: '\ue61d',     // nf-custom-cpp
  cs: '\uf81a',      // nf-mdi-language_csharp
  go: '\ue724',      // nf-dev-go
  rs: '\ue7a8',      // nf-dev-rust
  
  // Images
  jpg: '\uf1c5',     // nf-fa-file_image_o
  jpeg: '\uf1c5',    // nf-fa-file_image_o
  png: '\uf1c5',     // nf-fa-file_image_o
  gif: '\uf1c5',     // nf-fa-file_image_o
  svg: '\uf1c5',     // nf-fa-file_image_o
  webp: '\uf1c5',    // nf-fa-file_image_o
  ico: '\uf1c5',     // nf-fa-file_image_o
  
  // Audio/Video
  mp3: '\uf1c7',     // nf-fa-file_audio_o
  wav: '\uf1c7',     // nf-fa-file_audio_o
  ogg: '\uf1c7',     // nf-fa-file_audio_o
  mp4: '\uf1c8',     // nf-fa-file_video_o
  mov: '\uf1c8',     // nf-fa-file_video_o
  avi: '\uf1c8',     // nf-fa-file_video_o
  mkv: '\uf1c8',     // nf-fa-file_video_o
  webm: '\uf1c8',    // nf-fa-file_video_o
  
  // Archives
  zip: '\uf1c6',     // nf-fa-file_zip_o
  rar: '\uf1c6',     // nf-fa-file_zip_o
  tar: '\uf1c6',     // nf-fa-file_zip_o
  gz: '\uf1c6',      // nf-fa-file_zip_o
  '7z': '\uf1c6',    // nf-fa-file_zip_o
  
  // Spreadsheets & Presentations
  xlsx: '\uf1c3',    // nf-fa-file_excel_o
  xls: '\uf1c3',     // nf-fa-file_excel_o
  csv: '\uf1c3',     // nf-fa-file_excel_o
  pptx: '\uf1c4',    // nf-fa-file_powerpoint_o
  ppt: '\uf1c4',     // nf-fa-file_powerpoint_o
  
  // Other
  pdf: '\uf1c1',     // nf-fa-file_pdf_o
  log: '\uf18d',     // nf-fa-stack_overflow
  bin: '\uf471',     // nf-oct-file_binary
  exe: '\uf17a',     // nf-fa-windows
  
  // Default
  default: '\uf15b'  // nf-fa-file_o
};

// Folder icons
const FOLDER_ICONS = {
  default: '\uf07b',        // nf-fa-folder
  open: '\uf07c',           // nf-fa-folder_open_o
  documents: '\uf07b',      // nf-fa-folder
  downloads: '\uf019',      // nf-fa-download
  pictures: '\uf1c5',       // nf-fa-file_image_o
  videos: '\uf03d',         // nf-fa-video_camera
  music: '\uf001',          // nf-fa-music
  desktop: '\uf108',        // nf-fa-desktop
  git: '\ue702',            // nf-dev-git
  github: '\uf408',         // nf-fa-github
  node: '\ue718',           // nf-dev-nodejs
  src: '\uf121',            // nf-fa-code
  build: '\uf085',          // nf-fa-gears
  dist: '\uf1b3',           // nf-fa-cubes
  config: '\uf085',         // nf-fa-gears
  assets: '\uf1c5',         // nf-fa-file_image_o
  public: '\uf0ac',         // nf-fa-globe
};

// UI action icons
const UI_ICONS = {
  refresh: '\uf021',        // nf-fa-refresh
  upload: '\uf093',         // nf-fa-upload
  download: '\uf019',       // nf-fa-download
  newFile: '\uf15b',        // nf-fa-file_o
  newFolder: '\uf07b',      // nf-fa-folder
  delete: '\uf1f8',         // nf-fa-trash
  edit: '\uf040',           // nf-fa-pencil
  rename: '\uf044',         // nf-fa-pencil_square_o
  search: '\uf002',         // nf-fa-search
  settings: '\uf013',       // nf-fa-cog
  close: '\uf00d',          // nf-fa-times
  back: '\uf060',           // nf-fa-arrow_left
  forward: '\uf061',        // nf-fa-arrow_right
  up: '\uf062',             // nf-fa-arrow_up
  down: '\uf063',           // nf-fa-arrow_down
  plus: '\uf067',           // nf-fa-plus
  minus: '\uf068',          // nf-fa-minus
  check: '\uf00c',          // nf-fa-check
  info: '\uf05a',           // nf-fa-info_circle
  warning: '\uf071',        // nf-fa-exclamation_triangle
  error: '\uf06a',          // nf-fa-exclamation_circle
  success: '\uf058',        // nf-fa-check_circle
  home: '\uf015',           // nf-fa-home
  star: '\uf005',           // nf-fa-star
  heart: '\uf004',          // nf-fa-heart
  user: '\uf007',           // nf-fa-user
  lock: '\uf023',           // nf-fa-lock
  unlock: '\uf09c',         // nf-fa-unlock
  sun: '\uf185',            // nf-fa-sun_o (light theme)
  moon: '\uf186',           // nf-fa-moon_o (dark theme)
};

/**
 * Get the icon for a file based on its extension
 * @param {string} filename - The filename to get icon for
 * @returns {string} The Nerd Font icon character
 */
function getFileIcon(filename) {
  if (!filename) return FILE_ICONS.default;
  
  const extension = filename.split('.').pop().toLowerCase();
  return FILE_ICONS[extension] || FILE_ICONS.default;
}

/**
 * Get the icon for a folder
 * @param {string} folderName - The folder name
 * @param {boolean} isOpen - Whether the folder is open
 * @returns {string} The Nerd Font icon character
 */
function getFolderIcon(folderName, isOpen = false) {
  if (isOpen) return FOLDER_ICONS.open;
  
  const normalizedName = folderName.toLowerCase();
  
  // Check for special folder names
  for (const [key, value] of Object.entries(FOLDER_ICONS)) {
    if (key === 'default' || key === 'open') continue;
    
    if (normalizedName === key || normalizedName.includes(key)) {
      return value;
    }
  }
  
  return FOLDER_ICONS.default;
}

/**
 * Get a UI icon by name
 * @param {string} name - The name of the UI icon
 * @returns {string} The Nerd Font icon character
 */
function getUIIcon(name) {
  return UI_ICONS[name] || '';
}

/**
 * Set an icon element's content
 * @param {HTMLElement} element - The element to set the icon on
 * @param {string} iconChar - The icon character to set
 */
function setIcon(element, iconChar) {
  if (element) {
    element.textContent = iconChar;
  }
}

/**
 * Initialize icons for all elements with specific data attributes
 * This function should be called after the DOM is loaded
 */
function initializeIcons() {
  // Initialize file icons
  document.querySelectorAll('[data-file-icon]').forEach(el => {
    const filename = el.getAttribute('data-file-icon');
    setIcon(el, getFileIcon(filename));
  });
  
  // Initialize folder icons
  document.querySelectorAll('[data-folder-icon]').forEach(el => {
    const folderName = el.getAttribute('data-folder-icon');
    const isOpen = el.hasAttribute('data-folder-open');
    setIcon(el, getFolderIcon(folderName, isOpen));
  });
  
  // Initialize UI icons
  document.querySelectorAll('[data-ui-icon]').forEach(el => {
    const iconName = el.getAttribute('data-ui-icon');
    setIcon(el, getUIIcon(iconName));
  });
}

// Export functions for use in other files
export {
  getFileIcon,
  getFolderIcon,
  getUIIcon,
  setIcon,
  initializeIcons,
  FILE_ICONS,
  FOLDER_ICONS,
  UI_ICONS
};
