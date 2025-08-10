
import fs from 'fs/promises';
import path from 'path';
import { imageOptimizer } from './image-optimizer.js';

export class ImageImporter {
  constructor() {
    this.imagesDir = path.join(process.cwd(), 'public/images');
    this.importedDir = path.join(this.imagesDir, 'imported');
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.imagesDir, { recursive: true });
      await fs.mkdir(this.importedDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }

  async downloadImage(url, filename) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      const imagePath = path.join(this.importedDir, filename);
      
      await fs.writeFile(imagePath, Buffer.from(buffer));
      return imagePath;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  async importUnsplashImage(query, filename = null) {
    await this.ensureDirectories();
    
    try {
      // Generate filename if not provided
      if (!filename) {
        filename = `${query.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
      }

      // Check if already exists
      const localPath = path.join(this.importedDir, filename);
      try {
        await fs.access(localPath);
        return `/images/imported/${filename}`;
      } catch {
        // File doesn't exist, proceed with download
      }

      // Download from Unsplash
      const unsplashUrl = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;
      const downloadedPath = await this.downloadImage(unsplashUrl, filename);
      
      // Optimize the downloaded image
      const webpFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      await imageOptimizer.optimizeImage(downloadedPath, path.join(this.importedDir, webpFilename), {
        quality: 85,
        progressive: true
      });

      // Return local URL path
      return `/images/imported/${webpFilename}`;
    } catch (error) {
      console.error('Error importing Unsplash image:', error);
      // Return fallback local image if available
      return '/images/placeholder.jpg';
    }
  }

  async importImageFromUrl(url, filename = null) {
    await this.ensureDirectories();
    
    try {
      if (!filename) {
        const urlPath = new URL(url).pathname;
        filename = path.basename(urlPath) || `image-${Date.now()}.jpg`;
      }

      // Check if already exists
      const localPath = path.join(this.importedDir, filename);
      try {
        await fs.access(localPath);
        return `/images/imported/${filename}`;
      } catch {
        // File doesn't exist, proceed with download
      }

      const downloadedPath = await this.downloadImage(url, filename);
      
      // Optimize the downloaded image
      const webpFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      await imageOptimizer.optimizeImage(downloadedPath, path.join(this.importedDir, webpFilename));

      return `/images/imported/${webpFilename}`;
    } catch (error) {
      console.error('Error importing image from URL:', error);
      return '/images/placeholder.jpg';
    }
  }

  async getLocalImagesList() {
    try {
      await this.ensureDirectories();
      const files = await fs.readdir(this.importedDir);
      return files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
                  .map(file => `/images/imported/${file}`);
    } catch (error) {
      console.error('Error getting local images list:', error);
      return [];
    }
  }

  async cleanupOldImages(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
    try {
      const files = await fs.readdir(this.importedDir);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.importedDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          console.log(`Cleaned up old image: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old images:', error);
    }
  }
}

export const imageImporter = new ImageImporter();
