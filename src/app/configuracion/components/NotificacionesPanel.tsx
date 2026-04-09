'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface NotifSetting {
  id: string
  grupo: string
  label: string
  descripcion: string
  email: boolean
  sistema: boolean
}

const initialSettings: NotifSetting[] = [
  { id: 'notif-stock-cero', grupo: 'Stock', label: 'Producto sin stock', descripcion: 'Cuando un SKU llega a 0 unidades.', email: true, sistema: true },
  { id: 'notif-stock-bajo', grupo: 'Stock', label: 'Stock bajo minimo', descripcion: 'Cuando el stock cae por debajo del minimo configurado.', email: false, sistema: true },
  { id: 'notif-venta-grande', grupo: 'Ventas', label: 'Venta por encima de umbral', descripcion: 'Venta individual superior a $200.000.', email: true, sistema: true },
  { id: 'notif-whatsapp-lead', grupo: 'WhatsApp', label: 'Nuevo lead WhatsApp', descripcion: 'Clic en boton de consulta o reserva en el catalogo.', email: false, sistema: true },
  { id: 'notif-backup', grupo: 'Sistema', label: 'Backup automatico', descripcion: 'Confirmacion de backup diario exitoso.', email: true, sistema: false },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}>
      <span className={`pointer-events-none mt-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function NotificacionesPanel() {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const groups = [...new Set(initialSettings.map((setting) => setting.grupo))]

  async function save() {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSaving(false)
    toast.success('Preferencias de notificaciones guardadas')
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Preferencias de Notificaciones</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Configura que alertas recibis por email y dentro del sistema.</p>
        </div>
        <div className="grid grid-cols-[1fr_80px_80px] items-center border-b border-border bg-muted/40 px-6 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notificacion</span>
          <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
          <span className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sistema</span>
        </div>
        {groups.map((group) => (
          <div key={group}>
            <div className="border-b border-border bg-muted/20 px-6 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{group}</p>
            </div>
            {settings.filter((setting) => setting.grupo === group).map((setting) => (
              <div key={setting.id} className="grid grid-cols-[1fr_80px_80px] items-center border-b border-border px-6 py-3.5 transition-colors last:border-0 hover:bg-muted/20">
                <div>
                  <p className="text-sm font-medium text-foreground">{setting.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{setting.descripcion}</p>
                </div>
                <div className="flex justify-center">
                  <Toggle checked={setting.email} onChange={() => setSettings((current) => current.map((item) => item.id === setting.id ? { ...item, email: !item.email } : item))} />
                </div>
                <div className="flex justify-center">
                  <Toggle checked={setting.sistema} onChange={() => setSettings((current) => current.map((item) => item.id === setting.id ? { ...item, sistema: !item.sistema } : item))} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={save} disabled={isSaving} className="btn-primary min-w-[160px] justify-center text-sm disabled:cursor-not-allowed disabled:opacity-50">
          {isSaving ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : 'Guardar preferencias'}
        </button>
      </div>
    </div>
  )
}
