import Image from 'next/image';
import { ComponentProps } from 'react';

type ImageProps = ComponentProps<typeof Image>;

export function OptimizedImage(props: ImageProps) {
  return (
    <Image
      {...props}
      quality={90}
      loading="lazy"
    />
  );
} 