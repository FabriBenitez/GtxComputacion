'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Calendar, CheckCircle, CreditCard, Download, Eye, ShoppingBag, Smartphone, Banknote, Search, TrendingUp, X } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface SaleItem {
  name: string
  qty: number
  price: number
}

interface Sale {
  id: string
  number: string
  date: string
  time: string
  customer: string
  items: SaleItem[]
  total: number
  discount: number
  method: 'efectivo' | 'transferencia' | 'mercadopago'
  seller: string
  status: 'completed' | 'cancelled'
}

const mockSales: Sale[] = [
  { id: '1', number: '#1050', date: '09/04/2026', time: '13:45', customer: 'Carlos Mendez', items: [{ name: 'Intel i5-12400', qty: 1, price: 135000 }, { name: 'RAM Kingston 16GB', qty: 1, price: 28000 }], total: 163000, discount: 0, method: 'transferencia', seller: 'Sofia R.', status: 'completed' },
  { id: '2', number: '#1049', date: '09/04/2026', time: '12:20', customer: 'Rodrigo Fernandez', items: [{ name: 'Chromecast Google TV 4K', qty: 1, price: 48000 }], total: 48000, discount: 0, method: 'efectivo', seller: 'Martin R.', status: 'completed' },
  { id: '3', number: '#1048', date: '09/04/2026', time: '11:05', customer: 'Anonimo', items: [{ name: 'Mouse Logitech G203', qty: 2, price: 25000 }, { name: 'Teclado Redragon K552', qty: 1, price: 32000 }], total: 73600, discount: 10, method: 'mercadopago', seller: 'Sofia R.', status: 'completed' },
  { id: '4', number: '#1047', date: '08/04/2026', time: '17:30', customer: 'Valeria Torres', items: [{ name: 'Router TP-Link AX23', qty: 2, price: 38500 }], total: 77000, discount: 0, method: 'transferencia', seller: 'Martin R.', status: 'completed' },
]

const weeklyData = [
  { day: 'Lun', ventas: 185000 },
  { day: 'Mar', ventas: 234000 },
  { day: 'Mie', ventas: 198000 },
  { day: 'Jue', ventas: 312000 },
  { day: 'Vie', ventas: 428000 },
  { day: 'Sab', ventas: 356000 },
  { day: 'Dom', ventas: 284750 },
]

const methodConfig = {
  efectivo: { label: 'Efectivo', icon: Banknote, className: 'badge badge-success' },
  transferencia: { label: 'Transferencia', icon: CreditCard, className: 'badge badge-primary' },
  mercadopago: { label: 'Mercado Pago', icon: Smartphone, className: 'badge badge-muted' },
}

function formatCurrency(value: number) {
  return '$' + value.toLocaleString('es-AR')
}

