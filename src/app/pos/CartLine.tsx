import React from 'react'

interface CartItem {
  id: number
  name: string
  sku: string
  stock: number
  qty: number
  unitPrice: number
}

interface CartLineProps {
  item: CartItem
  onChange: (id: number, field: string, value: string | number) => void
  onRemove: (id: number) => void
}

export default function CartLine({ item, onChange, onRemove }: CartLineProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-b-0">
      <div>
        <strong className="text-foreground">{item.name}</strong>
        <span className="block text-xs text-muted-foreground">{item.sku}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`qty-${item.id}`}>Cantidad</label>
        <input
          id={`qty-${item.id}`}
          type="number"
          min="1"
          max={item.stock}
          value={item.qty}
          onChange={(e) => onChange(item.id, 'qty', e.target.value)}
          className="w-14 rounded-md border border-border px-2 py-1 text-sm"
        />
        <label className="sr-only" htmlFor={`price-${item.id}`}>Precio</label>
        <input
          id={`price-${item.id}`}
          type="number"
          min="0"
          value={item.unitPrice}
          onChange={(e) => onChange(item.id, 'unitPrice', e.target.value)}
          className="w-24 rounded-md border border-border px-2 py-1 text-sm"
        />
        <button onClick={() => onRemove(item.id)} className="text-destructive hover:text-destructive/80 text-sm">Quitar</button>
      </div>
    </div>
  )
}