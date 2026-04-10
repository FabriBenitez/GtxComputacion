'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Search, Download, TrendingUp, ShoppingBag, CreditCard, Banknote, Smartphone, Eye, X, Calendar, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SaleItem {
  name: string;
  qty: number;
  price: number;
}

interface Sale {
  id: string;
  number: string;
  date: string;
  time: string;
  customer: string;
  items: SaleItem[];
  total: number;
  discount: number;
  method: 'efectivo' | 'transferencia' | 'mercadopago';
  seller: string;
  status: 'completed' | 'cancelled';
}

const mockSales: Sale[] = [
  { id: '1', number: '#1050', date: '09/04/2026', time: '13:45', customer: 'Carlos Méndez', items: [{ name: 'Intel i5-12400', qty: 1, price: 135000 }, { name: 'RAM Kingston 16GB', qty: 1, price: 28000 }], total: 163000, discount: 0, method: 'transferencia', seller: 'Sofía R.', status: 'completed' },
  { id: '2', number: '#1049', date: '09/04/2026', time: '12:20', customer: 'Rodrigo Fernández', items: [{ name: 'Chromecast Google TV 4K', qty: 1, price: 48000 }], total: 48000, discount: 0, method: 'efectivo', seller: 'Martín R.', status: 'completed' },
  { id: '3', number: '#1048', date: '09/04/2026', time: '11:05', customer: 'Anónimo', items: [{ name: 'Mouse Logitech G203', qty: 2, price: 25000 }, { name: 'Teclado Redragon K552', qty: 1, price: 32000 }], total: 73600, discount: 10, method: 'mercadopago', seller: 'Sofía R.', status: 'completed' },
  { id: '4', number: '#1047', date: '08/04/2026', time: '17:30', customer: 'Valeria Torres', items: [{ name: 'Router TP-Link AX23', qty: 2, price: 38500 }], total: 77000, discount: 0, method: 'transferencia', seller: 'Martín R.', status: 'completed' },
  { id: '5', number: '#1046', date: '08/04/2026', time: '15:10', customer: 'Laura Gómez', items: [{ name: 'Mouse Logitech MX Master 3', qty: 1, price: 68000 }], total: 64600, discount: 5, method: 'mercadopago', seller: 'Sofía R.', status: 'completed' },
  { id: '6', number: '#1045', date: '08/04/2026', time: '10:45', customer: 'Anónimo', items: [{ name: 'Auriculares Logitech H390', qty: 1, price: 22500 }], total: 22500, discount: 0, method: 'efectivo', seller: 'Martín R.', status: 'completed' },
  { id: '7', number: '#1044', date: '07/04/2026', time: '16:20', customer: 'Matías Ruiz', items: [{ name: 'Mouse Logitech G203', qty: 1, price: 25000 }], total: 25000, discount: 0, method: 'efectivo', seller: 'Sofía R.', status: 'completed' },
  { id: '8', number: '#1043', date: '07/04/2026', time: '14:00', customer: 'Daniela Sosa', items: [{ name: 'Intel i5-12400', qty: 1, price: 135000 }, { name: 'GPU AMD RX 580', qty: 1, price: 158000 }], total: 293000, discount: 0, method: 'transferencia', seller: 'Martín R.', status: 'completed' },
  { id: '9', number: '#1042', date: '06/04/2026', time: '11:30', customer: 'Anónimo', items: [{ name: 'RAM Kingston 8GB', qty: 3, price: 19500 }], total: 58500, discount: 0, method: 'efectivo', seller: 'Sofía R.', status: 'cancelled' },
];

const weeklyData = [
  { day: 'Lun', ventas: 185000 },
  { day: 'Mar', ventas: 234000 },
  { day: 'Mié', ventas: 198000 },
  { day: 'Jue', ventas: 312000 },
  { day: 'Vie', ventas: 428000 },
  { day: 'Sáb', ventas: 356000 },
  { day: 'Dom', ventas: 284750 },
];

const methodConfig = {
  efectivo: { label: 'Efectivo', icon: Banknote, class: 'badge badge-success' },
  transferencia: { label: 'Transferencia', icon: CreditCard, class: 'badge badge-primary' },
  mercadopago: { label: 'Mercado Pago', icon: Smartphone, class: 'badge badge-muted' },
};

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

interface SaleDetailProps {
  sale: Sale;
  onClose: () => void;
}

