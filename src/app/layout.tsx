import type { Metadata, Viewport } from 'next'
import ToastProvider from '@/components/providers/ToastProvider'
import '@/styles/tailwind.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'TechOps',
  description: 'Gestion interna para tienda de tecnologia con stock, ventas, catalogo y WhatsApp.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
