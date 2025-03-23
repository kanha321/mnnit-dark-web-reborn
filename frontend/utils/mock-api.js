/**
 * Mock API implementation for development without backend
 */

// Sample directory structure
const fileSystem = {
    '/': {
        type: 'directory',
        children: ['documents', 'images', 'music', 'videos', 'downloads', 'sample.txt', 'readme.md'],
        modified: '2023-10-15T10:30:00Z'
    },
    '/documents': {
        type: 'directory',
        children: ['work', 'personal', 'project-notes.txt', 'report.pdf'],
        modified: '2023-10-14T15:20:00Z'
    },
    '/documents/work': {
        type: 'directory',
        children: ['presentation.pptx', 'budget.xlsx', 'meeting-notes.docx'],
        modified: '2023-10-12T09:15:00Z'
    },
    '/documents/personal': {
        type: 'directory',
        children: ['resume.pdf', 'tax-return-2023.pdf', 'vacation-plans.docx'],
        modified: '2023-10-10T14:45:00Z'
    },
    '/images': {
        type: 'directory',
        children: ['vacation', 'screenshots', 'profile-picture.jpg', 'banner.png'],
        modified: '2023-10-08T11:30:00Z'
    },
    '/images/vacation': {
        type: 'directory',
        children: ['beach.jpg', 'mountains.jpg', 'city.jpg', 'sunset.jpg'],
        modified: '2023-09-20T16:40:00Z'
    },
    '/images/screenshots': {
        type: 'directory',
        children: ['screenshot1.png', 'screenshot2.png', 'screenshot3.png'],
        modified: '2023-09-15T08:25:00Z'
    },
    '/music': {
        type: 'directory',
        children: ['rock', 'jazz', 'classical', 'favorite-song.mp3'],
        modified: '2023-09-05T19:10:00Z'
    },
    '/videos': {
        type: 'directory',
        children: ['tutorials', 'family', 'travel-vlog.mp4', 'funny-cat.mp4'],
        modified: '2023-08-28T13:50:00Z'
    },
    '/downloads': {
        type: 'directory',
        children: ['software.zip', 'book.pdf', 'dataset.csv', 'movie.mkv'],
        modified: '2023-08-20T10:15:00Z'
    }
};

