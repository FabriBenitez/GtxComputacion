'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import {
  Award,
  ExternalLink,
  Eye,
  MessageCircle,
  Package,
  Search,
  Star,
  Tag,
  ToggleLeft,
  ToggleRight,
  Zap,
} from 'lucide-react'

interface CatalogProduct {
  id: string
  sku: string
  name: string
  category: string
  brand: string
  price: number
  stock: number
  badge?: 'bestseller' | 'offer' | 'last_units' | 'new'
  visible: boolean
  whatsappClicks: number
  specs: Record<string, string>
  description: string
}

const CATEGORIES = ['Todos', 'Notebooks', 'Componentes PC', 'Perifericos', 'Audio', 'Redes', 'Streaming']
const WA_NUMBER = '5491112345678'

const catalogProducts: CatalogProduct[] = [
  { id: '1', sku: 'LOG-G203', name: 'Mouse Logitech G203', category: 'Perifericos', brand: 'Logitech', price: 25000, stock: 14, badge: 'bestseller', visible: true, whatsappClicks: 47, specs: { Conectividad: 'USB', DPI: '8000', Botones: '6' }, description: 'Mouse gaming con sensor HERO de alta precision y RGB personalizable.' },
  { id: '2', sku: 'RED-K552', name: 'Teclado Redragon K552', category: 'Perifericos', brand: 'Redragon', price: 32000, stock: 8, badge: 'new', visible: true, whatsappClicks: 31, specs: { Switch: 'Outemu Blue', Layout: 'TKL', Retroiluminacion: 'RGB' }, description: 'Teclado mecanico compacto TKL con switches tactiles.' },
  { id: '3', sku: 'SAM-T350', name: 'Monitor Samsung 27" T350', category: 'Perifericos', brand: 'Samsung', price: 195000, stock: 3, badge: 'last_units', visible: true, whatsappClicks: 89, specs: { Resolucion: '1920x1080', Panel: 'IPS', Hz: '75' }, description: 'Monitor Full HD IPS de 27 pulgadas con colores vibrantes.' },
  { id: '4', sku: 'TPL-AX23', name: 'Router TP-Link AX23', category: 'Redes', brand: 'TP-Link', price: 38500, stock: 6, badge: 'offer', visible: true, whatsappClicks: 22, specs: { WiFi: 'AX1800', Puertos: '4x LAN', Bandas: 'Dual' }, description: 'Router WiFi 6 de doble banda con velocidades de hasta 1800 Mbps.' },
  { id: '5', sku: 'GOO-CC7', name: 'Chromecast Google TV 4K', category: 'Streaming', brand: 'Google', price: 48000, stock: 11, badge: 'bestseller', visible: true, whatsappClicks: 63, specs: { Resolucion: '4K HDR', WiFi: 'AC', Voz: 'Google Assistant' }, description: 'Transforma tu TV en un smart TV con Google TV.' },
  { id: '6', sku: 'INT-I5-12', name: 'Procesador Intel Core i5-12400', category: 'Componentes PC', brand: 'Intel', price: 135000, stock: 4, visible: true, whatsappClicks: 18, specs: { Nucleos: '6', Hilos: '12', Socket: 'LGA1700' }, description: 'Procesador de 12a generacion para gaming y productividad.' },
]

const badgeConfig = {
  bestseller: { label: 'Mas vendido', icon: Award, className: 'bg-accent/10 text-accent border-accent/20' },
  offer: { label: 'Oferta', icon: Tag, className: 'bg-destructive/10 text-destructive border-destructive/20' },
  last_units: { label: 'Ultimas unidades', icon: Zap, className: 'bg-warning/10 text-warning border-warning/20' },
  new: { label: 'Nuevo', icon: Star, className: 'bg-success/10 text-success border-success/20' },
}

function formatCurrency(value: number) {
  return '$' + value.toLocaleString('es-AR')
}

function generateWhatsAppMessage(product: CatalogProduct) {
  return encodeURIComponent(
    `Hola! Estoy interesado en este producto:\n\n🖥️ ${product.name}\n💰 ${formatCurrency(product.price)}\n\n¿Lo tenes disponible?`,
  )
}

