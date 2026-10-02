export type Unit = 'kg' | 'unidad'

export interface Branch {
  id: string
  name: string
  address: string
  shortName: string
  code: string
}

export interface Product {
  id: string
  name: string
  category: string
  code: string
  unit: Unit
  price: number
  stockByBranch: Record<string, number>
  color: string
  initials: string
}

export interface SaleLine {
  productId: string
  quantity: number
}

export interface Sale {
  id: string
  branchId: string
  time: string
  cashier: string
  payment: 'Efectivo' | 'Débito' | 'Transferencia'
  lines: SaleLine[]
}

export type Role = 'owner' | 'seller'
export type View =
  'overview' | 'branch' | 'sales' | 'products' | 'stock' | 'pending'
