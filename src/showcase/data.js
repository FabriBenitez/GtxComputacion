export const currency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export const compactCurrency = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const sections = [
  { id: 'control', label: 'Control Room' },
  { id: 'products', label: 'Product Studio' },
  { id: 'pos', label: 'Negotiation Desk' },
  { id: 'catalog', label: 'Mobile Storefront' },
  { id: 'value', label: 'Why 3000 USD' },
]

export const categories = [
  'Todos',
  'Notebooks',
  'Componentes PC',
  'Perifericos',
  'Audio',
  'Redes',
  'Streaming',
]

export const brands = [
  'Todas',
  'Lenovo',
  'Logitech',
  'Kingston',
  'Redragon',
  'TP-Link',
  'Google',
  'Western Digital',
  'Samsung',
  'Asus',
]

export const paymentMethods = ['Efectivo', 'Transferencia', 'Mercado Pago']

export const initialProducts = [
  {
    id: 1,
    name: 'Notebook Lenovo IdeaPad Slim 3',
    category: 'Notebooks',
    brand: 'Lenovo',
    sku: 'NB-LEN-14-R5',
    cost: 485000,
    price: 629900,
    stock: 3,
    reserved: 1,
    soldMonthly: 11,
    clicks: 18,
    reservations: 5,
    lastSaleDays: 2,
    updatedAt: 'Hoy 10:42',
    supplier: 'Delta Import',
    leadTimeDays: 4,
    priceTrend: 'up',
    featured: 'Mas vendido',
    description: 'Notebook de salida rapida para estudio, oficina y home office.',
    specs: {
      Procesador: 'Ryzen 5 7520U',
      RAM: '16GB DDR5',
      Capacidad: 'SSD 512GB',
      Pantalla: '14" FHD',
      Conectividad: 'Wi-Fi 6, BT 5.2, USB-C',
    },
    variants: [
      { label: '8GB / 256GB', stock: 1 },
      { label: '16GB / 512GB', stock: 2 },
    ],
    priceHistory: [589900, 612900, 629900],
    bundle: ['Mouse Logitech M280', 'Mochila Targus'],
  },
  {
    id: 2,
    name: 'Mouse Logitech G203 Lightsync',
    category: 'Perifericos',
    brand: 'Logitech',
    sku: 'MOU-LOG-G203',
    cost: 18900,
    price: 25900,
    stock: 12,
    reserved: 0,
    soldMonthly: 23,
    clicks: 34,
    reservations: 8,
    lastSaleDays: 1,
    updatedAt: 'Hoy 11:06',
    supplier: 'Vision IT',
    leadTimeDays: 2,
    priceTrend: 'down',
    featured: 'Oferta',
    description: 'Mouse gamer de ticket rapido, muy fuerte para WhatsApp.',
    specs: {
      Sensor: '8000 DPI',
      Botones: '6 programables',
      Conexion: 'USB',
      Iluminacion: 'RGB Lightsync',
      Peso: '85 g',
    },
    variants: [
      { label: 'Negro', stock: 7 },
      { label: 'Blanco', stock: 5 },
    ],
    priceHistory: [27900, 26500, 25900],
    bundle: ['Pad gamer XL', 'Teclado Redragon Kumara'],
  },
  {
    id: 3,
    name: 'Memoria Kingston Fury Beast DDR4',
    category: 'Componentes PC',
    brand: 'Kingston',
    sku: 'RAM-KNG-3200',
    cost: 22800,
    price: 31900,
    stock: 6,
    reserved: 1,
    soldMonthly: 16,
    clicks: 14,
    reservations: 3,
    lastSaleDays: 5,
    updatedAt: 'Ayer 18:10',
    supplier: 'Memory Group',
    leadTimeDays: 3,
    priceTrend: 'up',
    featured: 'Upgrade facil',
    description: 'Producto ideal para upsell de service y armado de PC.',
    specs: {
      RAM: '16GB',
      Velocidad: '3200MHz',
      Latencia: 'CL16',
      Formato: 'UDIMM',
      Disipador: 'Aluminio negro',
    },
    variants: [
      { label: '8GB', stock: 2 },
      { label: '16GB', stock: 4 },
    ],
    priceHistory: [29900, 30900, 31900],
    bundle: ['SSD WD Green 500GB', 'Service de instalacion'],
  },
  {
    id: 4,
    name: 'Auriculares Redragon Zeus X',
    category: 'Audio',
    brand: 'Redragon',
    sku: 'AUD-RDG-ZEUSX',
    cost: 41200,
    price: 58900,
    stock: 2,
    reserved: 1,
    soldMonthly: 9,
    clicks: 21,
    reservations: 4,
    lastSaleDays: 8,
    updatedAt: 'Hoy 09:25',
    supplier: 'Game Supply',
    leadTimeDays: 6,
    priceTrend: 'flat',
    featured: 'Ultimas unidades',
    description: 'Headset gamer que pide urgencia, ideal para reserva por chat.',
    specs: {
      Sonido: '7.1 Virtual',
      Microfono: 'Desmontable',
      Conexion: 'USB + Jack 3.5',
      Compatibilidad: 'PC, PS, Switch',
      Construccion: 'Metal reforzado',
    },
    variants: [
      { label: 'Negro', stock: 1 },
      { label: 'Blanco', stock: 1 },
    ],
    priceHistory: [54900, 56900, 58900],
    bundle: ['Mousepad control', 'Soporte de auricular'],
  },
  {
    id: 5,
    name: 'Router TP-Link Archer AX12',
    category: 'Redes',
    brand: 'TP-Link',
    sku: 'NET-TPL-AX12',
    cost: 39900,
    price: 52900,
    stock: 7,
    reserved: 0,
    soldMonthly: 7,
    clicks: 9,
    reservations: 2,
    lastSaleDays: 18,
    updatedAt: 'Ayer 16:40',
    supplier: 'Data Point',
    leadTimeDays: 5,
    priceTrend: 'flat',
    featured: 'Nuevo ingreso',
    description: 'Router Wi-Fi 6 para hogares con streaming y muchos dispositivos.',
    specs: {
      WiFi: 'AX1500',
      Bandas: '2.4GHz / 5GHz',
      Puertos: '4x Gigabit',
      Cobertura: 'Hasta 120 m2',
      App: 'Tether',
    },
    variants: [{ label: 'Version global', stock: 7 }],
    priceHistory: [49900, 51900, 52900],
    bundle: ['Cable cat6 10m', 'Instalacion express'],
  },
  {
    id: 6,
    name: 'Chromecast Google TV HD',
    category: 'Streaming',
    brand: 'Google',
    sku: 'STR-GOO-TVHD',
    cost: 51900,
    price: 69900,
    stock: 5,
    reserved: 2,
    soldMonthly: 13,
    clicks: 26,
    reservations: 6,
    lastSaleDays: 3,
    updatedAt: 'Hoy 10:18',
    supplier: 'Smart Home AR',
    leadTimeDays: 4,
    priceTrend: 'up',
    featured: 'Conversion alta',
    description: 'Producto de consulta simple y gran conversion por WhatsApp.',
    specs: {
      Resolucion: '1080p HDR',
      Sistema: 'Google TV',
      Conectividad: 'Wi-Fi, Bluetooth',
      Audio: 'Dolby Digital',
      Extras: 'Control por voz',
    },
    variants: [
      { label: 'Snow', stock: 3 },
      { label: 'Charcoal', stock: 2 },
    ],
    priceHistory: [65900, 67900, 69900],
    bundle: ['HDMI premium', 'Pilas recargables'],
  },
]

