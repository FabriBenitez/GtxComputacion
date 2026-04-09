'use client'

import { Toaster } from 'sonner'

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      toastOptions={{
        style: {
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          borderRadius: '10px',
          border: '1px solid hsl(214 20% 88%)',
          boxShadow: '0 8px 32px hsl(215 28% 12% / 0.12)',
        },
      }}
    />
  )
}
