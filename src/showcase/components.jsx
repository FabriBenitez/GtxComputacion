import { buildWhatsappUrl, compactCurrency, currency } from './data'

export function SectionHeading({ tag, title, text, children }) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-tag">{tag}</span>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      {children}
    </div>
  )
}

export function StatCard({ label, value, note, tone = '' }) {
  return (
    <article className={`stat-card ${tone}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  )
}

export function BoardCard({ title, subtitle, children, tone = '' }) {
  return (
    <article className={`panel board-card ${tone}`.trim()}>
      <div className="board-head">
        <div>
          <h3>{title}</h3>
          <span>{subtitle}</span>
        </div>
      </div>
      {children}
    </article>
  )
}

export function QueueItem({ item, product, onSelect }) {
  return (
    <button className="queue-item" onClick={() => onSelect(product.id)}>
      <div>
        <strong>{item.customer}</strong>
        <span>{item.intent}</span>
      </div>
      <div className="queue-side">
        <mark>{item.stage}</mark>
        <small>{item.waitMinutes} min</small>
      </div>
    </button>
  )
}

export function ProductTile({ product, selected, onSelect }) {
  const margin = Math.round(((product.price - product.cost) / product.cost) * 100)

  return (
    <button className={selected ? 'product-tile selected' : 'product-tile'} onClick={() => onSelect(product.id)}>
      <div className="tile-top">
        <span className="mini-badge">{product.featured}</span>
        <span className={product.stock <= 3 ? 'mini-stock low' : 'mini-stock'}>{product.stock}u</span>
      </div>
      <strong>{product.name}</strong>
      <span>{product.brand} · {product.sku}</span>
      <div className="tile-bottom">
        <b>{currency.format(product.price)}</b>
        <small>{margin}% margen</small>
      </div>
    </button>
  )
}

export function FocusPanel({ product, whatsappNumber, onTrackWhatsapp, onAddToCart }) {
  const margin = Math.round(((product.price - product.cost) / product.cost) * 100)
  const profit = product.price - product.cost
  const trendText =
    product.priceTrend === 'up'
      ? 'Presion alcista'
      : product.priceTrend === 'down'
        ? 'Ventaja para promo'
        : 'Estable'

  return (
    <article className="panel focus-panel">
      <div className="focus-head">
        <div>
          <span className="section-tag">Focus product</span>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="focus-status">
          <mark>{product.featured}</mark>
          <span>{product.updatedAt}</span>
        </div>
      </div>

      <div className="focus-kpis">
        <div>
          <span>Precio</span>
          <strong>{currency.format(product.price)}</strong>
        </div>
        <div>
          <span>Ganancia unitaria</span>
          <strong>{currency.format(profit)}</strong>
        </div>
        <div>
          <span>Margen</span>
          <strong>{margin}%</strong>
        </div>
        <div>
          <span>Trend</span>
          <strong>{trendText}</strong>
        </div>
      </div>

      <div className="focus-grid">
        <div className="spec-block">
          {Object.entries(product.specs).map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="focus-side-stack">
          <div className="micro-panel">
            <span>Reposicion</span>
            <strong>{product.stock} disponibles · {product.reserved} reservados</strong>
            <small>Proveedor {product.supplier} · lead time {product.leadTimeDays} dias</small>
          </div>
          <div className="micro-panel">
            <span>Conversacion</span>
            <strong>{product.clicks} clics · {product.reservations} reservas</strong>
            <small>Bundle sugerido: {product.bundle.join(' + ')}</small>
          </div>
          <div className="micro-panel">
            <span>Historial</span>
            <strong>{product.priceHistory.map((value) => compactCurrency.format(value)).join(' / ')}</strong>
            <small>Ultima revision {product.updatedAt}</small>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <button className="primary-button" onClick={() => onAddToCart(product)}>
          Pasar al POS
        </button>
        <a
          className="link-button"
          href={buildWhatsappUrl(whatsappNumber, product, 'consultar')}
          target="_blank"
          rel="noreferrer"
          onClick={() => onTrackWhatsapp(product.id)}
        >
          Consultar por WhatsApp
        </a>
        <a
          className="link-button accent"
          href={buildWhatsappUrl(whatsappNumber, product, 'reservar')}
          target="_blank"
          rel="noreferrer"
          onClick={() => onTrackWhatsapp(product.id)}
        >
          Reservar ahora
        </a>
      </div>
    </article>
  )
}

export function CartLine({ item, onChange, onRemove }) {
  return (
    <div className="cart-line">
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
            onChange={(event) => onChange(item.id, 'qty', event.target.value)}
          />
        </label>
        <label>
          Precio
          <input
            type="number"
            min="0"
            value={item.unitPrice}
            onChange={(event) => onChange(item.id, 'unitPrice', event.target.value)}
          />
        </label>
        <button className="icon-button" onClick={() => onRemove(item.id)}>
          Quitar
        </button>
      </div>
    </div>
  )
}

export function PhoneProduct({ product, whatsappNumber, onTrackWhatsapp }) {
  return (
    <div className="phone-product">
      <div className="tile-top">
        <span className="mini-badge">{product.featured}</span>
        <strong>{product.clicks} clics</strong>
      </div>
      <h4>{product.name}</h4>
      <p>{product.brand}</p>
      <strong className="phone-price">{currency.format(product.price)}</strong>
      <div className="phone-specs">
        {Object.entries(product.specs)
          .slice(0, 3)
          .map(([label, value]) => (
            <span key={label}>
              {label}: {value}
            </span>
          ))}
      </div>
      <div className="cta-row">
        <a
          className="link-button"
          href={buildWhatsappUrl(whatsappNumber, product, 'consultar')}
          target="_blank"
          rel="noreferrer"
          onClick={() => onTrackWhatsapp(product.id)}
        >
          Consultar
        </a>
        <a
          className="link-button accent"
          href={buildWhatsappUrl(whatsappNumber, product, 'reservar')}
          target="_blank"
          rel="noreferrer"
          onClick={() => onTrackWhatsapp(product.id)}
        >
          Reservar
        </a>
      </div>
    </div>
  )
}
