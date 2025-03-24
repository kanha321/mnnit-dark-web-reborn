/**
 * Routes for file operations
 */
const express = require('express');
const { getAllFiles, getFileDetails, getFileContent, downloadFile } = require('../controllers/fileController');

const router = express.Router();

/**
 * @route   GET /api/files
 * @desc    List all files within a directory
 * @query   {string} path - Directory path within the files directory
 * @access  Public
 */
router.get('/', getAllFiles);

/**
 * @route   GET /api/files/:fileId
 * @desc    Get details for a specific file
 * @param   {string} fileId - Encoded file path
 * @access  Public
 */
router.get('/details', getFileDetails);

/**
 * @route   GET /api/files/:fileId/content
 * @desc    Get content of a specific file
 * @param   {string} fileId - Encoded file path
 * @access  Public
 */
router.get('/content', getFileContent);

/**
 * @route   GET /api/files/download
 * @desc    Download a file
 * @query   {string} path - Path to the file to download
 * @access  Public
 */
router.get('/download', downloadFile);

module.exports = router;
