
#!/usr/bin/env node

import { imageOptimizer } from '../utils/image-optimizer.js';
import path from 'path';
import fs from 'fs/promises';

async function optimizePublicImages() {
  console.log('🖼️  Starting image optimization...');
  
  const publicImagesDir = path.join(process.cwd(), 'public/images');
  
  try {
    // Check if directory exists
    await fs.access(publicImagesDir);
    
    const results = await imageOptimizer.optimizeDirectory(publicImagesDir, null, {
      quality: 85,
      progressive: true,
      removeMetadata: true
    });

    let totalSaved = 0;
    let successCount = 0;
    let errorCount = 0;

    console.log('\n📊 Optimization Results:');
    console.log('═══════════════════════════════════════');

    for (const result of results) {
      if (result.success) {
        successCount++;
        const ratio = result.compressionRatio;
        if (ratio) {
          totalSaved += ratio.savedBytes;
          console.log(`✅ ${path.basename(result.originalPath)} → ${path.basename(result.optimizedPath)}`);
          console.log(`   💾 Saved: ${(ratio.savedBytes / 1024).toFixed(2)}KB (${ratio.compressionPercent}%)`);
        }
      } else {
        errorCount++;
        console.log(`❌ Failed: ${path.basename(result.originalPath)} - ${result.error}`);
      }
    }

    console.log('\n📈 Summary:');
    console.log(`✅ Successfully optimized: ${successCount} images`);
    console.log(`❌ Failed: ${errorCount} images`);
    console.log(`💾 Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📁 No public/images directory found. Creating it...');
      await fs.mkdir(publicImagesDir, { recursive: true });
      console.log('✅ Directory created. Add images to public/images and run again.');
    } else {
      console.error('❌ Error optimizing images:', error.message);
    }
  }
}

// Generate responsive versions
async function generateResponsiveImages() {
  console.log('🔄 Generating responsive image variants...');
  
  const publicImagesDir = path.join(process.cwd(), 'public/images');
  
  try {
    const files = await fs.readdir(publicImagesDir);
    
    for (const file of files) {
      const filePath = path.join(publicImagesDir, file);
      const ext = path.extname(file).toLowerCase();
      
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        console.log(`🔄 Processing ${file}...`);
        
        const results = await imageOptimizer.generateResponsiveImages(
          filePath, 
          [400, 800, 1200, 1600]
        );
        
        console.log(`✅ Generated ${results.length} responsive variants for ${file}`);
      }
    }
  } catch (error) {
    console.error('❌ Error generating responsive images:', error.message);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--responsive')) {
    await generateResponsiveImages();
  } else {
    await optimizePublicImages();
  }
  
  console.log('\n🎉 Image optimization complete!');
}

main().catch(console.error);
