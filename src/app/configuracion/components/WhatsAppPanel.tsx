'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CheckCheck, Copy, ExternalLink, Loader2, MessageCircle } from 'lucide-react'

interface WhatsAppFormData {
  numero: string
  mensajeConsulta: string
  mensajeReserva: string
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}
      >
        <span className={`pointer-events-none mt-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function WhatsAppPanel() {
  const [isSaving, setIsSaving] = useState(false)
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [reservaEnabled, setReservaEnabled] = useState(true)
  const [consultaEnabled, setConsultaEnabled] = useState(true)
  const [copiedPreview, setCopiedPreview] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<WhatsAppFormData>({
    defaultValues: {
      numero: '5491134567890',
      mensajeConsulta: 'Hola! Me interesa el producto *{{nombre}}* (SKU: {{sku}}) con precio *${{precio}}*. ¿Esta disponible?',
      mensajeReserva: 'Hola! Quiero reservar el producto *{{nombre}}* (SKU: {{sku}}) por *${{precio}}*. ¿Como sigo?',
    },
  })

  const watchedNumero = watch('numero')
  const watchedMensaje = watch('mensajeConsulta')

  const previewMessage = watchedMensaje
    .replace('{{nombre}}', 'Logitech MK845 Mecanico')
    .replace('{{sku}}', 'MK-LOG-K845-02')
    .replace('{{precio}}', '42.700')

  const previewLink = `https://wa.me/${watchedNumero}?text=${encodeURIComponent(previewMessage)}`

  async function onSubmit(data: WhatsAppFormData) {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsSaving(false)
    toast.success('Configuracion de WhatsApp guardada')
    console.log(data)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(previewLink)
    setCopiedPreview(true)
    setTimeout(() => setCopiedPreview(false), 1800)
    toast.success('Link copiado al portapapeles')
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 rounded-xl border border-border bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle size={16} className="text-[#25D366]" />
            <h3 className="text-sm font-semibold text-foreground">Numero de WhatsApp Business</h3>
          </div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Numero (con codigo de pais, sin +)</label>
          <input className="w-full max-w-xs rounded-lg border border-border bg-white px-3.5 py-2.5 font-mono text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('numero')} />
        </div>

        <div className="mb-5 rounded-xl border border-border bg-white p-6">
          <h3 className="mb-4 border-b border-border pb-3 text-sm font-semibold text-foreground">Mensajes Automaticos</h3>
          <div className="mb-4 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
            Variables disponibles: <code className="text-primary">{'{{nombre}}'}</code>, <code className="text-primary">{'{{sku}}'}</code>, <code className="text-primary">{'{{precio}}'}</code>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Mensaje de Consulta</label>
              <textarea rows={3} className="w-full resize-none rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('mensajeConsulta')} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Mensaje de Reserva</label>
              <textarea rows={3} className="w-full resize-none rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20" {...register('mensajeReserva')} />
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-xl border border-border bg-white p-6">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Vista Previa del Link</h3>
          <div className="mb-4 rounded-xl bg-[#e5ddd5] p-4">
            <div className="max-w-sm rounded-xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#303030]">{previewMessage}</p>
              <p className="mt-1.5 text-right text-[10px] text-[#8696a0]">ahora</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">{previewLink}</div>
            <button type="button" onClick={copyLink} className="btn-secondary shrink-0 px-3 py-2 text-xs">
              {copiedPreview ? <CheckCheck size={13} className="text-success" /> : <Copy size={13} />}
              {copiedPreview ? 'Copiado' : 'Copiar'}
            </button>
            <a href={previewLink} target="_blank" rel="noreferrer" className="btn-primary shrink-0 px-3 py-2 text-xs">
              <ExternalLink size={13} />
              Probar
            </a>
          </div>
        </div>

        <div className="mb-5 rounded-xl border border-border bg-white px-6 py-2">
          <h3 className="mb-1 border-b border-border py-3 text-sm font-semibold text-foreground">Opciones de Canal</h3>
          <div className="divide-y divide-border">
            <ToggleSwitch checked={consultaEnabled} onChange={setConsultaEnabled} label='Boton "Solo Consultar"' description="Muestra el boton de consulta en el catalogo online." />
            <ToggleSwitch checked={reservaEnabled} onChange={setReservaEnabled} label='Boton "Reservar Producto"' description="Permite que el cliente reserve el producto desde el catalogo." />
            <ToggleSwitch checked={trackingEnabled} onChange={setTrackingEnabled} label="Tracking de clics" description="Registra cuantas veces se hace clic en cada boton." />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving || !isDirty} className="btn-primary min-w-[160px] justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50">
            {isSaving ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : 'Guardar configuracion'}
          </button>
        </div>
      </form>
    </div>
  )
}
