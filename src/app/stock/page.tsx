'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { AlertTriangle, Archive, ArrowDown, ArrowUp, Download, Flame, Package, Plus, RotateCcw, Search, TrendingDown, TrendingUp, X } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface StockItem {
  id: string
  sku: string
  name: string
  category: string
  stock: number
  minStock: number
  maxStock: number
  sold30d: number
  status: 'ok' | 'low' | 'out' | 'overstock'
}

interface Movement {
  id: string
  product: string
  sku: string
  type: 'entrada' | 'salida' | 'ajuste'
  qty: number
  date: string
  user: string
  note?: string
}

const stockItems: StockItem[] = [
  { id: '1', sku: 'LOG-G203', name: 'Mouse Logitech G203', category: 'Perifericos', stock: 14, minStock: 5, maxStock: 30, sold30d: 22, status: 'ok' },
  { id: '2', sku: 'RED-K552', name: 'Teclado Redragon K552', category: 'Perifericos', stock: 8, minStock: 5, maxStock: 20, sold30d: 18, status: 'ok' },
  { id: '3', sku: 'SAM-T350', name: 'Monitor Samsung 27" T350', category: 'Perifericos', stock: 3, minStock: 4, maxStock: 15, sold30d: 7, status: 'low' },
  { id: '4', sku: 'KIN-8GB', name: 'RAM Kingston 8GB DDR4', category: 'Componentes PC', stock: 0, minStock: 10, maxStock: 40, sold30d: 31, status: 'out' },
  { id: '5', sku: 'GOO-CC7', name: 'Chromecast Google TV 4K', category: 'Streaming', stock: 11, minStock: 5, maxStock: 20, sold30d: 14, status: 'ok' },
  { id: '6', sku: 'LOG-MX3', name: 'Mouse Logitech MX Master 3', category: 'Perifericos', stock: 28, minStock: 5, maxStock: 20, sold30d: 4, status: 'overstock' },
]

const movements: Movement[] = [
  { id: 'm1', product: 'Mouse Logitech G203', sku: 'LOG-G203', type: 'entrada', qty: 20, date: '09/04/2026 11:30', user: 'Lucas M.', note: 'Reposicion proveedor' },
  { id: 'm2', product: 'RAM Kingston 8GB DDR4', sku: 'KIN-8GB', type: 'salida', qty: 3, date: '09/04/2026 10:15', user: 'Sofia R.', note: 'Venta #1042' },
  { id: 'm3', product: 'Monitor Samsung 27"', sku: 'SAM-T350', type: 'ajuste', qty: -1, date: '08/04/2026 17:20', user: 'Lucas M.', note: 'Ajuste inventario' },
]

const statusConfig = {
  ok: { label: 'OK', className: 'badge badge-success' },
  low: { label: 'Bajo minimo', className: 'badge badge-warning' },
  out: { label: 'Sin stock', className: 'badge badge-destructive' },
  overstock: { label: 'Sobrestock', className: 'badge badge-primary' },
}

const movementConfig = {
  entrada: { label: 'Entrada', icon: ArrowDown, className: 'text-success bg-success/10' },
  salida: { label: 'Salida', icon: ArrowUp, className: 'text-destructive bg-destructive/10' },
  ajuste: { label: 'Ajuste', icon: RotateCcw, className: 'text-warning bg-warning/10' },
}

function AdjustModal({ item, onClose }: { item: StockItem; onClose: () => void }) {
  const [type, setType] = useState<'entrada' | 'salida' | 'ajuste'>('entrada')
  const [qty, setQty] = useState(1)
  const resultingStock = type === 'entrada' ? item.stock + qty : type === 'salida' ? Math.max(0, item.stock - qty) : qty

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="flex items-center justify-between border-b border-border px-6 py-4"><h2 className="text-lg font-bold text-foreground">Ajustar Stock</h2><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button></div>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted"><Package size={18} className="text-muted-foreground" /></div><div><p className="text-sm font-semibold text-foreground">{item.name}</p><p className="font-mono text-xs text-muted-foreground">{item.sku} · Stock actual: <strong>{item.stock}</strong></p></div></div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo de movimiento</label>
            <div className="grid grid-cols-3 gap-2">{(['entrada', 'salida', 'ajuste'] as const).map((movement) => <button key={movement} onClick={() => setType(movement)} className={`rounded-lg border py-2.5 text-sm font-semibold capitalize transition-all ${type === movement ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-muted'}`}>{movement}</button>)}</div>
          </div>
          <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cantidad</label><input type="number" min={1} value={qty} onChange={(event) => setQty(Number(event.target.value))} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-3"><span className="text-sm text-muted-foreground">Stock resultante</span><span className="font-mono text-lg font-bold text-foreground">{resultingStock}</span></div>
        </div>
        <div className="flex gap-3 border-t border-border px-6 py-4"><button onClick={onClose} className="btn-secondary flex-1 text-sm">Cancelar</button><button className="btn-primary flex-1 text-sm">Confirmar</button></div>
      </div>
    </div>
  )
}

