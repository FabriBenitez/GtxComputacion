'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary/20">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">Pagina no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La pagina que buscas no existe o fue movida.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button onClick={() => router.back()} className="btn-primary">
            Volver
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-secondary">
            Ir al dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
