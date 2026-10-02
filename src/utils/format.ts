export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)

export const formatQuantity = (value: number, unit: 'kg' | 'unidad') =>
  unit === 'kg'
    ? `${new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 }).format(value)} kg`
    : `${value} ${value === 1 ? 'unidad' : 'unidades'}`