function SaleDetail({ sale, onClose }: SaleDetailProps) {
  const cfg = methodConfig[sale.method];
  const subtotal = sale.items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = Math.round(subtotal * (sale.discount / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">Venta {sale.number}</h2>
            <p className="text-xs text-muted-foreground">{sale.date} · {sale.time} · {sale.seller}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar detalle de venta" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="font-semibold text-foreground">{sale.customer}</p>
            </div>
            <span className={cfg.class}><cfg.icon size={11} className="inline mr-1" />{cfg.label}</span>
          </div>

          <div className="bg-muted/40 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Productos</p>
            {sale.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{item.name} <span className="text-muted-foreground">x{item.qty}</span></span>
                <span className="font-mono font-semibold">{formatCurrency(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-accent font-semibold">
                <span>Descuento {sale.discount}%</span>
                <span className="font-mono">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-foreground pt-2 border-t border-border">
              <span>Total</span>
              <span className="font-mono">{formatCurrency(sale.total)}</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-3 rounded-xl ${sale.status === 'completed' ? 'bg-success/5 border border-success/20' : 'bg-destructive/5 border border-destructive/20'}`}>
            <CheckCircle size={16} className={sale.status === 'completed' ? 'text-success' : 'text-destructive'} />
            <span className={`text-sm font-semibold ${sale.status === 'completed' ? 'text-success' : 'text-destructive'}`}>
              {sale.status === 'completed' ? 'Venta completada' : 'Venta cancelada'}
            </span>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button className="btn-secondary flex-1 text-sm">Imprimir ticket</button>
          <button onClick={onClose} className="btn-primary flex-1 text-sm">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export default function VentasPage() {
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'efectivo' | 'transferencia' | 'mercadopago'>('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filtered = mockSales.filter(s => {
    const matchSearch = s.customer.toLowerCase().includes(search.toLowerCase()) || s.number.includes(search);
    const matchMethod = selectedMethod === 'all' || s.method === selectedMethod;
    return matchSearch && matchMethod;
  });

  const totalToday = mockSales.filter(s => s.date === '09/04/2026' && s.status === 'completed').reduce((sum, s) => sum + s.total, 0);
  const totalWeek = mockSales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0);
  const avgTicket = Math.round(totalWeek / mockSales.filter(s => s.status === 'completed').length);

  return (
    <AppLayout>
      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-6 sm:px-6 lg:px-8 xl:px-10 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Historial de Ventas</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{mockSales.length} ventas registradas</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:flex">
            <button className="btn-secondary justify-center text-sm"><Calendar size={14} /> Filtrar fecha</button>
            <button className="btn-secondary justify-center text-sm"><Download size={14} /> Exportar</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Ventas hoy', value: formatCurrency(totalToday), sub: `${mockSales.filter(s => s.date === '09/04/2026').length} transacciones`, variant: 'success' },
            { label: 'Total semana', value: formatCurrency(totalWeek), sub: 'Últimos 7 días', variant: 'primary' },
            { label: 'Ticket promedio', value: formatCurrency(avgTicket), sub: 'Por transacción', variant: 'default' },
            { label: 'Canceladas', value: mockSales.filter(s => s.status === 'cancelled').length, sub: 'Esta semana', variant: 'warning' },
          ].map(stat => (
            <div key={stat.label} className={`kpi-card border ${stat.variant === 'success' ? 'bg-success/5 border-success/20' : stat.variant === 'primary' ? 'bg-primary/5 border-primary/20' : stat.variant === 'warning' ? 'bg-warning/5 border-warning/20' : 'bg-white border-border'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.variant === 'success' ? 'bg-success/10 text-success' : stat.variant === 'primary' ? 'bg-primary/10 text-primary' : stat.variant === 'warning' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                <ShoppingBag size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold font-mono text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-foreground text-sm">Ventas diarias — Semana actual</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Ingresos por día</p>
            </div>
            <TrendingUp size={16} className="text-success" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(209 76% 26%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(209 76% 26%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215 16% 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(215 16% 46%)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v), 'Ventas']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid hsl(214 20% 88%)' }} />
              <Area type="monotone" dataKey="ventas" stroke="hsl(209 76% 26%)" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative w-full flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por cliente o número..." className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[{ id: 'all', label: 'Todos' }, { id: 'efectivo', label: 'Efectivo' }, { id: 'transferencia', label: 'Transferencia' }, { id: 'mercadopago', label: 'Mercado Pago' }].map(f => (
              <button key={f.id} onClick={() => setSelectedMethod(f.id as 'all' | 'efectivo' | 'transferencia' | 'mercadopago')} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${selectedMethod === f.id ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted-foreground hover:bg-muted'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="hidden overflow-hidden rounded-xl border border-border bg-white md:block">
            <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">N°</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Productos</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Método</th>
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(sale => {
                const cfg = methodConfig[sale.method];
                return (
                  <tr key={sale.id} className="hover:bg-muted/20 transition-colors group cursor-pointer" onClick={() => setSelectedSale(sale)}>
                    <td className="px-4 py-3 font-mono text-sm font-bold text-primary">{sale.number}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sale.date}<br />{sale.time}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{sale.customer}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                      {sale.items.map(i => `${i.name} x${i.qty}`).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cfg.class}><cfg.icon size={10} className="inline mr-1" />{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{formatCurrency(sale.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={sale.status === 'completed' ? 'badge badge-success' : 'badge badge-destructive'}>
                        {sale.status === 'completed' ? 'Completada' : 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button aria-label={`Ver detalle de la venta ${sale.number}`} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground opacity-0 group-hover:opacity-100">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>

          <div className="grid gap-3 md:hidden">
            {filtered.map((sale) => {
              const cfg = methodConfig[sale.method]
              return (
                <button
                  key={sale.id}
                  onClick={() => setSelectedSale(sale)}
                  className="rounded-xl border border-border bg-white p-4 text-left shadow-sm transition hover:bg-muted/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-primary">{sale.number}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {sale.date} · {sale.time}
                      </p>
                    </div>
                    <span className={sale.status === 'completed' ? 'badge badge-success' : 'badge badge-destructive'}>
                      {sale.status === 'completed' ? 'Completada' : 'Cancelada'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Cliente</p>
                      <p className="font-medium text-foreground">{sale.customer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Productos</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.items.map((i) => `${i.name} x${i.qty}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
                    <span className={cfg.class}>
                      <cfg.icon size={10} className="mr-1 inline" />
                      {cfg.label}
                    </span>
                    <span className="font-mono text-base font-bold text-foreground">
                      {formatCurrency(sale.total)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {selectedSale && <SaleDetail sale={selectedSale} onClose={() => setSelectedSale(null)} />}
    </AppLayout>
  );
}
