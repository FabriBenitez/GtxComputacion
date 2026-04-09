import { Minus, TrendingDown, TrendingUp } from 'lucide-react'

interface TopProduct {
  id: string
  sku: string
  nombre: string
  categoria: string
  marca: string
  vendidosHoy: number
  vendidosMes: number
  precio: number
  margen: number
  stock: number
  trend: 'up' | 'down' | 'flat'
}

const topProducts: TopProduct[] = [
  { id: '1', sku: 'NB-LEN-I5-001', nombre: 'Lenovo IdeaPad 3 i5-12va 8GB 512GB', categoria: 'Notebooks', marca: 'Lenovo', vendidosHoy: 4, vendidosMes: 47, precio: 389900, margen: 28.4, stock: 6, trend: 'up' },
  { id: '2', sku: 'MK-LOG-K845-02', nombre: 'Teclado Logitech MK845 Mecanico', categoria: 'Perifericos', marca: 'Logitech', vendidosHoy: 6, vendidosMes: 83, precio: 42700, margen: 41.2, stock: 14, trend: 'up' },
  { id: '3', sku: 'HS-RED-H510-03', nombre: 'Headset Redragon H510 Zeus 7.1', categoria: 'Audio', marca: 'Redragon', vendidosHoy: 5, vendidosMes: 61, precio: 28400, margen: 37.8, stock: 3, trend: 'flat' },
  { id: '4', sku: 'MON-SAM-24F-04', nombre: 'Monitor Samsung 24" F24T350 FHD', categoria: 'Perifericos', marca: 'Samsung', vendidosHoy: 3, vendidosMes: 38, precio: 187500, margen: 22.1, stock: 9, trend: 'down' },
  { id: '5', sku: 'SW-TPL-AX1800-05', nombre: 'Router TP-Link Archer AX1800 WiFi 6', categoria: 'Redes', marca: 'TP-Link', vendidosHoy: 2, vendidosMes: 29, precio: 54200, margen: 33.6, stock: 11, trend: 'up' },
]

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  if (trend === 'up') return <TrendingUp size={14} className="text-success" />
  if (trend === 'down') return <TrendingDown size={14} className="text-destructive" />
  return <Minus size={14} className="text-muted-foreground" />
}

export default function TopProductsTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Top Productos</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Mas vendidos — hoy y en el mes</p>
        </div>
        <span className="badge badge-primary">Semana actual</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categoria</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hoy</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mes</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Precio</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Margen</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">—</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {topProducts.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <div>
                    <p className="max-w-[220px] truncate text-sm font-medium leading-snug text-foreground">{product.nombre}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{product.sku}</p>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="badge badge-muted">{product.categoria}</span>
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold text-foreground">{product.vendidosHoy}</td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold text-foreground">{product.vendidosMes}</td>
                <td className="px-4 py-3.5 text-right font-mono text-sm text-foreground">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(product.precio)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className={`font-mono text-sm font-semibold ${product.margen >= 35 ? 'text-success' : product.margen >= 25 ? 'text-foreground' : 'text-warning'}`}>
                    {product.margen}%
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={product.stock <= 3 ? 'badge badge-warning' : 'badge badge-success'}>
                    {product.stock} u.
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <TrendIcon trend={product.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
