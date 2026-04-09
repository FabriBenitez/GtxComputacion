'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import {
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'

interface Purchase {
  id: string
  date: string
  items: string
  total: number
  method: string
}

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  purchases: Purchase[]
  totalSpent: number
  lastPurchase: string
  notes?: string
  tag?: 'vip' | 'frecuente' | 'nuevo'
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'Carlos Mendez', phone: '11 4523-8901', email: 'carlos@gmail.com', tag: 'vip', totalSpent: 485000, lastPurchase: '09/04/2026', notes: 'Compra componentes para armar PCs. Prefiere transferencia.', purchases: [{ id: 'p1', date: '09/04/2026', items: 'Intel i5-12400 + RAM 16GB', total: 154500, method: 'Transferencia' }, { id: 'p2', date: '22/03/2026', items: 'GPU AMD RX 580', total: 158000, method: 'Efectivo' }] },
  { id: '2', name: 'Laura Gomez', phone: '11 6734-2210', email: 'laura.gomez@hotmail.com', tag: 'frecuente', totalSpent: 142000, lastPurchase: '08/04/2026', notes: 'Trabaja en diseno grafico. Interesada en perifericos premium.', purchases: [{ id: 'p4', date: '08/04/2026', items: 'Mouse Logitech MX Master 3', total: 68000, method: 'Mercado Pago' }, { id: 'p5', date: '15/03/2026', items: 'Teclado Redragon K552', total: 32000, method: 'Efectivo' }] },
  { id: '3', name: 'Rodrigo Fernandez', phone: '11 2345-6789', tag: 'nuevo', totalSpent: 48000, lastPurchase: '07/04/2026', purchases: [{ id: 'p7', date: '07/04/2026', items: 'Chromecast Google TV 4K', total: 48000, method: 'Efectivo' }] },
]

const tagConfig = {
  vip: { label: 'VIP', className: 'badge bg-accent/10 text-accent' },
  frecuente: { label: 'Frecuente', className: 'badge badge-primary' },
  nuevo: { label: 'Nuevo', className: 'badge badge-success' },
}

function formatCurrency(value: number) {
  return '$' + value.toLocaleString('es-AR')
}