export const initialCustomers = [
  {
    id: 1,
    name: 'Martina Ruiz',
    phone: '+54 9 11 6421-1402',
    segment: 'Diseno y notebooks',
    purchases: 4,
    lifetimeValue: 1820000,
    lastPurchase: 'Hace 12 dias',
  },
  {
    id: 2,
    name: 'Joaquin Lopez',
    phone: '+54 9 11 5188-2901',
    segment: 'Gaming y perifericos',
    purchases: 7,
    lifetimeValue: 940000,
    lastPurchase: 'Hace 4 dias',
  },
  {
    id: 3,
    name: 'Valentina Sosa',
    phone: '+54 9 11 3877-0092',
    segment: 'Streaming y hogar',
    purchases: 3,
    lifetimeValue: 418000,
    lastPurchase: 'Hace 20 dias',
  },
]

export const whatsappQueue = [
  { id: 1, customer: 'Luca Ferreyra', intent: 'Quiere reservar', productId: 4, waitMinutes: 3, stage: 'Caliente' },
  { id: 2, customer: 'Milagros Pena', intent: 'Pide mejor precio', productId: 1, waitMinutes: 7, stage: 'Negociando' },
  { id: 3, customer: 'Matias Vega', intent: 'Consulta stock hoy', productId: 6, waitMinutes: 11, stage: 'En cola' },
  { id: 4, customer: 'Sofia Vera', intent: 'Quiere combo con RAM', productId: 3, waitMinutes: 4, stage: 'Upsell' },
]

export const pricingAlerts = [
  { id: 1, title: '3 productos con costo subiendo', detail: 'La lista mayorista entro 6.8% arriba desde ayer.', action: 'Actualizar precios masivos' },
  { id: 2, title: '2 SKUs con margen por debajo del objetivo', detail: 'Estan por debajo de 24% de contribucion.', action: 'Revisar margen o bundle' },
  { id: 3, title: '1 producto para liquidacion', detail: 'Monitor Samsung lleva 49 dias sin venta.', action: 'Marcar oferta + publicar por WhatsApp' },
]

export const moduleHighlights = [
  { id: 1, title: 'WhatsApp Desk', text: 'Canaliza consultas, reservas y seguimiento desde el mismo flujo comercial.' },
  { id: 2, title: 'Pricing Pulse', text: 'Precio sugerido, historial y proteccion de margen para Argentina.' },
  { id: 3, title: 'Stock Radar', text: 'Reposicion priorizada segun rotacion, reservas y lead time del proveedor.' },
  { id: 4, title: 'Negotiation POS', text: 'Venta rapida con precio editable, descuento controlado y cobro flexible.' },
]

export const quickReplies = [
  'Lo tengo disponible. Te lo puedo reservar con seña.',
  'Te paso opcion con mejor rendimiento por poca diferencia.',
  'Si queres, te armo combo con instalacion y te cierro precio hoy.',
]

export function buildWhatsappUrl(number, product, mode = 'consultar') {
  const intro =
    mode === 'reservar'
      ? 'Hola! Quiero reservar este producto:'
      : 'Hola! Estoy interesado en este producto:'

  const text = `${intro}

${product.name}
Precio: ${currency.format(product.price)}
SKU: ${product.sku}

${mode === 'reservar' ? 'Podemos apartarlo?' : 'Lo tenes disponible?'}`

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
