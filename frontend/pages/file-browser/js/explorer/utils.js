/**
 * Explorer utilities
 * Helper functions specific to the explorer component
 */

// Get the parent directory of a path
export function getParentPath(path) {
  if (path === '/') return null;
  
  const pathParts = path.split('/').filter(Boolean);
  pathParts.pop();
  
  return pathParts.length === 0 ? '/' : '/' + pathParts.join('/');
}

// Escape special characters in path for use in selectors
export function escapePathForSelector(path) {
  return path.replace(/\//g, '\\/').replace(/\./g, '\\.');
}

// Get path depth (number of segments)
export function getPathDepth(path) {
  if (path === '/') return 0;
  return path.split('/').filter(Boolean).length;
}

// Check if path is a child of another path
export function isChildPath(childPath, parentPath) {
  if (parentPath === '/') {
    return childPath !== '/' && childPath.startsWith('/');
  }
  
  return childPath.startsWith(`${parentPath}/`);
}

// Get the relative path from a parent path
export function getRelativePath(fullPath, basePath) {
  if (basePath === '/') {
    return fullPath.startsWith('/') ? fullPath.substring(1) : fullPath;
  }
  
  return fullPath.startsWith(`${basePath}/`) ? fullPath.substring(basePath.length + 1) : fullPath;
}
