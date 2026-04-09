/*'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { CheckCircle, Clock, Eye, MessageCircle, Phone, Search, TrendingUp, X, XCircle, Zap } from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  product: string
  productSku: string
  price: number
  message: string
  date: string
  time: string
  status: 'nuevo' | 'contactado' | 'reservado' | 'vendido' | 'perdido'
  type: 'consulta' | 'reserva'
}

const mockLeads: Lead[] = [
  { id: '1', name: 'Juan Perez', phone: '11 4523-8901', product: 'Monitor Samsung 27" T350', productSku: 'SAM-T350', price: 195000, message: 'Hola! Estoy interesado en este producto:\n\n🖥️ Monitor Samsung 27" T350\n💰 $195.000\n\n¿Lo tenes disponible?', date: '09/04/2026', time: '13:45', status: 'nuevo', type: 'consulta' },
  { id: '2', name: 'Ana Garcia', phone: '11 6734-2210', product: 'GPU AMD RX 580 8GB', productSku: 'AMD-RX580', price: 158000, message: 'Hola! Quiero reservar la GPU AMD RX 580 8GB por $158.000.', date: '09/04/2026', time: '12:30', status: 'reservado', type: 'reserva' },
  { id: '3', name: 'Pedro Sanchez', phone: '11 2345-6789', product: 'Chromecast Google TV 4K', productSku: 'GOO-CC7', price: 48000, message: 'Hola! Estoy interesado en el Chromecast Google TV 4K.', date: '09/04/2026', time: '11:15', status: 'contactado', type: 'consulta' },
  { id: '4', name: 'Maria Lopez', phone: '11 8901-2345', product: 'Mouse Logitech G203', productSku: 'LOG-G203', price: 25000, message: 'Hola! Estoy interesado en el Mouse Logitech G203.', date: '09/04/2026', time: '10:00', status: 'vendido', type: 'consulta' },
]

const statusConfig = {
  nuevo: { label: 'Nuevo', className: 'badge badge-primary', icon: Zap },
  contactado: { label: 'Contactado', className: 'badge badge-warning', icon: Phone },
  reservado: { label: 'Reservado', className: 'badge bg-purple-100 text-purple-700', icon: Clock },
  vendido: { label: 'Vendido', className: 'badge badge-success', icon: CheckCircle },
  perdido: { label: 'Perdido', className: 'badge badge-destructive', icon: XCircle },
}

function formatCurrency(value: number) {
  return '$' + value.toLocaleString('es-AR')
}

function LeadDetail({
  lead,
  onClose,
  onStatusChange,
}: {
  lead: Lead
  onClose: () => void
  onStatusChange: (id: string, status: Lead['status']) => void
}) {
  const config = statusConfig[lead.status]
  const waLink = `https://wa.me/549${lead.phone.replace(/\D/g, '')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Lead WhatsApp</h2>
          <button onClick={onClose} type="button" aria-label="Cerrar modal" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10"><MessageCircle size={22} className="text-[#128C7E]" /></div>
            <div>
              <p className="font-bold text-foreground">{lead.name}</p>
              <p className="font-mono text-sm text-muted-foreground">{lead.phone}</p>
            </div>
            <span className={`ml-auto ${config.className}`}>{config.label}</span>
          </div>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto consultado</p>
            <p className="font-semibold text-foreground">{lead.product}</p>
            <p className="font-mono text-xs text-muted-foreground">{lead.productSku}</p>
            <p className="mt-1 font-mono text-lg font-bold text-primary">{formatCurrency(lead.price)}</p>
          </div>
          <div className="rounded-xl bg-[#DCF8C6] p-4">
            <p className="mb-2 text-xs font-semibold text-[#128C7E]">Mensaje enviado</p>
            <p className="whitespace-pre-line text-sm text-gray-800">{lead.message}</p>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{lead.date} · {lead.time}</span>
            <span className={`badge ${lead.type === 'reserva' ? 'badge-warning' : 'badge-muted'}`}>{lead.type === 'reserva' ? 'Reserva' : 'Consulta'}</span>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actualizar estado</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(statusConfig) as Lead['status'][]).map((status) => (
                <button key={status} onClick={() => onStatusChange(lead.id, status)} type="button" className={`rounded-lg border py-2 text-xs font-semibold transition-all ${lead.status === status ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>{statusConfig[status].label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <a href={waLink} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#22c55e]"><MessageCircle size={15} />Responder</a>
          <button onClick={onClose} type="button" className="btn-secondary flex-1 text-sm">Cerrar</button>
        </div>
      </div>
    </div>
  )
}

export default function WhatsAppPage() {
  const [leads, setLeads] = useState(mockLeads)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | Lead['status']>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const filtered = leads.filter((lead) => {
    const matchSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || lead.product.toLowerCase().includes(search.toLowerCase()) || lead.phone.includes(search)
    const matchStatus = filterStatus === 'all' || lead.status === filterStatus
    return matchSearch && matchStatus
  })

  const newCount = leads.filter((lead) => lead.status === 'nuevo').length
  const reservedCount = leads.filter((lead) => lead.status === 'reservado').length
  const soldCount = leads.filter((lead) => lead.status === 'vendido').length
  const conversionRate = Math.round((soldCount / leads.length) * 100)

  function updateStatus(id: string, status: Lead['status']) {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)))
    setSelectedLead((current) => (current?.id === id ? { ...current, status } : current))
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">WhatsApp Leads</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{leads.length} consultas recibidas</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Nuevos leads', value: newCount, icon: Zap, variant: 'primary' },
            { label: 'Reservas activas', value: reservedCount, icon: Clock, variant: 'warning' },
            { label: 'Convertidos', value: soldCount, icon: CheckCircle, variant: 'success' },
            { label: 'Conversion', value: `${conversionRate}%`, icon: TrendingUp, variant: 'default' },
          ].map((stat) => (
            <div key={stat.label} className={`kpi-card border ${stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : stat.variant === 'success' ? 'bg-success/5 border-success/20' : 'bg-white border-border'}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.variant === 'primary' ? 'bg-primary/10 text-primary' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : stat.variant === 'success' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}><stat.icon size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, producto o telefono..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterStatus('all')} type="button" className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${filterStatus === 'all' ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>Todos</button>
            {(Object.keys(statusConfig) as Lead['status'][]).map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)} type="button" className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${filterStatus === status ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>{statusConfig[status].label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((lead) => {
            const config = statusConfig[lead.status]
            const waLink = `https://wa.me/549${lead.phone.replace(/\D/g, '')}`
            return (
              <div key={lead.id} className="group rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-card-hover">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10"><span className="text-xs font-bold text-[#128C7E]">{lead.name.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{lead.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{lead.phone}</p>
                    </div>
                  </div>
                  <span className={config.className}>{config.label}</span>
                </div>
                <div className="mb-3 rounded-lg bg-muted/40 p-2.5">
                  <p className="truncate text-xs font-semibold text-foreground">{lead.product}</p>
                  <p className="font-mono text-sm font-bold text-primary">{formatCurrency(lead.price)}</p>
                </div>
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{lead.date} · {lead.time}</span>
                  <span className={`badge text-[10px] ${lead.type === 'reserva' ? 'badge-warning' : 'badge-muted'}`}>{lead.type === 'reserva' ? 'Reserva' : 'Consulta'}</span>
                </div>
                <div className="flex gap-2">
                  <a href={waLink} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#25D366]/20 bg-[#25D366]/10 py-2 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"><MessageCircle size={12} />Responder</a>
                  <button onClick={() => setSelectedLead(lead)} type="button" aria-label={`Ver detalles de ${lead.name}`} className="btn-secondary flex-1 py-2 text-xs"><Eye size={12} />Ver</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {selectedLead ? <LeadDetail lead={selectedLead} onClose={() => setSelectedLead(null)} onStatusChange={updateStatus} /> : null}
    </AppLayout>
  )
}*/