
import { imageOptimizer } from '../../utils/image-optimizer';
import path from 'path';
import fs from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imagePath, options = {} } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path is required' });
    }

    // Ensure the image is in the public directory for security
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Optimize the image
    const result = await imageOptimizer.optimizeImage(fullPath, null, {
      quality: options.quality || 85,
      width: options.width || null,
      height: options.height || null,
      progressive: options.progressive !== false,
      removeMetadata: options.removeMetadata !== false
    });

    if (result.success) {
      // Return the optimized image path relative to public
      const relativePath = path.relative(
        path.join(process.cwd(), 'public'), 
        result.optimizedPath
      ).replace(/\\/g, '/');

      res.status(200).json({
        success: true,
        originalPath: imagePath,
        optimizedPath: `/${relativePath}`,
        compressionRatio: result.compressionRatio
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Image optimization error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Increase body size limit for image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