function CustomerDetail({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const tag = customer.tag ? tagConfig[customer.tag] : null
  const waLink = `https://wa.me/549${customer.phone.replace(/\D/g, '')}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Ficha de cliente</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <span className="text-xl font-bold text-primary">{customer.name.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">{customer.name}</h3>
                {tag ? <span className={tag.className}>{tag.label}</span> : null}
              </div>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
              {customer.email ? <p className="text-sm text-muted-foreground">{customer.email}</p> : null}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="mb-1 text-xs text-muted-foreground">Total gastado</p>
              <p className="font-mono text-sm font-bold text-foreground">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="mb-1 text-xs text-muted-foreground">Compras</p>
              <p className="font-mono text-lg font-bold text-foreground">{customer.purchases.length}</p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3 text-center">
              <p className="mb-1 text-xs text-muted-foreground">Ultima compra</p>
              <p className="text-xs font-bold text-foreground">{customer.lastPurchase}</p>
            </div>
          </div>
          {customer.notes ? <div className="rounded-xl border border-warning/20 bg-warning/5 p-4"><p className="mb-1 text-xs font-semibold uppercase tracking-wider text-warning">Notas</p><p className="text-sm text-foreground">{customer.notes}</p></div> : null}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Historial de compras</p>
            <div className="space-y-2">
              {customer.purchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center gap-3 rounded-xl bg-muted/30 p-3 transition-colors hover:bg-muted/50">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"><ShoppingBag size={14} className="text-primary" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{purchase.items}</p>
                    <p className="text-xs text-muted-foreground">{purchase.date} · {purchase.method}</p>
                  </div>
                  <p className="shrink-0 font-mono text-sm font-bold text-foreground">{formatCurrency(purchase.total)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <a href={waLink} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 py-2.5 text-sm font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"><MessageCircle size={15} />WhatsApp</a>
            <button className="btn-secondary flex-1 text-sm">Editar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewCustomerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Nuevo cliente</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button>
        </div>
        <div className="space-y-4 p-6">
          {['Nombre completo *', 'Telefono *', 'Email'].map((label) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
              <input className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notas</label>
            <textarea rows={3} className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button onClick={onClose} className="btn-secondary flex-1 text-sm">Cancelar</button>
          <button className="btn-primary flex-1 text-sm">Guardar cliente</button>
        </div>
      </div>
    </div>
  )
}

export default function ClientesPage() {
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<'all' | 'vip' | 'frecuente' | 'nuevo'>('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)

  const filtered = mockCustomers.filter((customer) => {
    const matchSearch = customer.name.toLowerCase().includes(search.toLowerCase()) || customer.phone.includes(search)
    const matchTag = selectedTag === 'all' || customer.tag === selectedTag
    return matchSearch && matchTag
  })

  const totalRevenue = mockCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const vipCount = mockCustomers.filter((customer) => customer.tag === 'vip').length

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{mockCustomers.length} clientes registrados</p>
          </div>
          <button onClick={() => setShowNewModal(true)} className="btn-primary text-sm"><Plus size={16} />Nuevo cliente</button>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total clientes', value: mockCustomers.length, icon: Users, variant: 'default' },
            { label: 'Clientes VIP', value: vipCount, icon: Star, variant: 'warning' },
            { label: 'Ingresos totales', value: formatCurrency(totalRevenue), icon: TrendingUp, variant: 'success', mono: true },
            { label: 'Ticket promedio', value: formatCurrency(Math.round(totalRevenue / mockCustomers.length)), icon: ShoppingBag, variant: 'primary', mono: true },
          ].map((stat) => (
            <div key={stat.label} className={`kpi-card border ${stat.variant === 'success' ? 'bg-success/5 border-success/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : 'bg-white border-border'}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.variant === 'success' ? 'bg-success/10 text-success' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : stat.variant === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}><stat.icon size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold text-foreground ${stat.mono ? 'font-mono text-xl' : ''}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o telefono..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2">
            {[{ id: 'all', label: 'Todos' }, { id: 'vip', label: 'VIP' }, { id: 'frecuente', label: 'Frecuentes' }, { id: 'nuevo', label: 'Nuevos' }].map((filter) => (
              <button key={filter.id} onClick={() => setSelectedTag(filter.id as 'all' | 'vip' | 'frecuente' | 'nuevo')} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${selectedTag === filter.id ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>{filter.label}</button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefono</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compras</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total gastado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ultima compra</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((customer) => {
                const tag = customer.tag ? tagConfig[customer.tag] : null
                const waLink = `https://wa.me/549${customer.phone.replace(/\D/g, '')}`
                return (
                  <tr key={customer.id} className="group cursor-pointer transition-colors hover:bg-muted/20" onClick={() => setSelectedCustomer(customer)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="text-xs font-bold text-primary">{customer.name.split(' ').map((name) => name[0]).join('').slice(0, 2)}</span></div>
                        <div>
                          <p className="font-semibold text-foreground">{customer.name}</p>
                          {customer.email ? <p className="text-xs text-muted-foreground">{customer.email}</p> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{customer.phone}</td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-foreground">{customer.purchases.length}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{formatCurrency(customer.totalSpent)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{customer.lastPurchase}</td>
                    <td className="px-4 py-3 text-center">{tag ? <span className={tag.className}>{tag.label}</span> : null}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100" onClick={(event) => event.stopPropagation()}>
                        <a href={waLink} target="_blank" rel="noreferrer" className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#128C7E] transition-colors hover:bg-[#25D366]/20"><MessageCircle size={13} /></a>
                        <button onClick={() => setSelectedCustomer(customer)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><ChevronRight size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!filtered.length ? <div className="py-16 text-center"><Users size={32} className="mx-auto mb-3 text-muted-foreground/40" /><p className="text-sm text-muted-foreground">No se encontraron clientes</p></div> : null}
        </div>
      </div>
      {selectedCustomer ? <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} /> : null}
      {showNewModal ? <NewCustomerModal onClose={() => setShowNewModal(false)} /> : null}
    </AppLayout>
  )
}
