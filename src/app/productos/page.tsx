'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { ArrowUpDown, Edit2, Eye, Filter, MoreVertical, Package, Plus, Search, Upload, X } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  category: string
  brand: string
  costPrice: number
  salePrice: number
  margin: number
  stock: number
  minStock: number
  status: 'active' | 'low' | 'out'
  specs?: Record<string, string>
}

const CATEGORIES = ['Todos', 'Notebooks', 'Componentes PC', 'Perifericos', 'Audio', 'Redes', 'Streaming']
const BRANDS = ['Todas', 'Logitech', 'Redragon', 'Samsung', 'Kingston', 'TP-Link', 'Google', 'Intel', 'AMD']

const mockProducts: Product[] = [
  { id: '1', sku: 'LOG-G203', name: 'Mouse Logitech G203', category: 'Perifericos', brand: 'Logitech', costPrice: 18000, salePrice: 25000, margin: 38.9, stock: 14, minStock: 5, status: 'active', specs: { Conectividad: 'USB', DPI: '8000', Botones: '6' } },
  { id: '2', sku: 'RED-K552', name: 'Teclado Redragon K552', category: 'Perifericos', brand: 'Redragon', costPrice: 22000, salePrice: 32000, margin: 45.5, stock: 8, minStock: 5, status: 'active', specs: { Switch: 'Outemu Blue', Layout: 'TKL', Retroiluminacion: 'RGB' } },
  { id: '3', sku: 'SAM-T350', name: 'Monitor Samsung 27" T350', category: 'Perifericos', brand: 'Samsung', costPrice: 145000, salePrice: 195000, margin: 34.5, stock: 3, minStock: 4, status: 'low', specs: { Resolucion: '1920x1080', Panel: 'IPS', Hz: '75' } },
  { id: '4', sku: 'KIN-8GB', name: 'RAM Kingston 8GB DDR4', category: 'Componentes PC', brand: 'Kingston', costPrice: 14000, salePrice: 19500, margin: 39.3, stock: 0, minStock: 10, status: 'out', specs: { Capacidad: '8GB', Velocidad: '3200MHz', Tipo: 'DDR4' } },
]

const statusConfig = {
  active: { label: 'Activo', className: 'badge badge-success' },
  low: { label: 'Stock bajo', className: 'badge badge-warning' },
  out: { label: 'Sin stock', className: 'badge badge-destructive' },
}

function formatCurrency(value: number) {
  return '$' + value.toLocaleString('es-AR')
}

function ProductModal({ product, onClose }: { product?: Product | null; onClose: () => void }) {
  const [costPrice, setCostPrice] = useState(product?.costPrice ?? 0)
  const [salePrice, setSalePrice] = useState(product?.salePrice ?? 0)
  const margin = costPrice > 0 ? (((salePrice - costPrice) / costPrice) * 100).toFixed(1) : '0.0'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><X size={16} /></button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40 hover:bg-primary/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"><Upload size={18} className="text-muted-foreground" /></div>
            <p className="text-sm font-medium text-foreground">Subir imagen del producto</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre del producto *</label>
              <input defaultValue={product?.name} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU *</label>
              <input defaultValue={product?.sku} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marca</label>
              <select defaultValue={product?.brand} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">{BRANDS.slice(1).map((brand) => <option key={brand}>{brand}</option>)}</select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</label>
              <select defaultValue={product?.category} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">{CATEGORIES.slice(1).map((category) => <option key={category}>{category}</option>)}</select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock actual</label>
              <input type="number" defaultValue={product?.stock} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precios</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Precio de costo</label>
                <input type="number" value={costPrice} onChange={(event) => setCostPrice(Number(event.target.value))} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Precio de venta</label>
                <input type="number" value={salePrice} onChange={(event) => setSalePrice(Number(event.target.value))} className="w-full rounded-lg border border-border bg-white px-3 py-2.5 font-mono text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Margen</label>
                <div className="rounded-lg border border-success/30 bg-success/5 px-3 py-2.5 font-mono text-sm font-bold text-success">{margin}%</div>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Descripcion tecnica</label>
            <textarea rows={3} defaultValue={product ? Object.entries(product.specs || {}).map(([key, value]) => `${key}: ${value}`).join('\n') : ''} className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button onClick={onClose} className="btn-secondary text-sm">Cancelar</button>
          <button className="btn-primary text-sm">{product ? 'Guardar cambios' : 'Crear producto'}</button>
        </div>
      </div>
    </div>
  )
}

