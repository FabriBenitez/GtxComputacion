import { CalendarDays, Download, RefreshCw } from 'lucide-react'

export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Miercoles, 09 de abril de 2026 — Ultima actualizacion: 13:53 hs
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
          <CalendarDays size={15} />
          <span className="font-medium">Hoy</span>
        </div>
        <button className="btn-secondary text-xs px-3 py-2">
          <Download size={14} />
          Exportar
        </button>
        <button className="btn-primary text-xs px-3 py-2">
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>
    </div>
  )
}
