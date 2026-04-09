import {
  AlertTriangle,
  MessageCircle,
  Package,
  Percent,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

interface KPICardProps {
  id: string
  title: string
  value: string
  subValue?: string
  trend?: number
  trendLabel?: string
  icon: React.ElementType
  variant: 'default' | 'success' | 'destructive' | 'warning' | 'primary'
  colSpan?: 'single' | 'double'
  mono?: boolean
}

const kpis: KPICardProps[] = [
  {
    id: 'ventas-dia',
    title: 'Ventas del Dia',
    value: '$284.750',
    subValue: '23 transacciones',
    trend: 18.4,
    trendLabel: 'vs ayer',
    icon: ShoppingBag,
    variant: 'success',
    colSpan: 'double',
    mono: true,
  },
  {
    id: 'ingresos-mes',
    title: 'Ingresos del Mes',
    value: '$3.847.200',
    subValue: 'Meta: $4.200.000',
    trend: -4.2,
    trendLabel: 'vs mes anterior',
    icon: TrendingUp,
    variant: 'warning',
    mono: true,
  },
  {
    id: 'margen',
    title: 'Margen Promedio',
    value: '34,7%',
    subValue: 'Sobre costo',
    trend: 2.1,
    trendLabel: 'vs semana pasada',
    icon: Percent,
    variant: 'default',
    mono: true,
  },
  {
    id: 'sin-stock',
    title: 'Productos Sin Stock',
    value: '7',
    subValue: '3 con pedido pendiente',
    icon: AlertTriangle,
    variant: 'destructive',
    mono: true,
  },
  {
    id: 'whatsapp',
    title: 'Leads WhatsApp Hoy',
    value: '34',
    subValue: '8 reservas activas',
    trend: 22.6,
    trendLabel: 'vs ayer',
    icon: MessageCircle,
    variant: 'primary',
    mono: true,
  },
  {
    id: 'bajo-minimo',
    title: 'Bajo Minimo',
    value: '12',
    subValue: 'Requieren reposicion',
    icon: Package,
    variant: 'warning',
    mono: true,
  },
]

const variantStyles: Record<
  string,
  { card: string; icon: string; value: string }
> = {
  default: {
    card: 'bg-white border-border',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
  },
  success: {
    card: 'bg-success/5 border-success/20',
    icon: 'bg-success/10 text-success',
    value: 'text-foreground',
  },
  destructive: {
    card: 'bg-destructive/5 border-destructive/20',
    icon: 'bg-destructive/10 text-destructive',
    value: 'text-destructive',
  },
  warning: {
    card: 'bg-warning/5 border-warning/20',
    icon: 'bg-warning/10 text-warning',
    value: 'text-foreground',
  },
  primary: {
    card: 'bg-primary/5 border-primary/20',
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
  },
}

function KPICard({
  title,
  value,
  subValue,
  trend,
  trendLabel,
  icon: Icon,
  variant,
  colSpan,
  mono,
}: KPICardProps) {
  const styles = variantStyles[variant]
  const isPositive = trend !== undefined && trend > 0

  return (
    <div
      className={`kpi-card border ${styles.card} ${colSpan === 'double' ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
    >
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${styles.icon}`}>
          <Icon size={18} />
        </div>
        {trend !== undefined ? (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isPositive ? '+' : ''}
            {trend}%
          </div>
        ) : null}
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <p
          className={`tabular-nums font-bold ${styles.value} ${mono ? 'font-mono' : ''} ${colSpan === 'double' ? 'text-4xl' : 'text-3xl'}`}
        >
          {value}
        </p>
        {subValue ? <p className="mt-1 text-xs text-muted-foreground">{subValue}</p> : null}
        {trendLabel ? <p className="mt-0.5 text-[11px] text-muted-foreground">{trendLabel}</p> : null}
      </div>
    </div>
  )
}

export default function KPIBentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} {...kpi} />
      ))}
    </div>
  )
}
