'use client'

import AppLayout from '@/components/AppLayout'
import { ShoppingCart } from 'lucide-react'

export default function POSPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Punto de Venta</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Registra nuevas ventas y gestiona el carrito.</p>
          </div>
        </div>

        {/* Aquí puedes migrar la lógica de ventas que tienes en App.jsx */}
        <div className="flex h-[60vh] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20">
          <div className="text-center">
            <ShoppingCart size={48} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">Módulo de ventas en preparación...</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}