
import { imageImporter } from '../../utils/image-importer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, query, filename } = req.body;

    if (!url && !query) {
      return res.status(400).json({ error: 'Either url or query is required' });
    }

    let localImagePath;

    if (query) {
      // Import from Unsplash using search query
      localImagePath = await imageImporter.importUnsplashImage(query, filename);
    } else {
      // Import from direct URL
      localImagePath = await imageImporter.importImageFromUrl(url, filename);
    }

    res.status(200).json({
      success: true,
      localPath: localImagePath,
      message: 'Image imported successfully'
    });

  } catch (error) {
    console.error('Image import error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import image'
    });
  }
}
