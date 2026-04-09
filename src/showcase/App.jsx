import { useDeferredValue, useEffect, useState } from 'react'
import logo from '../../logo.jpg'
import {
  brands,
  categories,
  compactCurrency,
  currency,
  initialCustomers,
  initialProducts,
  moduleHighlights,
  paymentMethods,
  pricingAlerts,
  quickReplies,
  sections,
  whatsappQueue,
} from './data'
import {
  BoardCard,
  CartLine,
  FocusPanel,
  PhoneProduct,
  ProductTile,
  QueueItem,
  SectionHeading,
  StatCard,
} from './components'

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

function App() {
  const [activeSection, setActiveSection] = useState('control')
  const [products, setProducts] = useState(initialProducts)
  const [customers] = useState(initialCustomers)
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id)
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
    autoMessage: 'Stock real, precio al momento y reserva en un solo chat.',
  })
  const [form, setForm] = useState(emptyForm)

  const deferredSearch = useDeferredValue(search)
  const deferredCatalogSearch = useDeferredValue(catalogSearch)

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

  const catalogProducts = products.filter((product) => {
    const query = deferredCatalogSearch.trim().toLowerCase()
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    const matchesCategory =
      catalogCategory === 'Todos' || product.category === catalogCategory
    const matchesBrand = catalogBrand === 'Todas' || product.brand === catalogBrand
    return matchesSearch && matchesCategory && matchesBrand
  })

  const focusProduct =
    products.find((product) => product.id === selectedProductId) ?? products[0]

  const monthlyRevenue = products.reduce((acc, product) => acc + product.price * product.soldMonthly, 0)
  const monthlyCost = products.reduce((acc, product) => acc + product.cost * product.soldMonthly, 0)
  const grossProfit = monthlyRevenue - monthlyCost
  const inventoryValue = products.reduce((acc, product) => acc + product.cost * product.stock, 0)
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0)
  const totalClicks = products.reduce((acc, product) => acc + product.clicks, 0)
  const totalReservations = products.reduce((acc, product) => acc + product.reservations, 0)
  const averageReplyMinutes =
    Math.round(
      whatsappQueue.reduce((acc, item) => acc + item.waitMinutes, 0) / whatsappQueue.length,
    ) || 0

  const marginAtRisk = products
    .filter((product) => ((product.price - product.cost) / product.price) * 100 < 24)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3)

  const restockPriority = [...products]
    .sort(
      (a, b) =>
        b.soldMonthly + b.reservations * 2 - b.stock * 4 - b.leadTimeDays -
        (a.soldMonthly + a.reservations * 2 - a.stock * 4 - a.leadTimeDays),
    )
    .slice(0, 4)

  const vipCustomers = [...customers].sort((a, b) => b.lifetimeValue - a.lifetimeValue)

  const queueWithProduct = whatsappQueue.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId),
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

  function trackWhatsapp(productId) {
    setProducts((current) =>
      current.map((product) =>
        product.id === productId ? { ...product, clicks: product.clicks + 1 } : product,
      ),
    )
    notify('Accion enviada a WhatsApp.')
  }

  function addToCart(product) {
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

  function updateCartItem(id, field, value) {
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

  function removeFromCart(id) {
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
          soldMonthly: product.soldMonthly + sold.qty,
          lastSaleDays: 0,
        }
      }),
    )
    setCart([])
    setDiscountRate(0)
    notify(`Venta cerrada por ${currency.format(cartTotal)} via ${paymentMethod}.`)
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
      reserved: 0,
      soldMonthly: 0,
      clicks: 0,
      reservations: 0,
      lastSaleDays: 90,
      updatedAt: 'Ahora',
      supplier: 'Nuevo proveedor',
      leadTimeDays: 5,
      priceTrend: 'flat',
      featured: 'Nuevo lanzamiento',
      description: form.description || 'Producto listo para publicar y vender por WhatsApp.',
      specs: {
        Procesador: form.processor || 'A definir',
        RAM: form.ram || 'A definir',
        Capacidad: form.capacity || 'A definir',
        Conectividad: form.connectivity || 'A definir',
      },
      variants: [{ label: 'Version base', stock: Number(form.stock) }],
      priceHistory: [Number(form.cost), suggestedPrice],
      bundle: ['Accesorio sugerido', 'Instalacion express'],
    }

    setProducts((current) => [newProduct, ...current])
    setSelectedProductId(newProduct.id)
    setForm(emptyForm)
    notify(`Nuevo SKU listo: ${newProduct.name}.`)
  }

  return (
    <div className="showcase-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid-noise" />

      <header className="hero-wrap">
        <div className="hero-copy">
          <span className="eyebrow">GTX Commerce OS</span>
          <h1>Un sistema para vender tecnologia como un negocio serio, rapido y moderno.</h1>
          <p>
            No es solo stock ni un catalogo lindo. Es una operacion comercial pensada para mucho SKU,
            precios vivos, consultas por WhatsApp y cierre rapido desde mostrador o celular.
          </p>

          <div className="hero-actions">
            <button className="primary-button" onClick={() => jumpTo('control')}>
              Entrar al control room
            </button>
            <button className="ghost-button" onClick={() => jumpTo('catalog')}>
              Mostrar storefront mobile
            </button>
          </div>

          <div className="hero-metrics">
            <StatCard label="Facturacion potencial" value={compactCurrency.format(monthlyRevenue)} note="Basada en la rotacion actual" tone="accent" />
            <StatCard label="Margen bruto" value={compactCurrency.format(grossProfit)} note="Protegido con pricing pulse" />
            <StatCard label="Consultas a WhatsApp" value={totalClicks} note="Con tracking por SKU y reserva" />
          </div>
        </div>

        <aside className="panel hero-side">
          <div className="hero-side-top">
            <img src={logo} alt="GTX Computacion" className="hero-logo" />
            <div className="hero-side-copy">
              <span>Producto premium</span>
              <strong>Listo para una demo que se siente cara.</strong>
              <p>Visual fuerte, argumentos comerciales claros y operacion real en pantalla.</p>
            </div>
          </div>

          <div className="hero-premium-grid">
            <div>
              <span>WhatsApp SLA</span>
              <strong>{averageReplyMinutes} min</strong>
            </div>
            <div>
              <span>Reservas activas</span>
              <strong>{totalReservations}</strong>
            </div>
            <div>
              <span>Inventario vivo</span>
              <strong>{compactCurrency.format(inventoryValue)}</strong>
            </div>
            <div>
              <span>SKUs activos</span>
              <strong>{products.length}</strong>
            </div>
          </div>

          <div className="premium-proof">
            {moduleHighlights.map((item) => (
              <div key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </aside>
      </header>

      <nav className="panel sticky-nav">
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

      <main className="content-flow">
        <section id="control" className="page-section">
          <SectionHeading
            tag="Control room"
            title="Operacion comercial y lectura ejecutiva en una sola pantalla."
            text="La demo ya no parece un panel random: parece el sistema central del negocio."
          />

          <div className="stats-grid">
            <StatCard label="Stock total" value={totalStock} note="Unidades controladas en tiempo real" />
            <StatCard label="Productos en riesgo" value={marginAtRisk.length} note="Margen bajo o poca rotacion" tone="warn" />
            <StatCard label="Fila de consultas" value={whatsappQueue.length} note="Leads que esperan respuesta" />
            <StatCard label="Clientes VIP" value={vipCustomers.length} note="Recompra y follow up" />
          </div>

          <div className="board-grid board-grid-large">
            <BoardCard title="WhatsApp desk" subtitle="Consultas, reservas y seguimiento">
              <div className="stack-gap">
                {queueWithProduct.map((item) => (
                  <QueueItem
                    key={item.id}
                    item={item}
                    product={item.product}
                    onSelect={(id) => {
                      setSelectedProductId(id)
                      jumpTo('products')
                    }}
                  />
                ))}
              </div>
              <div className="quick-replies">
                {quickReplies.map((reply) => (
                  <button key={reply} className="reply-pill" onClick={() => notify('Template copiado para responder rapido.')}>
                    {reply}
                  </button>
                ))}
              </div>
            </BoardCard>

            <BoardCard title="Pricing pulse" subtitle="Alertas de costo, margen y accion inmediata" tone="accent-panel">
              <div className="stack-gap">
                {pricingAlerts.map((alert) => (
                  <div className="alert-card" key={alert.id}>
                    <strong>{alert.title}</strong>
                    <span>{alert.detail}</span>
                    <b>{alert.action}</b>
                  </div>
                ))}
              </div>
            </BoardCard>

            <BoardCard title="Stock radar" subtitle="Reposicion priorizada por venta, reservas y lead time">
              <div className="stack-gap">
                {restockPriority.map((product, index) => (
                  <div className="priority-row" key={product.id}>
                    <span>0{index + 1}</span>
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.stock}u · {product.reservations} reservas · {product.leadTimeDays} dias</small>
                    </div>
                    <mark>{product.featured}</mark>
                  </div>
                ))}
              </div>
            </BoardCard>

            <BoardCard title="Top customers" subtitle="A quienes reactivar primero">
              <div className="stack-gap">
                {vipCustomers.map((customer) => (
                  <div className="customer-row" key={customer.id}>
                    <div>
                      <strong>{customer.name}</strong>
                      <span>{customer.segment}</span>
                    </div>
                    <div>
                      <b>{compactCurrency.format(customer.lifetimeValue)}</b>
                      <small>{customer.lastPurchase}</small>
                    </div>
                  </div>
                ))}
              </div>
            </BoardCard>
          </div>
        </section>

        <section id="products" className="page-section">
          <SectionHeading
            tag="Product studio"
            title="SKU listos para vender, no solo para guardar."
            text="Specs estructuradas, stock por variante, proteccion de margen y foco visual en el producto correcto."
          >
            <label className="field search-field">
              <span>Buscar por nombre, marca o SKU</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar notebook, mouse, router..."
              />
            </label>
          </SectionHeading>

          <div className="studio-grid">
            <div className="panel product-rail">
              <div className="rail-head">
                <h3>SKU intelligence</h3>
                <span>{filteredProducts.length} resultados</span>
              </div>
              <div className="tile-grid">
                {filteredProducts.map((product) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    selected={product.id === focusProduct.id}
                    onSelect={setSelectedProductId}
                  />
                ))}
              </div>
            </div>

            <FocusPanel
              product={focusProduct}
              whatsappNumber={config.whatsappNumber}
              onTrackWhatsapp={trackWhatsapp}
              onAddToCart={addToCart}
            />
          </div>

          <div className="launch-grid">
            <form className="panel launch-form" onSubmit={createProduct}>
              <div className="board-head">
                <div>
                  <h3>Launch pad</h3>
                  <span>Alta rapida con precio sugerido y ficha tecnica.</span>
                </div>
              </div>
              <div className="form-grid">
                <label className="field">
                  <span>Nombre</span>
                  <input type="text" value={form.name} onChange={(event) => updateForm('name', event.target.value)} required />
                </label>
                <label className="field">
                  <span>SKU interno</span>
                  <input type="text" value={form.sku} onChange={(event) => updateForm('sku', event.target.value)} />
                </label>
                <label className="field">
                  <span>Categoria</span>
                  <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                    {categories.filter((item) => item !== 'Todos').map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Marca</span>
                  <select value={form.brand} onChange={(event) => updateForm('brand', event.target.value)}>
                    {brands.filter((item) => item !== 'Todas').map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Costo</span>
                  <input type="number" min="0" value={form.cost} onChange={(event) => updateForm('cost', event.target.value)} />
                </label>
                <label className="field">
                  <span>Margen objetivo %</span>
                  <input type="number" min="0" value={form.margin} onChange={(event) => updateForm('margin', event.target.value)} />
                </label>
                <label className="field">
                  <span>Stock inicial</span>
                  <input type="number" min="0" value={form.stock} onChange={(event) => updateForm('stock', event.target.value)} />
                </label>
                <label className="field">
                  <span>Descripcion</span>
                  <input type="text" value={form.description} onChange={(event) => updateForm('description', event.target.value)} />
                </label>
                <label className="field">
                  <span>Procesador</span>
                  <input type="text" value={form.processor} onChange={(event) => updateForm('processor', event.target.value)} />
                </label>
                <label className="field">
                  <span>RAM</span>
                  <input type="text" value={form.ram} onChange={(event) => updateForm('ram', event.target.value)} />
                </label>
                <label className="field">
                  <span>Capacidad</span>
                  <input type="text" value={form.capacity} onChange={(event) => updateForm('capacity', event.target.value)} />
                </label>
                <label className="field">
                  <span>Conectividad</span>
                  <input type="text" value={form.connectivity} onChange={(event) => updateForm('connectivity', event.target.value)} />
                </label>
              </div>
              <div className="hero-actions">
                <button className="primary-button" type="submit">Crear SKU premium</button>
                <button className="ghost-button" type="button" onClick={() => setForm(emptyForm)}>Limpiar</button>
              </div>
            </form>

            <div className="panel launch-preview">
              <span className="section-tag">Preview de venta</span>
              <h3>{form.name || 'Producto listo para publicar'}</h3>
              <p>{form.description || 'Este preview muestra como se percibe un SKU nuevo dentro del sistema.'}</p>
              <div className="preview-metrics">
                <div>
                  <span>Precio sugerido</span>
                  <strong>{currency.format(suggestedPrice)}</strong>
                </div>
                <div>
                  <span>Canal principal</span>
                  <strong>Catalogo + WhatsApp</strong>
                </div>
              </div>
              <div className="focus-kpis compact">
                <div><span>Procesador</span><strong>{form.processor || 'Pendiente'}</strong></div>
                <div><span>RAM</span><strong>{form.ram || 'Pendiente'}</strong></div>
                <div><span>Capacidad</span><strong>{form.capacity || 'Pendiente'}</strong></div>
                <div><span>Conectividad</span><strong>{form.connectivity || 'Pendiente'}</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section id="pos" className="page-section">
          <SectionHeading
            tag="Negotiation desk"
            title="Venta rapida, editable y lista para cerrar sin friccion."
            text="Pensado para mostrador argentino: precio editable, descuento controlado y metodos de pago visibles."
          />

          <div className="pos-grid">
            <BoardCard title="Quick add" subtitle="Lo que mas rota hoy">
              <div className="stack-gap">
                {filteredProducts.slice(0, 5).map((product) => (
                  <button key={product.id} className="queue-item" onClick={() => addToCart(product)}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.sku}</span>
                    </div>
                    <div className="queue-side">
                      <mark>{currency.format(product.price)}</mark>
                      <small>{product.stock}u</small>
                    </div>
                  </button>
                ))}
              </div>
              <div className="negotiation-notes">
                <div>
                  <span>Combo sugerido</span>
                  <strong>{focusProduct.bundle.join(' + ')}</strong>
                </div>
                <div>
                  <span>Objetivo de cierre</span>
                  <strong>{currency.format(focusProduct.price * 1.08)}</strong>
                </div>
              </div>
            </BoardCard>

            <BoardCard title="Live cart" subtitle="Negociar sin perder control del margen" tone="accent-panel">
              <div className="stack-gap">
                {cart.length ? (
                  cart.map((item) => (
                    <CartLine key={item.id} item={item} onChange={updateCartItem} onRemove={removeFromCart} />
                  ))
                ) : (
                  <div className="empty-card">Todavia no agregaste productos al escritorio de venta.</div>
                )}
              </div>

              <div className="pill-row">
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

              <div className="pill-row">
                {[0, 5, 10, 15].map((rate) => (
                  <button
                    key={rate}
                    className={discountRate === rate ? 'pill active' : 'pill'}
                    onClick={() => setDiscountRate(rate)}
                  >
                    Descuento {rate}%
                  </button>
                ))}
              </div>

              <div className="totals-grid">
                <div>
                  <span>Subtotal</span>
                  <strong>{currency.format(cartSubtotal)}</strong>
                </div>
                <div>
                  <span>Descuento</span>
                  <strong>{currency.format(discountValue)}</strong>
                </div>
                <div className="grand-total">
                  <span>Total</span>
                  <strong>{currency.format(cartTotal)}</strong>
                </div>
              </div>

              <button className="primary-button full-width" onClick={registerSale}>
                Registrar venta
              </button>
            </BoardCard>
          </div>
        </section>

        <section id="catalog" className="page-section">
          <SectionHeading
            tag="Mobile storefront"
            title="La parte que realmente hace convertir la demo."
            text="Cuando esto se muestra en celular, el sistema deja de parecer un software interno y pasa a verse como una maquina de ventas."
          />

          <div className="catalog-grid">
            <div className="panel storefront-copy">
              <h3>Storefront con valor real</h3>
              <div className="story-grid">
                <div>
                  <span>1</span>
                  <strong>El cliente ve el producto</strong>
                  <p>Con ficha tecnica clara, etiquetas comerciales y stock visible.</p>
                </div>
                <div>
                  <span>2</span>
                  <strong>Consulta o reserva</strong>
                  <p>El mensaje ya sale armado con nombre, precio y SKU.</p>
                </div>
                <div>
                  <span>3</span>
                  <strong>El vendedor cierra</strong>
                  <p>Desde WhatsApp o POS, con precio negociable y seguimiento.</p>
                </div>
              </div>

              <div className="settings-panel">
                <label className="field">
                  <span>Numero de WhatsApp</span>
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
                <label className="field">
                  <span>Mensaje comercial</span>
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
            </div>

            <div className="phone-shell">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-header">
                  <img src={logo} alt="GTX logo" />
                  <div>
                    <strong>GTX Store</strong>
                    <span>{config.autoMessage}</span>
                  </div>
                </div>

                <label className="field">
                  <span>Buscar</span>
                  <input
                    type="search"
                    value={catalogSearch}
                    onChange={(event) => setCatalogSearch(event.target.value)}
                    placeholder="Buscar notebook, router, SSD..."
                  />
                </label>

                <div className="phone-filters">
                  <select value={catalogCategory} onChange={(event) => setCatalogCategory(event.target.value)}>
                    {categories.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  <select value={catalogBrand} onChange={(event) => setCatalogBrand(event.target.value)}>
                    {brands.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="stack-gap">
                  {catalogProducts.slice(0, 4).map((product) => (
                    <PhoneProduct
                      key={product.id}
                      product={product}
                      whatsappNumber={config.whatsappNumber}
                      onTrackWhatsapp={trackWhatsapp}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="value" className="page-section">
          <SectionHeading
            tag="Why 3000 USD"
            title="No se vende por cantidad de pantallas. Se vende por impacto."
            text="Esta propuesta ya comunica software serio, especializado y hecho para una tienda tech que vive de rotacion, margen y conversion."
          />

          <div className="value-grid">
            <div className="panel value-card">
              <span>Especializacion</span>
              <strong>Ficha tecnica, variantes y pricing dinamico.</strong>
              <p>No es un sistema generico: habla el idioma del rubro tecnologia.</p>
            </div>
            <div className="panel value-card">
              <span>Conversion</span>
              <strong>Catalogo mobile + WhatsApp + reserva + POS.</strong>
              <p>La demo muestra el flujo que realmente genera ventas, no solo administracion.</p>
            </div>
            <div className="panel value-card">
              <span>Operacion</span>
              <strong>Radar de reposicion, margen, clientes y leads.</strong>
              <p>El dueño siente que controla el negocio en serio desde la primera mirada.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
