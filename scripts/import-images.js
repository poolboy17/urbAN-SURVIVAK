
#!/usr/bin/env node

import { imageImporter } from '../utils/image-importer.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function importFromQuery() {
  const query = await askQuestion('Enter search query: ');
  const filename = await askQuestion('Enter filename (optional): ');
  
  console.log('🔄 Importing image...');
  try {
    const localPath = await imageImporter.importUnsplashImage(query, filename);
    console.log(`✅ Image imported successfully: ${localPath}`);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

async function importFromUrl() {
  const url = await askQuestion('Enter image URL: ');
  const filename = await askQuestion('Enter filename (optional): ');
  
  console.log('🔄 Importing image...');
  try {
    const localPath = await imageImporter.importImageFromUrl(url, filename);
    console.log(`✅ Image imported successfully: ${localPath}`);
  } catch (error) {
    console.error('❌ Import failed:', error.message);
  }
}

async function listLocalImages() {
  console.log('📁 Local images:');
  try {
    const images = await imageImporter.getLocalImagesList();
    if (images.length === 0) {
      console.log('No local images found.');
    } else {
      images.forEach((img, index) => {
        console.log(`${index + 1}. ${img}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to list images:', error.message);
  }
}

async function cleanupOldImages() {
  console.log('🧹 Cleaning up old images...');
  try {
    await imageImporter.cleanupOldImages();
    console.log('✅ Cleanup completed');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🖼️  Image Import Tool');
  console.log('==================');
  console.log('1. Import from search query');
  console.log('2. Import from URL');
  console.log('3. List local images');
  console.log('4. Cleanup old images');
  console.log('5. Exit');
  
  const choice = await askQuestion('Select option (1-5): ');
  
  switch (choice) {
    case '1':
      await importFromQuery();
      break;
    case '2':
      await importFromUrl();
      break;
    case '3':
      await listLocalImages();
      break;
    case '4':
      await cleanupOldImages();
      break;
    case '5':
      console.log('👋 Goodbye!');
      process.exit(0);
      break;
    default:
      console.log('Invalid option');
  }
  
  rl.close();
}

main().catch(console.error);
