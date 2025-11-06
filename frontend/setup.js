const fs = require('fs');
const path = require('path');

console.log('Checking frontend setup...');

// Check if public folder exists
if (!fs.existsSync('public')) {
  console.log('Creating public folder...');
  fs.mkdirSync('public');
}

// Check if src folder exists
if (!fs.existsSync('src')) {
  console.log('Creating src folder...');
  fs.mkdirSync('src');
}

// Create subdirectories
const folders = [
  'src/components',
  'src/pages', 
  'src/utils',
  'src/context'
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    console.log(`Creating ${folder}...`);
    fs.mkdirSync(folder, { recursive: true });
  }
});

console.log('Frontend folder structure created!');
console.log('Run: npm start to start the development server');