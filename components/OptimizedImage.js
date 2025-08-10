
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, generateSrcSet } from '../utils/image-optimizer';

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  responsive = true,
  sizes = [400, 800, 1200, 1600],
  ...otherProps 
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Try to use WebP version first
    if (src && !src.includes('.webp')) {
      const webpUrl = getOptimizedImageUrl(src, width);
      
      // Check if WebP version exists
      const img = new window.Image();
      img.onload = () => setImageSrc(webpUrl);
      img.onerror = () => setImageSrc(src); // Fallback to original
      img.src = webpUrl;
    }
  }, [src, width]);

  const handleError = () => {
    setError(true);
    // Fallback to original image
    if (imageSrc !== src) {
      setImageSrc(src);
    }
  };

  if (error && imageSrc === src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Image not available</span>
      </div>
    );
  }

  const imageProps = {
    src: imageSrc,
    alt: alt || '',
    width,
    height,
    className,
    priority,
    onError: handleError,
    ...otherProps
  };

  // Generate responsive srcSet if enabled
  if (responsive && src && !src.startsWith('http')) {
    imageProps.srcSet = generateSrcSet(src, sizes);
    imageProps.sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  }

  return <Image {...imageProps} />;
}

// Wrapper for feature images with automatic optimization
export function OptimizedFeatureImage({ 
  src, 
  alt, 
  title,
  className = "aspect-video object-cover rounded-lg",
  ...props 
}) {
  return (
    <figure className="relative overflow-hidden rounded-lg">
      <OptimizedImage
        src={src}
        alt={alt}
        width={800}
        height={450}
        className={className}
        responsive={true}
        priority={false}
        {...props}
      />
      {title && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center">
          {title}
        </figcaption>
      )}
    </figure>
  );
}
