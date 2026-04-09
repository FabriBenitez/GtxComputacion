'use client'

import { AlertTriangle, ChevronRight, RefreshCw, XCircle } from 'lucide-react'
import { useState } from 'react'

interface StockAlert {
  id: string
  sku: string
  nombre: string
  stock: number
  minimo: number
  severity: 'critical' | 'warning'
}

const initialAlerts: StockAlert[] = [
  { id: '1', sku: 'NB-ASU-F515-07', nombre: 'ASUS VivoBook F515 i3 8GB', stock: 0, minimo: 2, severity: 'critical' },
  { id: '2', sku: 'GPU-MSI-3060-08', nombre: 'MSI GeForce RTX 3060 12GB', stock: 0, minimo: 1, severity: 'critical' },
  { id: '3', sku: 'MOU-LOG-G502-09', nombre: 'Mouse Logitech G502 Hero', stock: 1, minimo: 4, severity: 'critical' },
  { id: '4', sku: 'SSD-SAM-870-10', nombre: 'Samsung SSD 870 EVO 1TB', stock: 2, minimo: 5, severity: 'warning' },
  { id: '5', sku: 'KB-RED-K552-11', nombre: 'Teclado Redragon K552 Kumara', stock: 2, minimo: 6, severity: 'warning' },
]

export default function StockAlertsFeed() {
  const [alerts, setAlerts] = useState(initialAlerts)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangle size={15} className="text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Alertas de Stock</h2>
            <p className="text-xs text-muted-foreground">{alerts.filter((item) => item.severity === 'critical').length} criticos · {alerts.filter((item) => item.severity === 'warning').length} bajos</p>
          </div>
        </div>
        <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="divide-y divide-border">
          {alerts.map((alert) => (
            <div key={alert.id} className={`group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-muted/20 ${alert.severity === 'critical' ? 'bg-destructive/[0.02]' : ''}`}>
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${alert.severity === 'critical' ? 'bg-destructive' : 'bg-warning'}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-snug text-foreground">{alert.nombre}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{alert.sku}</span>
                  <span className={`text-[10px] font-semibold ${alert.severity === 'critical' ? 'text-destructive' : 'text-warning'}`}>
                    {alert.stock === 0 ? 'SIN STOCK' : `${alert.stock}/${alert.minimo} u.`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                  <ChevronRight size={13} />
                </button>
                <button
                  onClick={() => setAlerts((current) => current.filter((item) => item.id !== alert.id))}
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <XCircle size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
