'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Globe,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react'
import AppLogo from './ui/AppLogo'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  group: string
  badge?: number
  badgeVariant?: 'destructive' | 'primary'
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, group: 'Principal' },
  { id: 'pos', label: 'Punto de Venta', href: '/pos', icon: ShoppingCart, group: 'Ventas' },
  { id: 'ventas', label: 'Historial Ventas', href: '/ventas', icon: BarChart3, group: 'Ventas' },
  { id: 'clientes', label: 'Clientes', href: '/clientes', icon: Users, group: 'Ventas' },
  { id: 'productos', label: 'Productos', href: '/productos', icon: Package, group: 'Inventario' },
  { id: 'stock', label: 'Control de Stock', href: '/stock', icon: AlertTriangle, group: 'Inventario', badge: 7, badgeVariant: 'destructive' },
  { id: 'precios', label: 'Gestion de Precios', href: '/precios', icon: Tag, group: 'Inventario' },
  { id: 'catalogo', label: 'Catalogo Online', href: '/catalogo', icon: Globe, group: 'Marketing' },
  { id: 'whatsapp', label: 'WhatsApp Leads', href: '/whatsapp', icon: MessageCircle, group: 'Marketing', badge: 12, badgeVariant: 'primary' },
  { id: 'configuracion', label: 'Configuracion', href: '/configuracion', icon: Settings, group: 'Sistema' },
]

const groups = ['Principal', 'Ventas', 'Inventario', 'Marketing', 'Sistema']

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const badgeClass = (variant?: string) =>
    variant === 'destructive'
      ? 'bg-destructive/10 text-destructive'
      : 'bg-primary/10 text-primary'

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-border bg-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      <div className={`flex min-h-[72px] items-center gap-3 border-b border-border px-4 py-4 ${collapsed ? 'justify-center px-2' : ''}`}>
        <AppLogo size={36} />
        {!collapsed ? <span className="truncate text-base font-bold tracking-tight text-foreground">TechOps</span> : null}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {groups.map((group) => {
          const items = navItems.filter((item) => item.group === group)
          if (!items.length) return null
          return (
            <div key={group} className="mb-4">
              {!collapsed ? (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{group}</p>
              ) : null}
              {items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`sidebar-nav-item relative ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed ? <span className="flex-1 truncate">{item.label}</span> : null}
                    {!collapsed && item.badge !== undefined ? (
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${badgeClass(item.badgeVariant)}`}>
                        {item.badge}
                      </span>
                    ) : null}
                    {collapsed && item.badge !== undefined ? (
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                    ) : null}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-border px-2 py-3">
        <button className={`sidebar-nav-item w-full ${collapsed ? 'justify-center px-0' : ''}`}>
          <Bell size={18} className="shrink-0" />
          {!collapsed ? <span className="flex-1 text-left">Notificaciones</span> : null}
        </button>

        {!collapsed ? (
          <div className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              MR
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-foreground">Martin Rodriguez</p>
              <p className="text-[10px] text-muted-foreground">Admin</p>
            </div>
            <button className="text-muted-foreground transition-colors hover:text-destructive">
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button className="sidebar-nav-item w-full justify-center px-0" title="Cerrar sesion">
            <LogOut size={18} />
          </button>
        )}
      </div>

      <button
        onClick={() => setCollapsed((current) => !current)}
        className="absolute -right-3 top-[76px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors hover:bg-muted"
        aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
      >
        {collapsed ? <ChevronRight size={12} className="text-muted-foreground" /> : <ChevronLeft size={12} className="text-muted-foreground" />}
      </button>
    </aside>
  )
}
