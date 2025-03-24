/**
 * Controller for file operations
 */
const fs = require('fs').promises;
const path = require('path');
const { isPathSafe, getMimeType, getFilesDir, formatFileInfo } = require('../utils/files');
const fsStandard = require('fs');

/**
 * Get all files in a directory
 */
exports.getAllFiles = async (req, res, next) => {
  try {
    // Get directory path from query parameter, default to root
    let dirPath = req.query.path || '/';
    
    // Normalize path to prevent directory traversal
    dirPath = dirPath.startsWith('/') ? dirPath.slice(1) : dirPath;
    
    // Get the absolute path to the directory
    const filesDir = getFilesDir();
    const absolutePath = path.join(filesDir, dirPath);
    
    // Make sure the path is within the allowed directory
    if (!isPathSafe(absolutePath, filesDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Make sure directory exists
    try {
      await fs.access(absolutePath);
    } catch (error) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    // Get directory stats to make sure it's a directory
    const stats = await fs.stat(absolutePath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ error: 'Not a directory' });
    }
    
    // Read directory contents
    const items = await fs.readdir(absolutePath);
    
    // Process each file/folder and get details
    const fileList = await Promise.all(items.map(async (item) => {
      const itemPath = path.join(absolutePath, item);
      const relativePath = path.join('/', dirPath, item).replace(/\\/g, '/');
      return formatFileInfo(itemPath, relativePath);
    }));
    
    return res.json(fileList);
  } catch (error) {
    next(error);
  }
};

/**
 * Get details for a specific file
 */
exports.getFileDetails = async (req, res, next) => {
  try {
    // Get file path from query parameter
    let filePath = req.query.path;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    // Normalize path to prevent directory traversal
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    
    // Get the absolute path to the file
    const filesDir = getFilesDir();
    const absolutePath = path.join(filesDir, filePath);
    
    // Make sure the path is within the allowed directory
    if (!isPathSafe(absolutePath, filesDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Make sure file exists
    try {
      await fs.access(absolutePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file details
    const relativePath = path.join('/', filePath).replace(/\\/g, '/');
    const fileInfo = await formatFileInfo(absolutePath, relativePath);
    
    return res.json(fileInfo);
  } catch (error) {
    next(error);
  }
};

/**
 * Get content of a specific file
 */
exports.getFileContent = async (req, res, next) => {
  try {
    // Get file path from query parameter
    let filePath = req.query.path;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    // Normalize path to prevent directory traversal
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    
    // Get the absolute path to the file
    const filesDir = getFilesDir();
    const absolutePath = path.join(filesDir, filePath);
    
    // Make sure the path is within the allowed directory
    if (!isPathSafe(absolutePath, filesDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Make sure file exists
    try {
      await fs.access(absolutePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file stats to make sure it's a file
    const stats = await fs.stat(absolutePath);
    if (stats.isDirectory()) {
      return res.status(400).json({ error: 'Cannot get content of a directory' });
    }
    
    // Get mime type
    const mimeType = getMimeType(absolutePath);
    
    // For binary files, just return metadata
    if (!mimeType.startsWith('text/') && !mimeType.includes('javascript') && 
        !mimeType.includes('json') && !mimeType.includes('xml')) {
      return res.status(400).json({ error: 'Binary files cannot be viewed as text' });
    }
    
    // Read file content
    const content = await fs.readFile(absolutePath, 'utf8');
    
    return res.json({ content });
  } catch (error) {
    next(error);
  }
};

/**
 * Download a file 
 */
exports.downloadFile = async (req, res, next) => {
  try {
    // Get file path from query parameter
    let filePath = req.query.path;
    
    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    
    // Normalize path to prevent directory traversal
    filePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    
    // Get the absolute path to the file
    const filesDir = getFilesDir();
    const absolutePath = path.join(filesDir, filePath);
    
    // Make sure the path is within the allowed directory
    if (!isPathSafe(absolutePath, filesDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Make sure file exists
    try {
      await fs.access(absolutePath);
    } catch (error) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file stats to make sure it's a file
    const stats = await fs.stat(absolutePath);
    if (stats.isDirectory()) {
      return res.status(400).json({ error: 'Cannot download a directory' });
    }
    
    // Get mime type
    const mimeType = getMimeType(absolutePath);
    
    // Set content disposition and type
    const fileName = path.basename(absolutePath);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    
    // Stream the file using standard fs (not promises)
    const fileStream = fsStandard.createReadStream(absolutePath);
    fileStream.pipe(res);
    
    // Handle stream errors
    fileStream.on('error', (error) => {
      console.error('Stream error:', error);
      // Only send error if headers haven't been sent
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming file' });
      }
    });
    
  } catch (error) {
    next(error);
  }
};