export default function StockPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out' | 'overstock'>('all')
  const [adjustItem, setAdjustItem] = useState<StockItem | null>(null)
  const [activeTab, setActiveTab] = useState<'stock' | 'movimientos'>('stock')

  const filtered = stockItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || item.status === filterStatus
    return matchSearch && matchStatus
  })

  const topSoldData = [...stockItems].sort((a, b) => b.sold30d - a.sold30d).slice(0, 6).map((item) => ({
    name: item.name.split(' ').slice(0, 2).join(' '),
    ventas: item.sold30d,
    stock: item.stock,
  }))

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Control de Stock</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{stockItems.length} productos · Actualizado hace 5 min</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm"><Download size={14} />Exportar</button>
            <button className="btn-primary text-sm"><Plus size={14} />Entrada rapida</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Sin stock', value: stockItems.filter((item) => item.status === 'out').length, icon: AlertTriangle, variant: 'destructive', action: () => setFilterStatus('out') },
            { label: 'Bajo minimo', value: stockItems.filter((item) => item.status === 'low').length, icon: TrendingDown, variant: 'warning', action: () => setFilterStatus('low') },
            { label: 'Sobrestock', value: stockItems.filter((item) => item.status === 'overstock').length, icon: Archive, variant: 'primary', action: () => setFilterStatus('overstock') },
            { label: 'Total productos', value: stockItems.length, icon: Package, variant: 'default', action: () => setFilterStatus('all') },
          ].map((stat) => (
            <button key={stat.label} onClick={stat.action} className={`kpi-card border text-left ${stat.variant === 'destructive' ? 'bg-destructive/5 border-destructive/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : 'bg-white border-border'}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.variant === 'destructive' ? 'bg-destructive/10 text-destructive' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : stat.variant === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}><stat.icon size={18} /></div>
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p><p className="font-mono text-3xl font-bold text-foreground">{stat.value}</p></div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-white p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-bold text-foreground">Mas vendidos (ultimos 30 dias)</h3><p className="mt-0.5 text-xs text-muted-foreground">Unidades vendidas vs stock actual</p></div><Flame size={16} className="text-accent" /></div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topSoldData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215 16% 46%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215 16% 46%)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="ventas" fill="hsl(209 76% 26%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stock" fill="hsl(209 76% 26% / 0.2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold text-foreground">Sugerencias de reposicion</h3><TrendingUp size={16} className="text-success" /></div>
            <div className="space-y-3">
              {stockItems.filter((item) => item.status === 'out' || item.status === 'low').map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-muted/40 p-2.5">
                  <div className={`h-2 w-2 shrink-0 rounded-full ${item.status === 'out' ? 'bg-destructive' : 'bg-warning'}`} />
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-foreground">{item.name}</p><p className="font-mono text-[10px] text-muted-foreground">Stock: {item.stock} / Min: {item.minStock}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-fit gap-1 rounded-xl bg-muted/50 p-1">
          <button onClick={() => setActiveTab('stock')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'stock' ? 'bg-white text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'}`}>Inventario</button>
          <button onClick={() => setActiveTab('movimientos')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === 'movimientos' ? 'bg-white text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'}`}>Movimientos</button>
        </div>

        {activeTab === 'stock' ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o SKU..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div className="flex gap-2">{[{ id: 'all', label: 'Todos' }, { id: 'out', label: 'Sin stock' }, { id: 'low', label: 'Bajo minimo' }, { id: 'overstock', label: 'Sobrestock' }].map((filter) => <button key={filter.id} onClick={() => setFilterStatus(filter.id as 'all' | 'low' | 'out' | 'overstock')} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${filterStatus === filter.id ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>{filter.label}</button>)}</div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Minimo</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vendidos 30d</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((item) => (
                    <tr key={item.id} className="group transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3"><p className="text-sm font-semibold text-foreground">{item.name}</p><p className="font-mono text-xs text-muted-foreground">{item.sku}</p></td>
                      <td className="px-4 py-3"><span className="badge badge-muted text-xs">{item.category}</span></td>
                      <td className="px-4 py-3 text-center"><span className={`font-mono text-base font-bold ${item.stock === 0 ? 'text-destructive' : item.stock <= item.minStock ? 'text-warning' : 'text-foreground'}`}>{item.stock}</span></td>
                      <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">{item.minStock}</td>
                      <td className="px-4 py-3 text-center font-mono text-sm font-semibold text-foreground">{item.sold30d}</td>
                      <td className="px-4 py-3 text-center"><span className={statusConfig[item.status].className}>{statusConfig[item.status].label}</span></td>
                      <td className="px-4 py-3 text-right"><button onClick={() => setAdjustItem(item)} className="btn-secondary py-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">Ajustar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map((movement) => {
                  const config = movementConfig[movement.type]
                  return (
                    <tr key={movement.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3"><p className="text-sm font-semibold text-foreground">{movement.product}</p><p className="font-mono text-xs text-muted-foreground">{movement.sku}</p></td>
                      <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${config.className}`}><config.icon size={10} />{config.label}</span></td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-foreground">{movement.qty > 0 ? '+' : ''}{movement.qty}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{movement.date}</td>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{movement.user}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{movement.note || '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {adjustItem ? <AdjustModal item={adjustItem} onClose={() => setAdjustItem(null)} /> : null}
    </AppLayout>
  )
}
