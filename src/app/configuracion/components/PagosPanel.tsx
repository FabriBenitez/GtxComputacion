'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AlertCircle, Banknote, Check, CreditCard, Smartphone } from 'lucide-react'

interface PaymentMethod {
  id: string
  nombre: string
  descripcion: string
  icon: React.ElementType
  iconColor: string
  enabled: boolean
  comision?: number
  nota?: string
}

const initialMethods: PaymentMethod[] = [
  { id: 'efectivo', nombre: 'Efectivo', descripcion: 'Pago en efectivo en mostrador. Sin comision.', icon: Banknote, iconColor: 'text-success', enabled: true, comision: 0 },
  { id: 'transferencia', nombre: 'Transferencia Bancaria', descripcion: 'CBU o alias de la cuenta de la tienda.', icon: CreditCard, iconColor: 'text-primary', enabled: true, comision: 0, nota: 'CBU: 0720-0000-0000-0001234567' },
  { id: 'mercadopago', nombre: 'Mercado Pago', descripcion: 'QR, link de pago o terminal.', icon: Smartphone, iconColor: 'text-[#009EE3]', enabled: true, comision: 2.99, nota: 'Cuenta: techstorepalermo@mp.com.ar' },
  { id: 'credito', nombre: 'Tarjeta de Credito', descripcion: 'POSNET. 1 a 12 cuotas.', icon: CreditCard, iconColor: 'text-accent', enabled: false, comision: 3.67, nota: 'Requiere activacion con el banco' },
]

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}>
      <span className={`pointer-events-none mt-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function PagosPanel() {
  const [methods, setMethods] = useState(initialMethods)
  const [isSaving, setIsSaving] = useState(false)

  async function saveChanges() {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSaving(false)
    toast.success('Metodos de pago actualizados', {
      description: `${methods.filter((method) => method.enabled).length} metodos habilitados.`,
    })
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Metodos de Pago</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{methods.filter((method) => method.enabled).length} de {methods.length} habilitados</p>
          </div>
          <span className="badge badge-primary">{methods.filter((method) => method.enabled).length} activos</span>
        </div>
        <div className="divide-y divide-border">
          {methods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.id} className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/20 ${method.enabled ? '' : 'opacity-60'}`}>
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40">
                  <Icon size={18} className={method.iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{method.nombre}</p>
                    {method.comision !== undefined && method.comision > 0 ? <span className="badge badge-warning text-[10px]">{method.comision}% comision</span> : null}
                    {method.comision === 0 ? <span className="badge badge-success text-[10px]">Sin comision</span> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{method.descripcion}</p>
                  {method.nota ? <div className="mt-1.5 flex items-center gap-1.5"><AlertCircle size={11} className="shrink-0 text-muted-foreground" /><p className="font-mono text-[11px] text-muted-foreground">{method.nota}</p></div> : null}
                </div>
                <div className="mt-1 flex shrink-0 items-center gap-3">
                  {method.enabled ? <span className="flex items-center gap-1 text-[11px] font-medium text-success"><Check size={11} />Activo</span> : null}
                  <ToggleSwitch checked={method.enabled} onChange={() => setMethods((current) => current.map((item) => item.id === method.id ? { ...item, enabled: !item.enabled } : item))} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={saveChanges} disabled={isSaving} className="btn-primary min-w-[160px] justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
