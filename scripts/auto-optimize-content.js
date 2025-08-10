
#!/usr/bin/env node

import { imageImporter } from '../utils/image-importer.js';
import { imageOptimizer } from '../utils/image-optimizer.js';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

class ContentOptimizer {
  constructor() {
    this.postsDir = path.join(process.cwd(), 'posts');
    this.imagesDir = path.join(process.cwd(), 'public/images');
  }

  async optimizeNewContent() {
    console.log('🚀 Starting automated content optimization...');
    
    try {
      // Get all MDX files
      const files = await fs.readdir(this.postsDir);
      const mdxFiles = files.filter(file => file.endsWith('.mdx'));
      
      for (const file of mdxFiles) {
        await this.processContentFile(file);
      }
      
      // Optimize all images in the images directory
      await this.optimizeAllImages();
      
      console.log('✅ Content optimization completed!');
    } catch (error) {
      console.error('❌ Content optimization failed:', error);
    }
  }

  async processContentFile(filename) {
    const filePath = path.join(this.postsDir, filename);
    const content = await fs.readFile(filePath, 'utf8');
    const { data: frontmatter, content: markdownContent } = matter(content);
    
    let hasChanges = false;
    
    // Auto-import feature image if missing
    if (!frontmatter.featuredImage && frontmatter.title) {
      console.log(`📸 Auto-importing feature image for: ${frontmatter.title}`);
      
      try {
        const localImagePath = await imageImporter.importUnsplashImage(
          frontmatter.title,
          `${filename.replace('.mdx', '')}-feature.jpg`
        );
        
        frontmatter.featuredImage = localImagePath;
        hasChanges = true;
        
        console.log(`✅ Feature image imported: ${localImagePath}`);
      } catch (error) {
        console.warn(`⚠️  Failed to import feature image for ${filename}:`, error.message);
      }
    }
    
    // Extract and optimize inline images
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let updatedContent = markdownContent;
    let match;
    
    while ((match = imageRegex.exec(markdownContent)) !== null) {
      const [fullMatch, altText, imageUrl] = match;
      
      // Skip if already local
      if (imageUrl.startsWith('/images/')) continue;
      
      try {
        console.log(`📥 Importing inline image: ${imageUrl}`);
        const localImagePath = await imageImporter.importImageFromUrl(
          imageUrl,
          `${filename.replace('.mdx', '')}-inline-${Date.now()}.jpg`
        );
        
        updatedContent = updatedContent.replace(fullMatch, `![${altText}](${localImagePath})`);
        hasChanges = true;
        
        console.log(`✅ Inline image imported: ${localImagePath}`);
      } catch (error) {
        console.warn(`⚠️  Failed to import inline image ${imageUrl}:`, error.message);
      }
    }
    
    // Save changes if any
    if (hasChanges) {
      const newContent = matter.stringify(updatedContent, frontmatter);
      await fs.writeFile(filePath, newContent);
      console.log(`💾 Updated content file: ${filename}`);
    }
  }

  async optimizeAllImages() {
    console.log('🖼️  Optimizing all images...');
    
    try {
      const results = await imageOptimizer.optimizeDirectory(this.imagesDir, null, {
        quality: 85,
        progressive: true,
        removeMetadata: true
      });

      let totalSaved = 0;
      let successCount = 0;

      for (const result of results) {
        if (result.success && result.compressionRatio) {
          successCount++;
          totalSaved += result.compressionRatio.savedBytes;
        }
      }

      console.log(`✅ Optimized ${successCount} images`);
      console.log(`💾 Total space saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
    } catch (error) {
      console.warn('⚠️  Image optimization failed:', error.message);
    }
  }
}

// Auto-optimize on file changes (development)
async function watchForChanges() {
  const { watch } = await import('chokidar');
  const postsDir = path.join(process.cwd(), 'posts');
  
  console.log('👀 Watching for content changes...');
  
  const watcher = watch(postsDir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  watcher.on('add', async (filePath) => {
    if (filePath.endsWith('.mdx')) {
      console.log(`📝 New content detected: ${path.basename(filePath)}`);
      const optimizer = new ContentOptimizer();
      await optimizer.processContentFile(path.basename(filePath));
    }
  });

  watcher.on('change', async (filePath) => {
    if (filePath.endsWith('.mdx')) {
      console.log(`📝 Content updated: ${path.basename(filePath)}`);
      const optimizer = new ContentOptimizer();
      await optimizer.processContentFile(path.basename(filePath));
    }
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const optimizer = new ContentOptimizer();
  
  if (args.includes('--watch')) {
    await watchForChanges();
  } else {
    await optimizer.optimizeNewContent();
  }
}

main().catch(console.error);