function SaleDetail({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const config = methodConfig[sale.method]
  const subtotal = sale.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discountAmount = Math.round(subtotal * (sale.discount / 100))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="flex items-center justify-between border-b border-border px-6 py-4"><div><h2 className="text-lg font-bold text-foreground">Venta {sale.number}</h2><p className="text-xs text-muted-foreground">{sale.date} · {sale.time} · {sale.seller}</p></div><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button></div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Cliente</p><p className="font-semibold text-foreground">{sale.customer}</p></div><span className={config.className}><config.icon size={11} className="mr-1 inline" />{config.label}</span></div>
          <div className="space-y-2 rounded-xl bg-muted/40 p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Productos</p>{sale.items.map((item, index) => <div key={`${sale.id}-${index}`} className="flex justify-between text-sm"><span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.qty}</span></span><span className="font-mono font-semibold">{formatCurrency(item.price * item.qty)}</span></div>)}</div>
          <div className="space-y-1.5 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">{formatCurrency(subtotal)}</span></div>{sale.discount > 0 ? <div className="flex justify-between font-semibold text-accent"><span>Descuento {sale.discount}%</span><span className="font-mono">-{formatCurrency(discountAmount)}</span></div> : null}<div className="flex justify-between border-t border-border pt-2 text-lg font-bold text-foreground"><span>Total</span><span className="font-mono">{formatCurrency(sale.total)}</span></div></div>
          <div className={`flex items-center gap-2 rounded-xl border p-3 ${sale.status === 'completed' ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}><CheckCircle size={16} className={sale.status === 'completed' ? 'text-success' : 'text-destructive'} /><span className={`text-sm font-semibold ${sale.status === 'completed' ? 'text-success' : 'text-destructive'}`}>{sale.status === 'completed' ? 'Venta completada' : 'Venta cancelada'}</span></div>
        </div>
        <div className="flex gap-3 border-t border-border px-6 py-4"><button className="btn-secondary flex-1 text-sm">Imprimir ticket</button><button onClick={onClose} className="btn-primary flex-1 text-sm">Cerrar</button></div>
      </div>
    </div>
  )
}

export default function VentasPage() {
  const [search, setSearch] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'efectivo' | 'transferencia' | 'mercadopago'>('all')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const filtered = mockSales.filter((sale) => {
    const matchSearch = sale.customer.toLowerCase().includes(search.toLowerCase()) || sale.number.includes(search)
    const matchMethod = selectedMethod === 'all' || sale.method === selectedMethod
    return matchSearch && matchMethod
  })

  const totalToday = mockSales.filter((sale) => sale.date === '09/04/2026' && sale.status === 'completed').reduce((sum, sale) => sum + sale.total, 0)
  const totalWeek = mockSales.filter((sale) => sale.status === 'completed').reduce((sum, sale) => sum + sale.total, 0)
  const avgTicket = Math.round(totalWeek / mockSales.filter((sale) => sale.status === 'completed').length)

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight text-foreground">Historial de Ventas</h1><p className="mt-0.5 text-sm text-muted-foreground">{mockSales.length} ventas registradas</p></div>
          <div className="flex gap-2"><button className="btn-secondary text-sm"><Calendar size={14} />Filtrar fecha</button><button className="btn-secondary text-sm"><Download size={14} />Exportar</button></div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Ventas hoy', value: formatCurrency(totalToday), sub: `${mockSales.filter((sale) => sale.date === '09/04/2026').length} transacciones`, variant: 'success' },
            { label: 'Total semana', value: formatCurrency(totalWeek), sub: 'Ultimos 7 dias', variant: 'primary' },
            { label: 'Ticket promedio', value: formatCurrency(avgTicket), sub: 'Por transaccion', variant: 'default' },
            { label: 'Canceladas', value: mockSales.filter((sale) => sale.status === 'cancelled').length, sub: 'Esta semana', variant: 'warning' },
          ].map((stat) => (
            <div key={stat.label} className={`kpi-card border ${stat.variant === 'success' ? 'bg-success/5 border-success/20' : stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : 'bg-white border-border'}`}><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.variant === 'success' ? 'bg-success/10 text-success' : stat.variant === 'primary' ? 'bg-primary/10 text-primary' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}><ShoppingBag size={18} /></div><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p><p className="font-mono text-xl font-bold text-foreground">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.sub}</p></div></div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-foreground">Ventas diarias — Semana actual</h3><p className="mt-0.5 text-xs text-muted-foreground">Ingresos por dia</p></div><TrendingUp size={16} className="text-success" /></div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyData}>
              <defs><linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(209 76% 26%)" stopOpacity={0.15} /><stop offset="95%" stopColor="hsl(209 76% 26%)" stopOpacity={0} /></linearGradient></defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215 16% 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 16% 46%)' }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke="hsl(209 76% 26%)" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por cliente o numero..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div className="flex gap-2">{[{ id: 'all', label: 'Todos' }, { id: 'efectivo', label: 'Efectivo' }, { id: 'transferencia', label: 'Transferencia' }, { id: 'mercadopago', label: 'Mercado Pago' }].map((filter) => <button key={filter.id} onClick={() => setSelectedMethod(filter.id as 'all' | 'efectivo' | 'transferencia' | 'mercadopago')} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${selectedMethod === filter.id ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>{filter.label}</button>)}</div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">N°</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Productos</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metodo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((sale) => {
                const config = methodConfig[sale.method]
                return (
                  <tr key={sale.id} className="group cursor-pointer transition-colors hover:bg-muted/20" onClick={() => setSelectedSale(sale)}>
                    <td className="px-4 py-3 font-mono text-sm font-bold text-primary">{sale.number}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sale.date}<br />{sale.time}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{sale.customer}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-xs text-muted-foreground">{sale.items.map((item) => `${item.name} x${item.qty}`).join(', ')}</td>
                    <td className="px-4 py-3 text-center"><span className={config.className}><config.icon size={10} className="mr-1 inline" />{config.label}</span></td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{formatCurrency(sale.total)}</td>
                    <td className="px-4 py-3 text-center"><span className={sale.status === 'completed' ? 'badge badge-success' : 'badge badge-destructive'}>{sale.status === 'completed' ? 'Completada' : 'Cancelada'}</span></td>
                    <td className="px-4 py-3 text-right"><button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-muted"><Eye size={13} /></button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedSale ? <SaleDetail sale={selectedSale} onClose={() => setSelectedSale(null)} /> : null}
    </AppLayout>
  )
}
