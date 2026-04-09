import { useEffect, useState } from 'react'
import { brands, categories, initialCustomers, initialProducts, paymentMethods } from './mockData'
import logo from '../logo.jpg' // Asegúrate que en el disco se llame igual

const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

const sections = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'productos', label: 'Productos' },
  { id: 'alta', label: 'Alta rapida' },
  { id: 'pos', label: 'POS' },
  { id: 'catalogo', label: 'Catalogo' },
]

const emptyForm = {
  name: '',
  category: 'Notebooks',
  brand: 'Lenovo',
  sku: '',
  cost: 0,
  margin: 28,
  stock: 1,
  description: '',
  processor: '',
  ram: '',
  capacity: '',
  connectivity: '',
}

function buildWhatsappUrl(number, product, mode = 'consultar') {
  const greeting =
    mode === 'reservar'
      ? 'Hola! Quiero reservar este producto:'
      : 'Hola! Estoy interesado en este producto:'

  const text = `${greeting}

${product.name}
Precio: ${currency.format(product.price)}
SKU: ${product.sku}

${mode === 'reservar' ? 'Podemos apartarlo?' : 'Lo tenes disponible?'}`.trim()

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

function SectionHeader({ tag, title, text, children }) {
  return (
    <div className="section-header">
      <div>
        <span className="section-tag">{tag}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {children}
    </div>
  )
}

function MetricCard({ label, value, note, tone = '' }) {
  return (
    <article className={`kpi-card ${tone}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}

function ListCard({ title, subtitle, items, renderRight }) {
  return (
    <article className="glass-panel list-card">
      <div className="card-title">
        <h3>{title}</h3>
        <span>{subtitle}</span>
      </div>
      <div className="stack">
        {items.map((item) => (
          <div className="metric-row" key={item.id ?? item.name}>
            <div>
              <strong>{item.name}</strong>
              <span>{item.note}</span>
            </div>
            {renderRight(item)}
          </div>
        ))}
      </div>
    </article>
  )
}

function ProductCard({ product, onAddToCart, onWhatsapp, whatsappNumber }) {
  const margin = Math.round(((product.price - product.cost) / product.cost) * 100)

  return (
    <article className="glass-panel product-card">
      <div className="product-top">
        <span className="badge">{product.featured}</span>
        <span className={product.stock <= 3 ? 'stock low' : 'stock'}>
          {product.stock <= 3 ? 'Ultimas unidades' : `${product.stock} unidades`}
        </span>
      </div>

      <div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>

      <div className="chip-row">
        <span>{product.brand}</span>
        <span>{product.category}</span>
        <span>{product.sku}</span>
      </div>

      <div className="price-row">
        <div>
          <small>Venta</small>
          <strong>{currency.format(product.price)}</strong>
        </div>
        <div>
          <small>Costo</small>
          <span>{currency.format(product.cost)}</span>
        </div>
        <div>
          <small>Margen</small>
          <span>{margin}%</span>
        </div>
      </div>

      <div className="spec-grid">
        {Object.entries(product.specs)
          .slice(0, 4)
          .map(([label, value]) => (
            <div className="spec-chip" key={label}>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          ))}
      </div>

      <div className="variant-list">
        {product.variants.map((variant) => (
          <div className="variant-row" key={variant.label}>
            <span>{variant.label}</span>
            <strong>{variant.stock}u</strong>
          </div>
        ))}
      </div>

      <div className="history-row">
        <span>Historial: {product.priceHistory.join(' / ')}</span>
        <strong>{product.clicks} clics</strong>
      </div>

      <div className="button-row">
        <button className="secondary-button" onClick={() => onAddToCart(product)}>
          Agregar al POS
        </button>
        <a
          className="link-button"
          href={buildWhatsappUrl(whatsappNumber, product, 'consultar')}
          target="_blank"
          rel="noreferrer"
          onClick={() => onWhatsapp(product.id)}
        >
          Consultar
        </a>
        <a
          className="link-button reserve"
          href={buildWhatsappUrl(whatsappNumber, product, 'reservar')}
          target="_blank"
          rel="noreferrer"
          onClick={() => onWhatsapp(product.id)}
        >
          Reservar
        </a>
      </div>
    </article>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts)
  const [customers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('Todos')
  const [catalogBrand, setCatalogBrand] = useState('Todas')
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('Transferencia')
  const [discountRate, setDiscountRate] = useState(0)
  const [flashMessage, setFlashMessage] = useState('')
  const [config, setConfig] = useState({
    whatsappNumber: '5491155551234',
    autoMessage: 'Hola! Te ayudo con stock, precios y medios de pago.',
  })
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!flashMessage) return undefined
    const timer = window.setTimeout(() => setFlashMessage(''), 2200)
    return () => window.clearTimeout(timer)
  }, [flashMessage])

  const filteredProducts = products.filter((product) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q)
    )
  })

  const catalogProducts = products.filter((product) => {
    const q = catalogSearch.trim().toLowerCase()
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.brand.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q)
    const matchesCategory =
      catalogCategory === 'Todos' || product.category === catalogCategory
    const matchesBrand = catalogBrand === 'Todas' || product.brand === catalogBrand
    return matchesSearch && matchesCategory && matchesBrand
  })

  const totalStock = products.reduce((acc, product) => acc + product.stock, 0)
  const inventoryValue = products.reduce((acc, product) => acc + product.cost * product.stock, 0)
  const monthlyRevenue = products.reduce((acc, product) => acc + product.price * product.soldMonthly, 0)
  const totalClicks = products.reduce((acc, product) => acc + product.clicks, 0)
  const averageMargin =
    Math.round(
      (products.reduce((acc, product) => acc + ((product.price - product.cost) / product.cost) * 100, 0) /
        products.length) *
        10,
    ) / 10

  const topProducts = [...products]
    .sort((a, b) => b.soldMonthly - a.soldMonthly)
    .slice(0, 4)
    .map((product) => ({ ...product, note: `${product.soldMonthly} ventas este mes` }))

  const lowStock = products
    .filter((product) => product.stock <= 3)
    .map((product) => ({ ...product, note: product.category }))

  const stagnant = products
    .filter((product) => product.lastSaleDays >= 40)
    .map((product) => ({ ...product, note: `Sin venta hace ${product.lastSaleDays} dias` }))

  const clients = customers.map((customer) => ({
    ...customer,
    note: customer.notes,
  }))

  const cartSubtotal = cart.reduce((acc, item) => acc + item.qty * item.unitPrice, 0)
  const discountValue = Math.round((cartSubtotal * discountRate) / 100)
  const cartTotal = cartSubtotal - discountValue
  const suggestedPrice = Math.round(Number(form.cost || 0) * (1 + Number(form.margin || 0) / 100))

  function jumpTo(sectionId) {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function notify(message) {
    setFlashMessage(message)
  }

  function addToCart(product) {
    if (product.stock <= 0) return

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: Math.min(item.qty + 1, item.stock) } : item,
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

    notify(`${product.name} agregado al POS.`)
  }

  function updateCartItem(id, field, value) {
    setCart((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        if (field === 'qty') return { ...item, qty: Math.max(1, Math.min(Number(value), item.stock)) }
        return { ...item, unitPrice: Math.max(0, Number(value)) }
      }),
    )
  }

  function removeFromCart(id) {
    setCart((current) => current.filter((item) => item.id !== id))
  }

  function registerSale() {
    if (!cart.length) {
      notify('Primero agrega productos al carrito.')
      return
    }

    setProducts((current) =>
      current.map((product) => {
        const sold = cart.find((item) => item.id === product.id)
        if (!sold) return product
        return {
          ...product,
          stock: Math.max(product.stock - sold.qty, 0),
          soldMonthly: product.soldMonthly + sold.qty,
          lastSaleDays: 0,
        }
      }),
    )
    setCart([])
    setDiscountRate(0)
    notify(`Venta registrada por ${currency.format(cartTotal)} via ${paymentMethod}.`)
  }

  function trackWhatsapp(productId) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, clicks: product.clicks + 1 } : product,
      ),
    )
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function createProduct(event) {
    event.preventDefault()

    const newProduct = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      brand: form.brand,
      sku: form.sku || `SKU-${Date.now().toString().slice(-5)}`,
      cost: Number(form.cost),
      price: suggestedPrice,
      stock: Number(form.stock),
      soldMonthly: 0,
      lastSaleDays: 90,
      clicks: 0,
      featured: 'Nuevo ingreso',
      description: form.description || 'Producto recien incorporado al catalogo.',
      specs: {
        Procesador: form.processor || 'A definir',
        RAM: form.ram || 'A definir',
        Capacidad: form.capacity || 'A definir',
        Conectividad: form.connectivity || 'A definir',
      },
      variants: [{ label: 'Version base', stock: Number(form.stock) }],
      priceHistory: [currency.format(Number(form.cost)).replace('$', '').trim(), currency.format(suggestedPrice).replace('$', '').trim()],
    }

    setProducts((current) => [newProduct, ...current])
    setForm(emptyForm)
    notify(`Producto creado: ${newProduct.name}.`)
    jumpTo('productos')
  }

  return (
    <div className="app-shell">
      <div className="background glow-a" />
      <div className="background glow-b" />

      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Prototipo React + Vite para tienda tech</span>
          <h1>Rapido, simple y orientado a conversion.</h1>
          <p>
            Pensado para alto volumen de consultas por WhatsApp, mucho SKU y precios que cambian
            seguido. La demo pone todo eso al frente.
          </p>
          <div className="button-row">
            <button className="primary-button" onClick={() => jumpTo('catalogo')}>
              Ver catalogo mobile
            </button>
            <button className="ghost-button" onClick={() => jumpTo('pos')}>
              Ir al POS
            </button>
          </div>
          <div className="hero-stats">
            <MetricCard label="SKUs activos" value={products.length} note="Catalogo listo para mostrar" />
            <MetricCard label="Facturacion mes" value={currency.format(monthlyRevenue)} note="Estimado segun rotacion" tone="accent" />
            <MetricCard label="Consultas" value={totalClicks} note="Clics hacia WhatsApp" />
          </div>
        </div>

        <div className="glass-panel hero-side">
          <img src={logo} alt="GTX Computacion" className="hero-logo" />
          <div className="hero-box">
            <span>Canal core</span>
            <strong>Catalogo + WhatsApp + venta rapida</strong>
          </div>
          <div className="mini-grid">
            <div>
              <span>Numero</span>
              <strong>+54 9 11 5555-1234</strong>
            </div>
            <div>
              <span>Margen promedio</span>
              <strong>{averageMargin}%</strong>
            </div>
            <div>
              <span>Reposicion</span>
              <strong>{lowStock.length} alertas</strong>
            </div>
            <div>
              <span>Inventario</span>
              <strong>{currency.format(inventoryValue)}</strong>
            </div>
          </div>
        </div>
      </header>

      <nav className="glass-panel sticky-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={activeSection === section.id ? 'nav-pill active' : 'nav-pill'}
            onClick={() => jumpTo(section.id)}
          >
            {section.label}
          </button>
        ))}
      </nav>

      {flashMessage ? <div className="flash-message">{flashMessage}</div> : null}

      <main className="main-grid">
        <section id="dashboard" className="panel-section">
          <SectionHeader
            tag="Dashboard"
            title="KPIs grandes, lectura inmediata."
            text="Sin menu complejo ni reportes densos: ventas, stock, reposicion y clientes frecuentes."
          />

          <div className="kpi-grid">
            <MetricCard label="Ventas del dia" value={18 + cart.length} note="Mostrador y ventas rapidas" />
            <MetricCard label="Stock total" value={totalStock} note="Unidades listas para vender" tone="warning" />
            <MetricCard label="Mas vendidos" value={topProducts.length} note="Para reponer primero" />
            <MetricCard label="Sin rotacion" value={stagnant.length} note="Candidatos a liquidacion" />
          </div>

          <div className="dashboard-grid">
            <ListCard
              title="Mas vendidos"
              subtitle="Sugerencia de reposicion"
              items={topProducts}
              renderRight={(item) => <mark>{item.stock} en stock</mark>}
            />
            <ListCard
              title="Stock bajo"
              subtitle="Critico para tecnologia"
              items={lowStock}
              renderRight={(item) => <mark className="danger-mark">{item.stock} unidades</mark>}
            />
            <ListCard
              title="Sin rotacion"
              subtitle="Oportunidad comercial"
              items={stagnant}
              renderRight={(item) => <mark className="neutral-mark">Liquidar</mark>}
            />
            <ListCard
              title="Clientes frecuentes"
              subtitle="Recontacto por WhatsApp"
              items={clients}
              renderRight={(item) => <mark>{item.purchases} compras</mark>}
            />
          </div>
        </section>

        <section id="productos" className="panel-section">
          <SectionHeader
            tag="Gestion de productos"
            title="SKU, precios, stock y ficha tecnica en una sola vista."
            text="Carga visual rapida para notebooks, componentes, perifericos, audio, redes y streaming."
          >
            <label className="search-box">
              <span>Buscar por nombre, marca o SKU</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ej: Lenovo / G203 / SSD"
              />
            </label>
          </SectionHeader>

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onWhatsapp={trackWhatsapp}
                whatsappNumber={config.whatsappNumber}
              />
            ))}
          </div>
        </section>

        <section id="alta" className="panel-section">
          <SectionHeader
            tag="Alta de producto"
            title="Carga simple con precio sugerido y specs comerciales."
            text="Pensado para que el dueño pueda publicar rapido y sin perder los datos tecnicos que ayudan a vender."
          />

          <div className="split-grid">
            <form className="glass-panel form-card" onSubmit={createProduct}>
              <div className="field-grid">
                <label>
                  Nombre
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateForm('name', event.target.value)}
                    placeholder="Ej: RTX 4060 Asus Dual"
                  />
                </label>
                <label>
                  SKU interno
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) => updateForm('sku', event.target.value)}
                    placeholder="SKU-INT-001"
                  />
                </label>
                <label>
                  Categoria
                  <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                    {categories.filter((item) => item !== 'Todos').map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Marca
                  <select value={form.brand} onChange={(event) => updateForm('brand', event.target.value)}>
                    {brands.filter((item) => item !== 'Todas').map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Precio de costo
                  <input
                    type="number"
                    min="0"
                    value={form.cost}
                    onChange={(event) => updateForm('cost', event.target.value)}
                  />
                </label>
                <label>
                  Margen objetivo %
                  <input
                    type="number"
                    min="0"
                    value={form.margin}
                    onChange={(event) => updateForm('margin', event.target.value)}
                  />
                </label>
                <label>
                  Stock inicial
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) => updateForm('stock', event.target.value)}
                  />
                </label>
                <label>
                  Descripcion comercial
                  <input
                    type="text"
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="Mensaje corto de venta"
                  />
                </label>
                <label>
                  Procesador
                  <input
                    type="text"
                    value={form.processor}
                    onChange={(event) => updateForm('processor', event.target.value)}
                    placeholder="Ryzen 7 / i5 / n-a"
                  />
                </label>
                <label>
                  RAM
                  <input
                    type="text"
                    value={form.ram}
                    onChange={(event) => updateForm('ram', event.target.value)}
                    placeholder="16GB DDR5"
                  />
                </label>
                <label>
                  Capacidad
                  <input
                    type="text"
                    value={form.capacity}
                    onChange={(event) => updateForm('capacity', event.target.value)}
                    placeholder="SSD 1TB"
                  />
                </label>
                <label>
                  Conectividad
                  <input
                    type="text"
                    value={form.connectivity}
                    onChange={(event) => updateForm('connectivity', event.target.value)}
                    placeholder="Wi-Fi 6 / BT / USB-C"
                  />
                </label>
              </div>
              <div className="button-row">
                <button type="submit" className="primary-button">
                  Crear producto
                </button>
                <button type="button" className="ghost-button" onClick={() => setForm(emptyForm)}>
                  Limpiar
                </button>
              </div>
            </form>

            <article className="glass-panel preview-card">
              <span className="section-tag">Preview comercial</span>
              <h3>{form.name || 'Producto listo para publicar'}</h3>
              <p>{form.description || 'Vista previa pensada para el catalogo y para el mostrador.'}</p>
              <div className="price-preview">
                <div>
                  <span>Precio sugerido</span>
                  <strong>{currency.format(suggestedPrice)}</strong>
                </div>
                <div>
                  <span>Stock inicial</span>
                  <strong>{form.stock}</strong>
                </div>
              </div>
              <div className="spec-grid">
                <div className="spec-chip">
                  <small>Procesador</small>
                  <strong>{form.processor || 'Pendiente'}</strong>
                </div>
                <div className="spec-chip">
                  <small>RAM</small>
                  <strong>{form.ram || 'Pendiente'}</strong>
                </div>
                <div className="spec-chip">
                  <small>Capacidad</small>
                  <strong>{form.capacity || 'Pendiente'}</strong>
                </div>
                <div className="spec-chip">
                  <small>Conectividad</small>
                  <strong>{form.connectivity || 'Pendiente'}</strong>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section id="pos" className="panel-section">
          <SectionHeader
            tag="Venta rapida"
            title="POS simple con precio editable y descuento inmediato."
            text="Ideal para mostrador: buscar, agregar, negociar precio y cerrar en segundos."
          />

          <div className="split-grid">
            <article className="glass-panel list-card">
              <div className="card-title">
                <h3>Busqueda rapida</h3>
                <span>Nombre o SKU</span>
              </div>
              <div className="stack">
                {filteredProducts.slice(0, 6).map((product) => (
                  <button key={product.id} className="pos-item" onClick={() => addToCart(product)}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.sku}</span>
                    </div>
                    <mark>{currency.format(product.price)}</mark>
                  </button>
                ))}
              </div>
            </article>

            <article className="glass-panel form-card">
              <div className="card-title">
                <h3>Carrito</h3>
                <span>{cart.length} items</span>
              </div>

              <div className="stack">
                {cart.length ? (
                  cart.map((item) => (
                    <div className="cart-line" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.sku}</span>
                      </div>
                      <div className="cart-controls">
                        <label>
                          Cant.
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.qty}
                            onChange={(event) => updateCartItem(item.id, 'qty', event.target.value)}
                          />
                        </label>
                        <label>
                          Precio
                          <input
                            type="number"
                            min="0"
                            value={item.unitPrice}
                            onChange={(event) => updateCartItem(item.id, 'unitPrice', event.target.value)}
                          />
                        </label>
                        <button className="icon-button" onClick={() => removeFromCart(item.id)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">Todavia no agregaste productos al carrito.</div>
                )}
              </div>

              <div className="checkout-box">
                <div className="discount-group">
                  {[0, 5, 10, 15].map((rate) => (
                    <button
                      key={rate}
                      className={discountRate === rate ? 'pill active' : 'pill'}
                      onClick={() => setDiscountRate(rate)}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <div className="discount-group">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      className={paymentMethod === method ? 'pill active' : 'pill'}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <div className="totals-box">
                  <div>
                    <span>Subtotal</span>
                    <strong>{currency.format(cartSubtotal)}</strong>
                  </div>
                  <div>
                    <span>Descuento</span>
                    <strong>{currency.format(discountValue)}</strong>
                  </div>
                  <div className="grand">
                    <span>Total</span>
                    <strong>{currency.format(cartTotal)}</strong>
                  </div>
                </div>
                <button className="primary-button full-width" onClick={registerSale}>
                  Registrar venta
                </button>
              </div>
            </article>
          </div>
        </section>

        <section id="catalogo" className="panel-section">
          <SectionHeader
            tag="Catalogo online"
            title="Vitrina mobile-first conectada a WhatsApp."
            text="No busca ser un e-commerce pesado. Busca mostrar, comparar y disparar la consulta correcta."
          />

          <div className="split-grid catalog-grid">
            <article className="glass-panel form-card">
              <h3>Lo que vende el sistema</h3>
              <ul className="bullet-list">
                <li>Catalogo + WhatsApp integrado en cada producto.</li>
                <li>Ficha tecnica clara para productos tecnologicos.</li>
                <li>Precios dinamicos con historial visible.</li>
                <li>Vista pensada para mostrar desde el celular.</li>
              </ul>

              <div className="settings-box">
                <label>
                  Numero de WhatsApp
                  <input
                    type="text"
                    value={config.whatsappNumber}
                    onChange={(event) =>
                      setConfig((current) => ({
                        ...current,
                        whatsappNumber: event.target.value.replace(/\D/g, ''),
                      }))
                    }
                  />
                </label>
                <label>
                  Mensaje automatico
                  <input
                    type="text"
                    value={config.autoMessage}
                    onChange={(event) =>
                      setConfig((current) => ({
                        ...current,
                        autoMessage: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </article>

            <article className="phone-shell">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="mobile-header">
                  <img src={logo} alt="GTX logo" />
                  <div>
                    <strong>GTX Store</strong>
                    <span>{config.autoMessage}</span>
                  </div>
                </div>

                <label className="search-box mobile-search">
                  <input
                    type="search"
                    value={catalogSearch}
                    onChange={(event) => setCatalogSearch(event.target.value)}
                    placeholder="Buscar notebook, mouse, SSD..."
                  />
                </label>

                <div className="mobile-filters">
                  <select value={catalogCategory} onChange={(event) => setCatalogCategory(event.target.value)}>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select value={catalogBrand} onChange={(event) => setCatalogBrand(event.target.value)}>
                    {brands.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="stack">
                  {catalogProducts.slice(0, 6).map((product) => (
                    <div className="mobile-product" key={product.id}>
                      <div className="product-top">
                        <span className="badge">{product.featured}</span>
                        <strong>{product.clicks} clics</strong>
                      </div>
                      <h4>{product.name}</h4>
                      <p>{product.brand}</p>
                      <strong className="mobile-price">{currency.format(product.price)}</strong>
                      <div className="mobile-specs">
                        {Object.entries(product.specs)
                          .slice(0, 3)
                          .map(([label, value]) => (
                            <span key={label}>
                              {label}: {value}
                            </span>
                          ))}
                      </div>
                      <div className="button-row">
                        <a
                          className="link-button"
                          href={buildWhatsappUrl(config.whatsappNumber, product, 'consultar')}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackWhatsapp(product.id)}
                        >
                          Consultar
                        </a>
                        <a
                          className="link-button reserve"
                          href={buildWhatsappUrl(config.whatsappNumber, product, 'reservar')}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => trackWhatsapp(product.id)}
                        >
                          Reservar
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
