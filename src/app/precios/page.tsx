'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { AlertCircle, Download, Edit2, History, RefreshCw, Save, Search, TrendingUp, X } from 'lucide-react'

interface PriceItem {
  id: string
  sku: string
  name: string
  category: string
  brand: string
  costPrice: number
  salePrice: number
  margin: number
  lastUpdated: string
  priceHistory: { date: string; price: number }[]
}

const CATEGORIES = ['Todos', 'Notebooks', 'Componentes PC', 'Perifericos', 'Audio', 'Redes', 'Streaming']

const initialPrices: PriceItem[] = [
  { id: '1', sku: 'LOG-G203', name: 'Mouse Logitech G203', category: 'Perifericos', brand: 'Logitech', costPrice: 18000, salePrice: 25000, margin: 38.9, lastUpdated: '09/04/2026', priceHistory: [{ date: '01/03/2026', price: 22000 }, { date: '15/03/2026', price: 23500 }, { date: '09/04/2026', price: 25000 }] },
  { id: '2', sku: 'RED-K552', name: 'Teclado Redragon K552', category: 'Perifericos', brand: 'Redragon', costPrice: 22000, salePrice: 32000, margin: 45.5, lastUpdated: '08/04/2026', priceHistory: [{ date: '01/03/2026', price: 28000 }, { date: '08/04/2026', price: 32000 }] },
  { id: '3', sku: 'SAM-T350', name: 'Monitor Samsung 27" T350', category: 'Perifericos', brand: 'Samsung', costPrice: 145000, salePrice: 195000, margin: 34.5, lastUpdated: '07/04/2026', priceHistory: [{ date: '01/02/2026', price: 175000 }, { date: '01/03/2026', price: 185000 }, { date: '07/04/2026', price: 195000 }] },
  { id: '4', sku: 'GOO-CC7', name: 'Chromecast Google TV 4K', category: 'Streaming', brand: 'Google', costPrice: 35000, salePrice: 48000, margin: 37.1, lastUpdated: '03/04/2026', priceHistory: [{ date: '01/02/2026', price: 42000 }, { date: '03/04/2026', price: 48000 }] },
]

function formatCurrency(value: number) {
  return '$' + value.toLocaleString('es-AR')
}

function calcMargin(cost: number, sale: number) {
  if (!cost) return 0
  return Math.round(((sale - cost) / cost) * 1000) / 10
}

function suggestedPrice(cost: number, targetMargin: number) {
  return Math.round(cost * (1 + targetMargin / 100))
}

