
import OptimizedImage from './OptimizedImage';

export default function CustomImage({ src, alt, ...otherProps }) {
  return (
    <figure className="aspect-4/3 relative">
      <OptimizedImage
        className="object-cover object-top"
        src={src}
        alt={alt || ''}
        fill={true}
        responsive={true}
        {...otherProps}
      />
    </figure>
  );
}
