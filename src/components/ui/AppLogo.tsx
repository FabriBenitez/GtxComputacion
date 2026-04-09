'use client'

import AppImage from './AppImage'

interface AppLogoProps {
  src?: string
  size?: number
  className?: string
  onClick?: () => void
}

export default function AppLogo({
  src = '/Logo.jpg',
  size = 48,
  className = '',
  onClick,
}: AppLogoProps) {
  return (
    <div
      className={`flex items-center ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      <AppImage
        src={src}
        alt="Logo TechOps"
        width={size}
        height={size}
        className="rounded-2xl object-cover"
        priority
      />
    </div>
  )
}