export default function ProductosPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedBrand, setSelectedBrand] = useState('Todas')
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const filtered = mockProducts.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.sku.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    const matchBrand = selectedBrand === 'Todas' || product.brand === selectedBrand
    return matchSearch && matchCategory && matchBrand
  })

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Productos</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{mockProducts.length} productos en catalogo</p>
          </div>
          <button onClick={() => { setEditProduct(null); setModalOpen(true) }} className="btn-primary text-sm"><Plus size={16} />Nuevo producto</button>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o SKU..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
            <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">{BRANDS.map((brand) => <option key={brand}>{brand}</option>)}</select>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setViewMode('table')} className={`rounded-lg p-2 transition-colors ${viewMode === 'table' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><ArrowUpDown size={14} /></button>
            <button onClick={() => setViewMode('grid')} className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}><Package size={14} /></button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Costo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Venta</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margen</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((product) => (
                  <tr key={product.id} className="group transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Package size={16} className="text-muted-foreground" /></div>
                        <div><p className="text-sm font-semibold text-foreground">{product.name}</p><p className="text-xs text-muted-foreground">{product.brand}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3"><span className="badge badge-muted text-xs">{product.category}</span></td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">{formatCurrency(product.costPrice)}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-foreground">{formatCurrency(product.salePrice)}</td>
                    <td className="px-4 py-3 text-right"><span className={`font-mono text-sm font-bold ${product.margin >= 35 ? 'text-success' : product.margin >= 25 ? 'text-warning' : 'text-destructive'}`}>{product.margin}%</span></td>
                    <td className="px-4 py-3 text-center"><span className={`font-mono text-sm font-bold ${product.stock === 0 ? 'text-destructive' : product.stock <= product.minStock ? 'text-warning' : 'text-foreground'}`}>{product.stock}</span></td>
                    <td className="px-4 py-3 text-center"><span className={statusConfig[product.status].className}>{statusConfig[product.status].label}</span></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button onClick={() => { setEditProduct(product); setModalOpen(true) }} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"><Edit2 size={13} /></button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><Eye size={13} /></button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div key={product.id} className="group rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-card-hover">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted"><Package size={20} className="text-muted-foreground" /></div>
                  <span className={statusConfig[product.status].className}>{statusConfig[product.status].label}</span>
                </div>
                <h3 className="mb-0.5 line-clamp-2 text-sm font-semibold text-foreground">{product.name}</h3>
                <p className="mb-3 font-mono text-xs text-muted-foreground">{product.sku} · {product.brand}</p>
                {product.specs ? <div className="mb-3 space-y-1">{Object.entries(product.specs).slice(0, 2).map(([key, value]) => <div key={key} className="flex justify-between text-xs"><span className="text-muted-foreground">{key}</span><span className="font-medium text-foreground">{value}</span></div>)}</div> : null}
                <div className="flex items-center justify-between border-t border-border pt-3"><div><p className="text-xs text-muted-foreground">Precio venta</p><p className="font-mono font-bold text-foreground">{formatCurrency(product.salePrice)}</p></div><div className="text-right"><p className="text-xs text-muted-foreground">Margen</p><p className={`font-mono font-bold ${product.margin >= 35 ? 'text-success' : 'text-warning'}`}>{product.margin}%</p></div></div>
                <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => { setEditProduct(product); setModalOpen(true) }} className="btn-secondary flex-1 py-1.5 text-xs"><Edit2 size={12} />Editar</button>
                  <button className="btn-primary flex-1 py-1.5 text-xs"><Eye size={12} />Ver</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modalOpen ? <ProductModal product={editProduct} onClose={() => setModalOpen(false)} /> : null}
    </AppLayout>
  )
}
