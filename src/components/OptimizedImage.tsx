import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
}

function OptimizedImage({ src, alt, ...props }: OptimizedImageProps) {
  return (
    <Image 
      src={src}
      alt={alt}
      {...props}
    />
  );
}

export default OptimizedImage; 