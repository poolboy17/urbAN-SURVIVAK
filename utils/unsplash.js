
// Unsplash utility functions
export const getUnsplashImageUrl = (query, width = 800, height = 400) => {
  const cleanQuery = encodeURIComponent(query.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''));
  return `https://source.unsplash.com/${width}x${height}/?${cleanQuery}`;
};

export const searchUnsplashImages = async (query, count = 1) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&count=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo-access-key'}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Unsplash API');
    }

    const data = await response.json();
    const images = Array.isArray(data) ? data : [data];
    
    return images.map(img => ({
      id: img.id,
      url: img.urls.regular,
      smallUrl: img.urls.small,
      largeUrl: img.urls.full,
      description: img.description || img.alt_description || query,
      author: img.user.name,
      authorUrl: img.user.links.html,
      downloadUrl: img.links.download_location,
      color: img.color
    }));

  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    // Return fallback image data
    return [{
      id: 'fallback',
      url: getUnsplashImageUrl(query),
      description: query,
      author: 'Unsplash',
      authorUrl: 'https://unsplash.com'
    }];
  }
};

export const generateImagePrompt = (articleTitle, keywords = []) => {
  // Extract key concepts from title and keywords for better image search
  const concepts = [
    ...articleTitle.split(' ').filter(word => word.length > 3),
    ...keywords.slice(0, 3)
  ];
  
  return concepts.join(' ').toLowerCase();
};
