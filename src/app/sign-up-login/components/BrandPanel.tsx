import { BarChart3, MessageCircle, Package, ShieldCheck } from 'lucide-react'
import AppLogo from '@/components/ui/AppLogo'

const features = [
  {
    id: 'inventario',
    icon: Package,
    title: 'Control de Inventario',
    desc: 'Stock en tiempo real con alertas automaticas de reposicion.',
  },
  {
    id: 'ventas',
    icon: BarChart3,
    title: 'POS + Analisis de Ventas',
    desc: 'Venta rapida desde mostrador con reportes diarios y mensuales.',
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    title: 'Canal WhatsApp',
    desc: 'Links automaticos de consulta y reserva directamente desde el catalogo.',
  },
  {
    id: 'roles',
    icon: ShieldCheck,
    title: 'Roles y Permisos',
    desc: 'Acceso diferenciado para duenio, vendedores y gestion de stock.',
  },
]

export default function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[hsl(209_76%_26%)] px-12 py-12 lg:flex lg:w-[480px] xl:w-[520px] 2xl:w-[560px]">
      <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute right-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/[0.03]" />

      <div className="relative z-10">
        <div className="mb-16 flex items-center gap-3">
          <AppLogo size={36} className="rounded-2xl" />
          <span className="text-xl font-bold tracking-tight text-white">TechOps</span>
        </div>

        <div className="mb-10">
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white">
            Gestion completa
            <br />
            para tu tienda tech.
          </h1>
          <p className="text-base leading-relaxed text-white/70">
            Stock, ventas, clientes y catalogo online. Todo en un solo lugar, disenado para el ritmo
            de una tienda de tecnologia.
          </p>
        </div>

        <div className="space-y-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.id} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={17} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/60">{feature.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 pt-6 text-xs text-white/50">
        © 2026 TechOps · Version 2.4.1 · Soporte
      </div>
    </div>
  )
}
