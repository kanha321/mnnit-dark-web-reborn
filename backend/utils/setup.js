/**
 * Setup utilities for the backend
 */
const fs = require('fs');
const path = require('path');
const { getFilesDir } = require('./files');

/**
 * Create the files directory if it doesn't exist
 */
function createFilesDirectory() {
  const filesDir = getFilesDir();
  
  if (!fs.existsSync(filesDir)) {
    console.log(`Creating files directory at ${filesDir}`);
    fs.mkdirSync(filesDir, { recursive: true });
    
    // Create a sample README file
    const readmePath = path.join(filesDir, 'README.txt');
    fs.writeFileSync(readmePath, 
      'This is the MNNIT Dark Web files directory.\n\n' +
      'Files placed here will be accessible via the application.\n\n' +
      'Created on: ' + new Date().toISOString() + '\n'
    );
    
    // Create a few sample directories
    fs.mkdirSync(path.join(filesDir, 'documents'), { recursive: true });
    fs.mkdirSync(path.join(filesDir, 'images'), { recursive: true });
    fs.mkdirSync(path.join(filesDir, 'code'), { recursive: true });
    
    // Create a sample HTML file
    const htmlPath = path.join(filesDir, 'sample.html');
    fs.writeFileSync(htmlPath, 
      '<!DOCTYPE html>\n' +
      '<html>\n' +
      '<head>\n' +
      '  <title>Sample HTML File</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <h1>Welcome to MNNIT Dark Web</h1>\n' +
      '  <p>This is a sample HTML file for demonstration.</p>\n' +
      '</body>\n' +
      '</html>\n'
    );
    
    // Create a sample JavaScript file
    const jsPath = path.join(filesDir, 'code', 'example.js');
    fs.writeFileSync(jsPath, 
      '/**\n' +
      ' * Sample JavaScript file\n' +
      ' */\n\n' +
      'function greet(name) {\n' +
      '  return `Hello, ${name}!`;\n' +
      '}\n\n' +
      'console.log(greet("World"));\n'
    );
    
    console.log('Sample files created successfully');
  }
}

module.exports = {
  createFilesDirectory
};
