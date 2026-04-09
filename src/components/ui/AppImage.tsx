'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

interface AppImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  fallbackSrc?: string
  unoptimized?: boolean
}

export default function AppImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
  sizes,
  fallbackSrc = '/Logo.jpg',
  unoptimized = false,
  ...props
}: AppImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const resolvedUnoptimized = useMemo(
    () => unoptimized || imageSrc.startsWith('http'),
    [imageSrc, unoptimized],
  )

  if (fill) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          className={className}
          onError={() => setImageSrc(fallbackSrc)}
          unoptimized={resolvedUnoptimized}
          priority={priority}
          {...props}
        />
      </div>
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      onError={() => setImageSrc(fallbackSrc)}
      unoptimized={resolvedUnoptimized}
      priority={priority}
      {...props}
    />
  )
}
