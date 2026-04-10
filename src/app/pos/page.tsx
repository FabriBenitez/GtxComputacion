'use client'

import AppLayout from '@/components/AppLayout'
import { useState, useEffect, useDeferredValue } from 'react'

// Importar componentes auxiliares
import SectionHeading from '@/components/SectionHeading' // Asumiendo que lo moviste a src/components
import BoardCard from './BoardCard'
import CartLine from './CartLine'

// Importar datos y utilidades (ajusta la ruta si es diferente)
import { initialProducts, paymentMethods, currency, compactCurrency } from '@/mockData'

// Definir interfaces para productos y elementos del carrito
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
    [key: string]: string | undefined // Permitir que los valores de specs sean string o undefined
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

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState('Transferencia')
  const [discountRate, setDiscountRate] = useState(0)
  const [flashMessage, setFlashMessage] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<number>(initialProducts[0]?.id || 0) // Asumiendo que initialProducts no está vacío

  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    if (!flashMessage) return undefined
    const timer = window.setTimeout(() => setFlashMessage(''), 2200)
    return () => window.clearTimeout(timer)
  }, [flashMessage])

  const filteredProducts = products.filter((product) => {
    const query = deferredSearch.trim().toLowerCase()
    if (!query) return true
    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    )
  })

  // focusProduct es necesario para el "Combo sugerido" y "Objetivo de cierre"
  const focusProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0]

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

    notify(`${product.name} agregado al escritorio de venta.`)
  }

  function updateCartItem(id: number, field: string, value: string | number) {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        if (field === 'qty') {
          return { ...item, qty: Math.max(1, Math.min(Number(value), item.stock)) }
        }
        return { ...item, unitPrice: Math.max(0, Number(value)) }
      }),
    )
  }

  function removeFromCart(id: number) {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  function registerSale() {
    if (!cart.length) {
      notify('Agrega productos antes de cerrar la venta.')
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
    notify(`Venta cerrada por ${currency.format(cartTotal)} via ${paymentMethod}.`)
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-screen-2xl space-y-6 px-6 py-6 lg:px-8 xl:px-10">
        <SectionHeading
          tag="Negotiation desk"
          title="Venta rapida, editable y lista para cerrar sin friccion."
          text="Pensado para mostrador argentino: precio editable, descuento controlado y metodos de pago visibles."
        />

        <div className="pos-grid grid grid-cols-1 gap-5 md:grid-cols-2">
          <BoardCard title="Quick add" subtitle="Lo que mas rota hoy">
            <div className="stack-gap space-y-2">
              {filteredProducts.slice(0, 5).map((product) => (
                <button key={product.id} className="queue-item flex w-full items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted" onClick={() => addToCart(product)}>
                  <div>
                    <strong className="text-foreground">{product.name}</strong>
                    <span className="block text-xs text-muted-foreground">{product.sku}</span>
                  </div>
                  <div className="queue-side flex items-center gap-2">
                    <mark className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{currency.format(product.price)}</mark>
                    <small className="text-xs text-muted-foreground">{product.stock}u</small>
                  </div>
                </button>
              ))}
            </div>
            <div className="negotiation-notes mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Combo sugerido</span>
                <strong className="text-foreground">{focusProduct?.bundle?.join(' + ') || 'N/A'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objetivo de cierre</span>
                <strong className="text-foreground">{currency.format((focusProduct?.price || 0) * 1.08)}</strong>
              </div>
            </div>
          </BoardCard>

          <BoardCard title="Live cart" subtitle="Negociar sin perder control del margen" tone="accent-panel">
            <div className="stack-gap space-y-2">
              {cart.length ? (
                cart.map((item) => (
                  <CartLine key={item.id} item={item} onChange={updateCartItem} onRemove={removeFromCart} />
                ))
              ) : (
                <div className="empty-card text-center text-muted-foreground py-8">Todavia no agregaste productos al escritorio de venta.</div>
              )}
            </div>

            <div className="pill-row mt-4 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  className={`pill rounded-full px-3 py-1 text-xs font-semibold transition-colors ${paymentMethod === method ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>

            <div className="pill-row mt-2 flex flex-wrap gap-2">
              {[0, 5, 10, 15].map((rate) => (
                <button
                  key={rate}
                  className={`pill rounded-full px-3 py-1 text-xs font-semibold transition-colors ${discountRate === rate ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  onClick={() => setDiscountRate(rate)}
                >
                  Descuento {rate}%
                </button>
              ))}
            </div>

            <div className="totals-grid mt-6 space-y-2 border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <strong className="text-foreground">{currency.format(cartSubtotal)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descuento</span>
                <strong className="text-destructive">{currency.format(discountValue)}</strong>
              </div>
              <div className="grand-total flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <strong className="text-primary">{currency.format(cartTotal)}</strong>
              </div>
            </div>

            <button className="primary-button full-width mt-6 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90" onClick={registerSale}>
              Registrar venta
            </button>
          </BoardCard>
        </div>
      </div>
    </AppLayout>
  )
}