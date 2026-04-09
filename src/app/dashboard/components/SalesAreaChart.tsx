'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const salesData = [
  { day: 'Lun', ventas: 142300, unidades: 11 },
  { day: 'Mar', ventas: 198700, unidades: 16 },
  { day: 'Mie', ventas: 284750, unidades: 23 },
  { day: 'Jue', ventas: 167400, unidades: 13 },
  { day: 'Vie', ventas: 312100, unidades: 27 },
  { day: 'Sab', ventas: 421800, unidades: 38 },
  { day: 'Dom', ventas: 89600, unidades: 7 },
]

function formatARS(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`
  return `$${value}`
}

export default function SalesAreaChart() {
  return (
    <div className="h-full rounded-xl border border-border bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Ventas por Dia</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Semana actual — 03 al 09 abr 2026</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 rounded bg-primary" />
            Ingresos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-3 rounded bg-accent" />
            Unidades
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(209 76% 26%)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="hsl(209 76% 26%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradUnidades" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(20 100% 60%)" stopOpacity={0.14} />
              <stop offset="95%" stopColor="hsl(20 100% 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fontFamily: 'DM Sans', fill: 'hsl(215 16% 46%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatARS}
            tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono', fill: 'hsl(215 16% 46%)' }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              name === 'ventas'
                ? new Intl.NumberFormat('es-AR', {
                    style: 'currency',
                    currency: 'ARS',
                    maximumFractionDigits: 0,
                  }).format(value)
                : value,
              name === 'ventas' ? 'Ventas' : 'Unidades',
            ]}
          />
          <Area
            type="monotone"
            dataKey="ventas"
            stroke="hsl(209 76% 26%)"
            strokeWidth={2}
            fill="url(#gradVentas)"
            dot={{ r: 3, fill: 'hsl(209 76% 26%)', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="unidades"
            stroke="hsl(20 100% 60%)"
            strokeWidth={2}
            fill="url(#gradUnidades)"
            dot={{ r: 3, fill: 'hsl(20 100% 60%)', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