function ProductDetail({ product, onClose }: { product: CatalogProduct; onClose: () => void }) {
  const badge = product.badge ? badgeConfig[product.badge] : null
  const waLink = `https://wa.me/${WA_NUMBER}?text=${generateWhatsAppMessage(product)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-modal animate-slide-up">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Ficha de producto</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted">✕</button>
        </div>
        <div className="space-y-5 p-6">
          <div className="flex h-48 w-full items-center justify-center rounded-xl bg-muted">
            <Package size={48} className="text-muted-foreground/30" />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.brand} · <span className="font-mono">{product.sku}</span></p>
            </div>
            {badge ? <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${badge.className}`}><badge.icon size={11} />{badge.label}</span> : null}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="rounded-xl bg-muted/40 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Especificaciones tecnicas</p>
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="font-mono text-3xl font-bold text-foreground">{formatCurrency(product.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Stock disponible</p>
              <p className={`font-mono text-2xl font-bold ${product.stock === 0 ? 'text-destructive' : product.stock <= 3 ? 'text-warning' : 'text-success'}`}>{product.stock} uds.</p>
            </div>
          </div>
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary w-full justify-center py-3 text-sm">
            <MessageCircle size={16} />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

export default function CatalogoPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null)
  const [products, setProducts] = useState(catalogProducts)

  const filtered = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.brand.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    return matchSearch && matchCategory
  })

  const totalClicks = products.reduce((sum, product) => sum + product.whatsappClicks, 0)
  const visibleCount = products.filter((product) => product.visible).length

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Catalogo Online</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Vitrina publica de productos</p>
          </div>
          <a href="#" className="btn-secondary text-sm"><ExternalLink size={14} />Ver catalogo publico</a>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Productos visibles', value: visibleCount, sub: `de ${products.length} totales`, icon: Eye, variant: 'primary' },
            { label: 'Clics WhatsApp', value: totalClicks, sub: 'ultimos 30 dias', icon: MessageCircle, variant: 'success' },
            { label: 'Mas consultado', value: 'Monitor Samsung', sub: '89 clics', icon: Star, variant: 'warning' },
            { label: 'Categorias activas', value: CATEGORIES.length - 1, sub: 'en catalogo', icon: Tag, variant: 'default' },
          ].map((stat) => (
            <div key={stat.label} className={`kpi-card border ${stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : stat.variant === 'success' ? 'bg-success/5 border-success/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : 'bg-white border-border'}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.variant === 'primary' ? 'bg-primary/10 text-primary' : stat.variant === 'success' ? 'bg-success/10 text-success' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="font-mono text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-white p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o marca..." className="w-full rounded-lg border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button key={category} onClick={() => setSelectedCategory(category)} className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${selectedCategory === category ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted-foreground hover:bg-muted'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => {
            const badge = product.badge ? badgeConfig[product.badge] : null
            const waLink = `https://wa.me/${WA_NUMBER}?text=${generateWhatsAppMessage(product)}`
            return (
              <div key={product.id} className={`group rounded-xl border bg-white transition-all ${product.visible ? 'border-border hover:shadow-card-hover' : 'border-border opacity-60'}`}>
                <div className="relative flex h-36 items-center justify-center rounded-t-xl bg-muted">
                  <Package size={32} className="text-muted-foreground/30" />
                  {badge ? <span className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.className}`}><badge.icon size={9} />{badge.label}</span> : null}
                  {!product.visible ? <span className="badge badge-muted absolute right-2 top-2 text-[10px]">Oculto</span> : null}
                </div>
                <div className="p-4">
                  <p className="mb-0.5 line-clamp-2 text-sm font-semibold leading-tight text-foreground">{product.name}</p>
                  <p className="mb-2 text-xs text-muted-foreground">{product.brand} · <span className="font-mono">{product.sku}</span></p>
                  <div className="mb-3 space-y-1">
                    {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-base font-bold text-primary">{formatCurrency(product.price)}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle size={11} /><span>{product.whatsappClicks}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <a href={waLink} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#25D366]/20 bg-[#25D366]/10 py-2 text-xs font-semibold text-[#128C7E] transition-colors hover:bg-[#25D366]/20"><MessageCircle size={12} />WhatsApp</a>
                    <button onClick={() => setSelectedProduct(product)} className="btn-secondary flex-1 py-2 text-xs"><Eye size={12} />Ver ficha</button>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">Visible en catalogo</span>
                    <button onClick={() => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, visible: !item.visible } : item))} className={`transition-colors ${product.visible ? 'text-success' : 'text-muted-foreground'}`}>
                      {product.visible ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {selectedProduct ? <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} /> : null}
    </AppLayout>
  )
}
