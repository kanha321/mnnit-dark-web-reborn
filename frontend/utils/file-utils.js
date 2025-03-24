/**
 * File utility functions
 * Helps with file type detection and handling
 */

/**
 * Check if a file is likely a text file based on extension
 * @param {string} filename - The filename to check
 * @returns {boolean} Whether it's likely a text file
 */
export function isTextFile(filename) {
  if (!filename) return false;
  
  const textExtensions = [
    'txt', 'md', 'markdown', 'js', 'jsx', 'ts', 'tsx', 'html', 'htm', 'css', 
    'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'yml', 'ini', 'config', 
    'conf', 'sh', 'bash', 'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp', 
    'cs', 'go', 'rs', 'swift', 'kt', 'sql', 'graphql', 'vue', 'svelte'
  ];
  
  const extension = filename.split('.').pop().toLowerCase();
  return textExtensions.includes(extension);
}

/**
 * Get a syntax highlighting language for a file by its extension
 * @param {string} filename - Filename to check
 * @returns {string} Language identifier for syntax highlighting
 */
export function getSyntaxLanguage(filename) {
  if (!filename) return 'plaintext';
  
  const extension = filename.split('.').pop().toLowerCase();
  
  // Map file extensions to syntax languages
  const languageMap = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    json: 'json',
    md: 'markdown',
    markdown: 'markdown',
    xml: 'xml',
    svg: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    py: 'python',
    rb: 'ruby',
    php: 'php',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    sql: 'sql',
  };
  
  return languageMap[extension] || 'plaintext';
}

/**
 * Get estimated file size based on content length
 * @param {string} content - File content
 * @returns {string} Human-readable file size
 */
export function getEstimatedSize(content) {
  if (!content) return '0 B';
  
  // Calculate bytes (2 bytes per character in UTF-16)
  const bytes = content.length * 2;
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
