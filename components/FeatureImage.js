
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FeatureImage({ 
  query, 
  width = 800, 
  height = 400, 
  className = '', 
  alt = 'Feature image',
  onImageSelect = null 
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      fetchUnsplashImage(query);
    }
  }, [query]);

  const fetchUnsplashImage = async (searchQuery) => {
    setLoading(true);
    setError('');

    try {
      // Using Unsplash Source API (no API key required)
      const cleanQuery = encodeURIComponent(searchQuery.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ''));
      const unsplashUrl = `https://source.unsplash.com/${width}x${height}/?${cleanQuery}`;
      
      // For better image data, we can also use the public API
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${cleanQuery}&orientation=landscape`, {
        headers: {
          'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY' // This would need to be in environment
        }
      }).catch(() => null);

      let imageInfo = null;
      if (response && response.ok) {
        const data = await response.json();
        imageInfo = {
          url: data.urls.regular,
          downloadUrl: data.links.download_location,
          author: data.user.name,
          authorUrl: data.user.links.html,
          description: data.description || data.alt_description || alt,
          id: data.id
        };
        setImageUrl(data.urls.regular);
      } else {
        // Fallback to source API
        setImageUrl(unsplashUrl);
        imageInfo = {
          url: unsplashUrl,
          description: alt,
          author: 'Unsplash',
          authorUrl: 'https://unsplash.com'
        };
      }

      setImageData(imageInfo);
      if (onImageSelect) {
        onImageSelect(imageInfo);
      }

    } catch (err) {
      console.error('Error fetching Unsplash image:', err);
      setError('Failed to load feature image');
      // Fallback to a placeholder
      const fallbackUrl = `https://via.placeholder.com/${width}x${height}/6366f1/ffffff?text=${encodeURIComponent(alt)}`;
      setImageUrl(fallbackUrl);
      setImageData({
        url: fallbackUrl,
        description: alt,
        author: 'Placeholder',
        authorUrl: '#'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (query) {
      fetchUnsplashImage(query);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading image...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-600 rounded-lg flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center p-4">
          <p className="text-red-700 dark:text-red-300 text-sm mb-2">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {imageUrl && (
        <>
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={imageData?.description || alt}
              width={width}
              height={height}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized // Since we're using external URLs
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
          </div>
          
          {imageData && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                Photo by{' '}
                <a
                  href={imageData.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  {imageData.author}
                </a>
                {' '}on{' '}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  Unsplash
                </a>
              </div>
            </div>
          )}
          
          <button
            onClick={handleRefresh}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Get new image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
