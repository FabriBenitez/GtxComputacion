'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const categoryData = [
  { categoria: 'Notebooks', ingresos: 1482000 },
  { categoria: 'Perifericos', ingresos: 876400 },
  { categoria: 'Componentes', ingresos: 621700 },
  { categoria: 'Audio', ingresos: 398200 },
  { categoria: 'Redes', ingresos: 287500 },
  { categoria: 'Streaming', ingresos: 181400 },
]

const barColors = [
  'hsl(209 76% 26%)',
  'hsl(209 76% 36%)',
  'hsl(209 76% 46%)',
  'hsl(209 76% 54%)',
  'hsl(209 76% 62%)',
  'hsl(209 76% 70%)',
]

export default function CategoryBarChart() {
  return (
    <div className="h-full rounded-xl border border-border bg-white p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">Ingresos por Categoria</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Mes actual — abril 2026</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 88%)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(value) => (value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}k`)}
            tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono', fill: 'hsl(215 16% 46%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="categoria"
            type="category"
            tick={{ fontSize: 12, fontFamily: 'DM Sans', fill: 'hsl(215 28% 12%)' }}
            axisLine={false}
            tickLine={false}
            width={84}
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Bar dataKey="ingresos" radius={[0, 4, 4, 0]}>
            {categoryData.map((entry, index) => (
              <Cell key={entry.categoria} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
