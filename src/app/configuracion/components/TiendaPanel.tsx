'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Check, Loader2, Store, Upload } from 'lucide-react'

interface TiendaFormData {
  nombre: string
  direccion: string
  telefono: string
  email: string
  moneda: string
  iva: string
  timezone: string
}

export default function TiendaPanel() {
  const [isSaving, setIsSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>('13:48 hs')
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TiendaFormData>({
    defaultValues: {
      nombre: 'TechStore Palermo',
      direccion: 'Av. Santa Fe 3456, CABA',
      telefono: '+54 11 4832-7700',
      email: 'ventas@techstorepalermo.com.ar',
      moneda: 'ARS',
      iva: '21',
      timezone: 'America/Argentina/Buenos_Aires',
    },
  })

  async function onSubmit(data: TiendaFormData) {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSavedAt('13:53 hs')
    toast.success('Configuracion de tienda guardada', {
      description: 'Los cambios se aplicaran de inmediato.',
    })
    console.log(data)
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Store size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Identidad Visual</h3>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5">
            <Upload size={22} />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">Logo de la tienda</p>
            <p className="mb-3 text-xs text-muted-foreground">PNG o SVG, minimo 200×200px.</p>
            <button type="button" className="btn-secondary px-3 py-1.5 text-xs">
              <Upload size={13} />
              Subir logo
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 rounded-xl border border-border bg-white p-6">
          <h3 className="border-b border-border pb-3 text-sm font-semibold text-foreground">Informacion de la Tienda</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Nombre de la tienda *</label>
              <input
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.nombre ? 'border-destructive' : 'border-border hover:border-primary/40'}`}
                {...register('nombre', { required: 'El nombre es obligatorio.' })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Telefono</label>
              <input className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('telefono')} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Direccion</label>
              <input className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('direccion')} />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Email de contacto</label>
              <input className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('email')} />
            </div>
          </div>
          <div className="border-t border-border pt-5">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configuracion Regional</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Moneda</label>
                <select className="w-full cursor-pointer rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('moneda')}>
                  <option value="ARS">ARS — Peso Argentino</option>
                  <option value="USD">USD — Dolar Estadounidense</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">IVA por defecto (%)</label>
                <input className="w-full rounded-lg border border-border px-3.5 py-2.5 font-mono text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('iva')} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Zona horaria</label>
                <select className="w-full cursor-pointer rounded-lg border border-border px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('timezone')}>
                  <option value="America/Argentina/Buenos_Aires">Buenos Aires (UTC-3)</option>
                  <option value="America/Santiago">Santiago (UTC-4)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {savedAt && !isDirty ? (
                <>
                  <Check size={13} className="text-success" />
                  <span>Guardado a las {savedAt}</span>
                </>
              ) : (
                <span className="font-medium text-warning">Cambios sin guardar</span>
              )}
            </div>
            <button type="submit" disabled={isSaving || !isDirty} className="btn-primary min-w-[140px] justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
