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
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localImagePath, setLocalImagePath] = useState(null);

  const importAndFetchImage = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      // Import image to local storage
      const response = await fetch('/api/import-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.success) {
        const imageInfo = {
          id: `local-${Date.now()}`,
          url: result.localPath,
          smallUrl: result.localPath,
          largeUrl: result.localPath,
          description: query,
          author: 'Local Import',
          authorUrl: '#',
          isLocal: true
        };

        setImageData(imageInfo);
        setLocalImagePath(result.localPath);

        if (onImageSelect) {
          onImageSelect(imageInfo);
        }
      } else {
        throw new Error(result.error || 'Failed to import image');
      }
    } catch (err) {
      console.error('Error importing image:', err);
      setError('Failed to load image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    importAndFetchImage();
  }, [query]);

  if (loading) {
    return (
      <div 
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500">Importing image...</span>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div 
        className={`bg-gray-300 flex flex-col items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-600 mb-2">📷</span>
        <span className="text-gray-600 text-sm">Image not available</span>
        <button 
          onClick={importAndFetchImage}
          className="text-blue-500 text-sm underline mt-1"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <Image
          src={localImagePath || imageData.url}
          alt={imageData.description}
          width={width}
          height={height}
          className={`transition-transform duration-300 group-hover:scale-105 ${className}`}
          unoptimized={imageData.isLocal} // Use unoptimized for local paths if not handled by Next.js image optimization
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />

        {/* Refresh button */}
        <button
          onClick={importAndFetchImage}
          className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          title="Import different image"
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Attribution */}
      <div className="mt-2 text-xs text-gray-500">
        {imageData.isLocal ? (
          <span>📁 Locally served image</span>
        ) : (
          <>
            Photo by{' '}
            <a 
              href={imageData.authorUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              {imageData.author}
            </a>
            {' on '}
            <a 
              href="https://unsplash.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Unsplash
            </a>
          </>
        )}
      </div>
    </div>
  );
}