export default function PreciosPage() {
  const [prices, setPrices] = useState(initialPrices)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ cost: 0, sale: 0 })
  const [bulkMargin, setBulkMargin] = useState('')
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [historyId, setHistoryId] = useState<string | null>(null)

  const filtered = prices.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'Todos' || item.category === selectedCategory
    return matchSearch && matchCategory
  })

  const avgMargin = prices.reduce((sum, item) => sum + item.margin, 0) / prices.length
  const lowMarginCount = prices.filter((item) => item.margin < 30).length
  const historyItem = historyId ? prices.find((item) => item.id === historyId) : null

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestion de Precios</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Actualiza precios y margenes en tiempo real</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm"><Download size={14} />Exportar</button>
            <button onClick={() => setShowBulkModal(true)} className="btn-primary text-sm"><RefreshCw size={14} />Actualizacion masiva</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Margen promedio', value: `${avgMargin.toFixed(1)}%`, icon: TrendingUp, variant: 'success' },
            { label: 'Bajo 30% margen', value: lowMarginCount, icon: AlertCircle, variant: lowMarginCount > 0 ? 'warning' : 'default' },
            { label: 'Productos activos', value: prices.length, icon: Edit2, variant: 'default' },
            { label: 'Actualizados hoy', value: prices.filter((item) => item.lastUpdated === '09/04/2026').length, icon: RefreshCw, variant: 'primary' },
          ].map((stat) => (
            <div key={stat.label} className={`kpi-card border ${stat.variant === 'success' ? 'bg-success/5 border-success/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : 'bg-white border-border'}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.variant === 'success' ? 'bg-success/10 text-success' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : stat.variant === 'primary' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}><stat.icon size={18} /></div>
              <div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p><p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p></div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o SKU..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${selectedCategory === category ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>{category}</button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Costo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio venta</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sugerido 35%</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margen</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actualizado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => {
                const isEditing = editingId === item.id
                const currentMargin = isEditing ? calcMargin(editValues.cost, editValues.sale) : item.margin
                return (
                  <tr key={item.id} className={`group transition-colors ${isEditing ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
                    <td className="px-4 py-3"><p className="text-sm font-semibold text-foreground">{item.name}</p><p className="font-mono text-xs text-muted-foreground">{item.sku} · {item.brand}</p></td>
                    <td className="px-4 py-3 text-right">{isEditing ? <input type="number" value={editValues.cost} onChange={(event) => setEditValues((current) => ({ ...current, cost: Number(event.target.value) }))} className="w-28 rounded-lg border border-primary bg-white px-2 py-1.5 text-right font-mono text-sm focus:outline-none" /> : <span className="font-mono text-sm text-muted-foreground">{formatCurrency(item.costPrice)}</span>}</td>
                    <td className="px-4 py-3 text-right">{isEditing ? <input type="number" value={editValues.sale} onChange={(event) => setEditValues((current) => ({ ...current, sale: Number(event.target.value) }))} className="w-28 rounded-lg border border-primary bg-white px-2 py-1.5 text-right font-mono text-sm focus:outline-none" /> : <span className="font-mono text-sm font-bold text-foreground">{formatCurrency(item.salePrice)}</span>}</td>
                    <td className="px-4 py-3 text-right"><span className="font-mono text-sm text-muted-foreground">{formatCurrency(suggestedPrice(item.costPrice, 35))}</span></td>
                    <td className="px-4 py-3 text-center"><span className={`font-mono text-sm font-bold ${currentMargin >= 35 ? 'text-success' : currentMargin >= 25 ? 'text-warning' : 'text-destructive'}`}>{currentMargin}%</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.lastUpdated}</td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setPrices((current) => current.map((price) => price.id === item.id ? { ...price, costPrice: editValues.cost, salePrice: editValues.sale, margin: calcMargin(editValues.cost, editValues.sale), lastUpdated: '09/04/2026' } : price)); setEditingId(null) }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-success transition-colors hover:bg-success/20"><Save size={13} /></button>
                          <button onClick={() => setEditingId(null)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={13} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => setHistoryId(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><History size={13} /></button>
                          <button onClick={() => { setEditingId(item.id); setEditValues({ cost: item.costPrice, sale: item.salePrice }) }} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"><Edit2 size={13} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showBulkModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-modal animate-slide-up">
            <div className="flex items-center justify-between border-b border-border px-6 py-4"><h2 className="text-lg font-bold text-foreground">Actualizacion masiva de precios</h2><button onClick={() => setShowBulkModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button></div>
            <div className="space-y-4 p-6">
              <div className="flex gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4"><AlertCircle size={16} className="mt-0.5 shrink-0 text-warning" /><p className="text-sm text-foreground">Esto actualizara el precio de venta de todos los productos segun el margen indicado sobre el costo.</p></div>
              <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margen objetivo (%)</label><input type="number" value={bulkMargin} onChange={(event) => setBulkMargin(event.target.value)} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            </div>
            <div className="flex gap-3 border-t border-border px-6 py-4">
              <button onClick={() => setShowBulkModal(false)} className="btn-secondary flex-1 text-sm">Cancelar</button>
              <button onClick={() => { const margin = parseFloat(bulkMargin); if (!Number.isNaN(margin)) setPrices((current) => current.map((item) => ({ ...item, salePrice: suggestedPrice(item.costPrice, margin), margin, lastUpdated: '09/04/2026' }))); setShowBulkModal(false); setBulkMargin('') }} className="btn-primary flex-1 text-sm">Aplicar a todos</button>
            </div>
          </div>
        </div>
      ) : null}

      {historyItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-modal animate-slide-up">
            <div className="flex items-center justify-between border-b border-border px-6 py-4"><h2 className="text-base font-bold text-foreground">Historial de precios</h2><button onClick={() => setHistoryId(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button></div>
            <div className="p-6"><p className="mb-4 text-sm font-semibold text-foreground">{historyItem.name}</p><div className="space-y-2">{historyItem.priceHistory.map((entry, index) => <div key={`${historyItem.id}-${index}`} className="flex items-center justify-between rounded-xl bg-muted/30 p-3"><span className="text-xs text-muted-foreground">{entry.date}</span><span className="font-mono text-sm font-bold text-foreground">{formatCurrency(entry.price)}</span></div>)}</div></div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  )
}
