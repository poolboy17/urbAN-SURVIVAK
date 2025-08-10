
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export class ImageOptimizer {
  constructor() {
    this.supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
  }

  async optimizeImage(inputPath, outputPath = null, options = {}) {
    const {
      quality = 85,
      width = null,
      height = null,
      progressive = true,
      removeMetadata = true,
    } = options;

    try {
      const inputExt = path.extname(inputPath).toLowerCase();
      
      if (!this.supportedFormats.includes(inputExt)) {
        throw new Error(`Unsupported image format: ${inputExt}`);
      }

      // Generate output path if not provided
      if (!outputPath) {
        const dir = path.dirname(inputPath);
        const name = path.basename(inputPath, inputExt);
        outputPath = path.join(dir, `${name}.webp`);
      }

      let pipeline = sharp(inputPath);

      // Remove metadata for smaller file size
      if (removeMetadata) {
        pipeline = pipeline.withMetadata({});
      }

      // Resize if dimensions provided
      if (width || height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Convert to WebP with optimization
      const result = await pipeline
        .webp({
          quality,
          progressive,
          effort: 6, // Maximum compression effort
          nearLossless: false
        })
        .toFile(outputPath);

      return {
        success: true,
        originalPath: inputPath,
        optimizedPath: outputPath,
        originalSize: result.size,
        compressionRatio: await this.calculateCompressionRatio(inputPath, outputPath)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalPath: inputPath
      };
    }
  }

  async optimizeDirectory(inputDir, outputDir = null, options = {}) {
    outputDir = outputDir || inputDir;
    
    try {
      const files = await fs.readdir(inputDir);
      const results = [];

      for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const stat = await fs.stat(inputPath);

        if (stat.isFile()) {
          const ext = path.extname(file).toLowerCase();
          
          if (this.supportedFormats.includes(ext)) {
            const result = await this.optimizeImage(inputPath, null, options);
            results.push(result);
          }
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to optimize directory: ${error.message}`);
    }
  }

  async calculateCompressionRatio(originalPath, optimizedPath) {
    try {
      const [originalStats, optimizedStats] = await Promise.all([
        fs.stat(originalPath),
        fs.stat(optimizedPath)
      ]);

      const ratio = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(2);
      return {
        originalSize: originalStats.size,
        optimizedSize: optimizedStats.size,
        savedBytes: originalStats.size - optimizedStats.size,
        compressionPercent: ratio
      };
    } catch (error) {
      return null;
    }
  }

  // Generate responsive image sizes
  async generateResponsiveImages(inputPath, sizes = [400, 800, 1200, 1600]) {
    const results = [];
    const inputExt = path.extname(inputPath);
    const dir = path.dirname(inputPath);
    const name = path.basename(inputPath, inputExt);

    for (const size of sizes) {
      const outputPath = path.join(dir, `${name}-${size}w.webp`);
      
      const result = await this.optimizeImage(inputPath, outputPath, {
        width: size,
        quality: 85
      });
      
      results.push(result);
    }

    return results;
  }
}

export const imageOptimizer = new ImageOptimizer();

// Utility functions for Next.js integration
export function getOptimizedImageUrl(originalUrl, width = null) {
  if (originalUrl.includes('.webp')) return originalUrl;
  
  const url = new URL(originalUrl, 'http://localhost');
  const pathname = url.pathname;
  const ext = path.extname(pathname);
  const name = path.basename(pathname, ext);
  const dir = path.dirname(pathname);
  
  let optimizedPath = `${dir}/${name}.webp`;
  
  if (width) {
    optimizedPath = `${dir}/${name}-${width}w.webp`;
  }
  
  return optimizedPath;
}

export function generateSrcSet(imagePath, sizes = [400, 800, 1200, 1600]) {
  const ext = path.extname(imagePath);
  const name = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  
  return sizes
    .map(size => `${dir}/${name}-${size}w.webp ${size}w`)
    .join(', ');
}
