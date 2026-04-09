'use client'

import { useState } from 'react'
import { Bell, ChevronRight, CreditCard, MessageCircle, Settings, Store, Users } from 'lucide-react'
import NotificacionesPanel from './NotificacionesPanel'
import PagosPanel from './PagosPanel'
import TiendaPanel from './TiendaPanel'
import UsuariosPanel from './UsuariosPanel'
import WhatsAppPanel from './WhatsAppPanel'

const categories = [
  { id: 'tienda', label: 'Tienda', icon: Store, description: 'Nombre, logo, moneda e impuestos' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, description: 'Numero, mensajes automaticos, tracking' },
  { id: 'pagos', label: 'Metodos de Pago', icon: CreditCard, description: 'Habilita o deshabilita formas de cobro' },
  { id: 'usuarios', label: 'Usuarios y Roles', icon: Users, description: 'Equipo, permisos y accesos' },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell, description: 'Alertas de stock, ventas y sistema' },
]

const panels: Record<string, React.ReactNode> = {
  tienda: <TiendaPanel />,
  whatsapp: <WhatsAppPanel />,
  pagos: <PagosPanel />,
  usuarios: <UsuariosPanel />,
  notificaciones: <NotificacionesPanel />,
}

export default function SettingsLayout() {
  const [activeCategory, setActiveCategory] = useState('tienda')

  return (
    <div className="flex min-h-[calc(100vh-160px)] gap-6">
      <aside className="w-64 shrink-0">
        <nav className="overflow-hidden rounded-xl border border-border bg-white">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors last:border-0 ${isActive ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-muted/50'}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary'}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>{category.label}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{category.description}</p>
                </div>
                {isActive ? <ChevronRight size={14} className="shrink-0 text-primary" /> : null}
              </button>
            )
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 animate-fade-in">{panels[activeCategory]}</div>
    </div>
  )
}
