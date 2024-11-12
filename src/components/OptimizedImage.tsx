import Image, { ImageProps } from 'next/image';
import React from 'react';

export interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
}

export function OptimizedImage(props: OptimizedImageProps) {
  return <Image {...props} />;
} 