// File details for non-directory files
const fileDetails = {
    '/sample.txt': {
        size: 1024, // 1 KB
        modified: '2023-10-15T08:20:00Z',
        type: 'text/plain'
    },
    '/readme.md': {
        size: 2048, // 2 KB
        modified: '2023-10-14T11:35:00Z',
        type: 'text/markdown'
    },
    '/documents/project-notes.txt': {
        size: 5120, // 5 KB
        modified: '2023-10-11T14:25:00Z',
        type: 'text/plain'
    },
    '/documents/report.pdf': {
        size: 1048576, // 1 MB
        modified: '2023-10-09T16:40:00Z',
        type: 'application/pdf'
    },
    '/documents/work/presentation.pptx': {
        size: 3145728, // 3 MB
        modified: '2023-10-08T09:15:00Z',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
    '/documents/work/budget.xlsx': {
        size: 524288, // 512 KB
        modified: '2023-10-07T13:20:00Z',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
    '/documents/work/meeting-notes.docx': {
        size: 262144, // 256 KB
        modified: '2023-10-06T15:30:00Z',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    '/documents/personal/resume.pdf': {
        size: 524288, // 512 KB
        modified: '2023-10-05T11:45:00Z',
        type: 'application/pdf'
    },
    '/documents/personal/tax-return-2023.pdf': {
        size: 1572864, // 1.5 MB
        modified: '2023-10-04T10:10:00Z',
        type: 'application/pdf'
    },
    '/documents/personal/vacation-plans.docx': {
        size: 131072, // 128 KB
        modified: '2023-10-03T14:20:00Z',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    '/images/profile-picture.jpg': {
        size: 262144, // 256 KB
        modified: '2023-09-28T16:15:00Z',
        type: 'image/jpeg'
    },
    '/images/banner.png': {
        size: 1048576, // 1 MB
        modified: '2023-09-27T12:30:00Z',
        type: 'image/png'
    },
    '/images/vacation/beach.jpg': {
        size: 2097152, // 2 MB
        modified: '2023-09-18T14:25:00Z',
        type: 'image/jpeg'
    },
    '/images/vacation/mountains.jpg': {
        size: 3145728, // 3 MB
        modified: '2023-09-17T11:20:00Z',
        type: 'image/jpeg'
    },
    '/images/vacation/city.jpg': {
        size: 2621440, // 2.5 MB
        modified: '2023-09-16T09:40:00Z',
        type: 'image/jpeg'
    },
    '/images/vacation/sunset.jpg': {
        size: 1835008, // 1.75 MB
        modified: '2023-09-15T17:30:00Z',
        type: 'image/jpeg'
    },
    '/images/screenshots/screenshot1.png': {
        size: 524288, // 512 KB
        modified: '2023-09-14T13:15:00Z',
        type: 'image/png'
    },
    '/images/screenshots/screenshot2.png': {
        size: 786432, // 768 KB
        modified: '2023-09-13T10:50:00Z',
        type: 'image/png'
    },
    '/images/screenshots/screenshot3.png': {
        size: 655360, // 640 KB
        modified: '2023-09-12T08:25:00Z',
        type: 'image/png'
    },
    '/music/favorite-song.mp3': {
        size: 5242880, // 5 MB
        modified: '2023-09-02T15:40:00Z',
        type: 'audio/mpeg'
    },
    '/videos/travel-vlog.mp4': {
        size: 104857600, // 100 MB
        modified: '2023-08-25T11:30:00Z',
        type: 'video/mp4'
    },
    '/videos/funny-cat.mp4': {
        size: 52428800, // 50 MB
        modified: '2023-08-23T14:15:00Z',
        type: 'video/mp4'
    },
    '/downloads/software.zip': {
        size: 52428800, // 50 MB
        modified: '2023-08-18T09:20:00Z',
        type: 'application/zip'
    },
    '/downloads/book.pdf': {
        size: 10485760, // 10 MB
        modified: '2023-08-17T16:45:00Z',
        type: 'application/pdf'
    },
    '/downloads/dataset.csv': {
        size: 15728640, // 15 MB
        modified: '2023-08-16T13:10:00Z',
        type: 'text/csv'
    },
    '/downloads/movie.mkv': {
        size: 2147483648, // 2 GB
        modified: '2023-08-15T19:30:00Z',
        type: 'video/x-matroska'
    }
};

// Mock file contents for text files (first 1000 characters)
const fileContents = {
    '/sample.txt': 'This is a sample text file.\n\nIt contains some example content that will be displayed in the file preview.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.',
    
    '/readme.md': '# File Explorer Project\n\n## Overview\nThis is a sample markdown file for the file explorer project.\n\n## Features\n- Browse files and directories\n- Preview files on hover\n- Open files in editor\n- View file details\n\n## Installation\n```\nnpm install\nnpm start\n```\n\n## License\nMIT',
};

// Helper function to get file name from path
function getNameFromPath(path) {
    return path === '/' ? 'root' : path.split('/').filter(Boolean).pop();
}

// Simulate network delay
function delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock API for file listing
async function getFileList(path = '/') {
    // Normalize the path
    if (!path.startsWith('/')) path = '/' + path;
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
    
    // Simulate network delay
    await delay(Math.random() * 500 + 200); // 200-700ms delay
    
    // Check if path exists
    if (!fileSystem[path]) {
        throw new Error(`Path not found: ${path}`);
    }
    
    // Check if it's a directory
    if (fileSystem[path].type !== 'directory') {
        throw new Error(`Not a directory: ${path}`);
    }
    
    // Build the result
    const result = fileSystem[path].children.map(childName => {
        const childPath = path === '/' ? `/${childName}` : `${path}/${childName}`;
        const isDirectory = fileSystem[childPath] && fileSystem[childPath].type === 'directory';
        
        return {
            name: childName,
            path: childPath,
            isDirectory,
            size: isDirectory ? 0 : fileDetails[childPath].size,
            modified: isDirectory ? fileSystem[childPath].modified : fileDetails[childPath].modified,
            type: isDirectory ? 'directory' : fileDetails[childPath].type
        };
    });
    
    return result;
}

// Mock API for file details
async function getFileDetails(filePath) {
    // Normalize the path
    if (!filePath.startsWith('/')) filePath = '/' + filePath;
    
    // Simulate network delay
    await delay(Math.random() * 300 + 100); // 100-400ms delay
    
    // Check if file exists
    if (fileSystem[filePath] && fileSystem[filePath].type === 'directory') {
        // It's a directory
        return {
            name: getNameFromPath(filePath),
            path: filePath,
            isDirectory: true,
            children: fileSystem[filePath].children.length,
            modified: fileSystem[filePath].modified
        };
    } else if (fileDetails[filePath]) {
        // It's a file
        return {
            name: getNameFromPath(filePath),
            path: filePath,
            isDirectory: false,
            size: fileDetails[filePath].size,
            modified: fileDetails[filePath].modified,
            type: fileDetails[filePath].type
        };
    } else {
        throw new Error(`File not found: ${filePath}`);
    }
}

// Mock API for file content preview
async function getFileContent(filePath) {
    // Normalize the path
    if (!filePath.startsWith('/')) filePath = '/' + filePath;
    
    // Simulate network delay
    await delay(Math.random() * 300 + 100);
    
    // Check if we have content for this file
    if (fileContents[filePath]) {
        return fileContents[filePath];
    }
    
    // Generate mock content based on file type
    if (fileDetails[filePath]) {
        const fileType = fileDetails[filePath].type;
        const fileName = getNameFromPath(filePath);
        
        if (fileType.includes('text/') || fileType.includes('application/json') || 
            fileType.includes('javascript') || fileType.includes('css')) {
            
            if (fileName.endsWith('.js')) {
                return `// This is a generated JavaScript file\n\nfunction example() {\n  console.log("Hello from ${fileName}");\n}\n\nexample();`;
            } else if (fileName.endsWith('.html')) {
                return `<!DOCTYPE html>\n<html>\n<head>\n  <title>${fileName}</title>\n</head>\n<body>\n  <h1>Generated HTML</h1>\n  <p>This is a sample HTML file generated for preview.</p>\n</body>\n</html>`;
            } else if (fileName.endsWith('.css')) {
                return `/* Generated CSS for ${fileName} */\n\nbody {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  color: #333;\n}\n\nh1 {\n  color: blue;\n}`;
            } else if (fileName.endsWith('.json')) {
                return `{\n  "fileName": "${fileName}",\n  "path": "${filePath}",\n  "generated": true,\n  "timestamp": "${new Date().toISOString()}"\n}`;
            }
            
            // Generic text content
            return `This is generated content for ${fileName}.\nThe file is located at ${filePath}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.`;
        }
    }
    
    // No content available
    throw new Error(`Cannot get content for ${filePath}`);
}

// Mock API for file upload
async function uploadFile(file, destination = '/') {
    // Simulate network delay and upload progress
    await delay(file.size / 10240); // Slower for bigger files
    
    // Return success response
    return {
        success: true,
        message: `File "${file.name}" uploaded successfully to ${destination}`,
        path: `${destination}/${file.name}`
    };
}

// Export the mock API functions
export {
    getFileList,
    getFileDetails,
    getFileContent,
    uploadFile
};
