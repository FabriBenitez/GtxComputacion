'use client'

import AppLayout from '@/components/AppLayout'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Search, ShoppingCart, User, Package2, Trash2, Minus, Plus, Percent } from 'lucide-react'
import { compactCurrency, currency, initialProducts, paymentMethods } from '@/mockData'

interface Product {
  id: number
  name: string
  category: string
  brand: string
  sku: string
  cost: number
  price: number
  stock: number
  reserved?: number
  soldMonthly?: number
  clicks: number
  reservations?: number
  lastSaleDays: number
  updatedAt?: string
  supplier?: string
  leadTimeDays?: number
  priceTrend?: string
  featured: string
  description: string
  specs: {
    [key: string]: string | undefined
  }
  variants: { label: string; stock: number }[]
  priceHistory: string[]
  bundle?: string[]
}

interface CartItem {
  id: number
  name: string
  sku: string
  stock: number
  qty: number
  unitPrice: number
}

const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20]

function stockBadge(product: Product) {
  if (product.stock <= 0) {
    return {
      label: 'Sin stock',
      className: 'bg-rose-100 text-rose-500',
    }
  }

  if (product.stock <= 3) {
    return {
      label: `${product.stock} restantes`,
      className: 'bg-amber-100 text-amber-700',
    }
  }

  return {
    label: `Stock: ${product.stock}`,
    className: 'bg-slate-100 text-slate-500',
  }
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [customer, setCustomer] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('Efectivo')
  const [discountRate, setDiscountRate] = useState(0)
  const [flashMessage, setFlashMessage] = useState('')

  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    if (!flashMessage) return undefined
    const timer = window.setTimeout(() => setFlashMessage(''), 2200)
    return () => window.clearTimeout(timer)
  }, [flashMessage])

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) => {
      const fullName = `${product.category} ${product.brand} ${product.name}`.toLowerCase()
      return fullName.includes(query) || product.sku.toLowerCase().includes(query)
    })
  }, [deferredSearch, products])

  const cartSubtotal = cart.reduce((acc, item) => acc + item.qty * item.unitPrice, 0)
  const discountValue = Math.round((cartSubtotal * discountRate) / 100)
  const cartTotal = cartSubtotal - discountValue

  function notify(message: string) {
    setFlashMessage(message)
  }

  function addToCart(product: Product) {
    if (product.stock <= 0) {
      notify(`No hay stock disponible para ${product.name}.`)
      return
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, qty: Math.min(item.qty + 1, item.stock) }
            : item,
        )
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          stock: product.stock,
          qty: 1,
          unitPrice: product.price,
        },
      ]
    })

    notify(`${product.name} agregado al carrito.`)
  }

  function updateQuantity(id: number, nextQty: number) {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, Math.min(nextQty, item.stock)) }
          : item,
      ),
    )
  }

  function removeFromCart(id: number) {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  function registerSale() {
    if (!cart.length) {
      notify('Agrega productos antes de confirmar la venta.')
      return
    }

    setProducts((current) =>
      current.map((product) => {
        const sold = cart.find((item) => item.id === product.id)
        if (!sold) return product

        return {
          ...product,
          stock: Math.max(product.stock - sold.qty, 0),
          soldMonthly: (product.soldMonthly ?? 0) + sold.qty,
          lastSaleDays: 0,
        }
      }),
    )

    setCart([])
    setDiscountRate(0)
    setCustomer('')
    notify(`Venta confirmada por ${currency.format(cartTotal)}.`)
  }

  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
        <div className="grid h-full grid-cols-1 xl:grid-cols-[1.7fr_0.95fr]">
          <section className="flex min-h-0 flex-col border-r border-slate-200 bg-slate-50">
            <div className="border-b border-slate-200 bg-white px-5 py-4">
              <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] text-slate-900">
                Punto de Venta
              </h1>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar producto por nombre o SKU..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const badge = stockBadge(product)

                  return (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="rounded-[18px] border border-slate-200 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                          <Package2 className="h-5 w-5" />
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h2 className="line-clamp-2 text-[1.05rem] font-extrabold leading-5 tracking-[-0.02em] text-slate-900">
                          {product.name}
                        </h2>
                        <p className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-400">
                          {product.sku}
                        </p>
                      </div>

                      <p className="mt-4 text-[1.75rem] font-black tracking-[-0.04em] text-[#0f4c81]">
                        {compactCurrency.format(product.price)}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="flex min-h-0 flex-col bg-white">
            <div className="border-b border-slate-200 px-4 py-4">
              <div className="flex items-center gap-2 text-[1.75rem] font-extrabold tracking-[-0.03em] text-slate-900">
                <ShoppingCart className="h-6 w-6 text-[#0f4c81]" />
                <span>Carrito</span>
              </div>

              <div className="relative mt-4">
                <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  placeholder="Cliente (opcional)"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {cart.length ? (
                <div className="space-y-3 px-4 py-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-slate-400">
                            {item.sku}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-rose-500"
                          aria-label={`Quitar ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.qty - 1)}
                            className="px-3 py-2 text-slate-500 transition hover:text-slate-900"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.qty + 1)}
                            className="px-3 py-2 text-slate-500 transition hover:text-slate-900"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-slate-400">
                            {currency.format(item.unitPrice)} c/u
                          </p>
                          <p className="text-lg font-extrabold tracking-[-0.02em] text-[#0f4c81]">
                            {currency.format(item.unitPrice * item.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <p className="mt-5 text-[1.7rem] font-medium tracking-[-0.03em] text-slate-500">
                    El carrito está vacío
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Seleccioná productos de la izquierda
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-4 py-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Percent className="h-4 w-4" />
                <span>Descuento</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {DISCOUNT_OPTIONS.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setDiscountRate(rate)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-bold transition ${
                      discountRate === rate
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{currency.format(cartSubtotal)}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[2rem] font-extrabold tracking-[-0.04em] text-slate-900">
                  Total
                </span>
                <span className="text-[2rem] font-black tracking-[-0.04em] text-slate-900">
                  {currency.format(cartTotal)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-2xl border px-3 py-4 text-center text-sm font-bold transition ${
                      paymentMethod === method
                        ? 'border-[#5c84ad] bg-[#eff5fb] text-[#0f4c81]'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <button
                onClick={registerSale}
                className="mt-4 h-12 w-full rounded-2xl bg-slate-200 text-sm font-extrabold text-slate-600 transition hover:bg-slate-300"
              >
                Confirmar venta · {currency.format(cartTotal)}
              </button>

              {flashMessage ? (
                <p className="mt-3 text-center text-xs font-medium text-slate-500">{flashMessage}</p>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
