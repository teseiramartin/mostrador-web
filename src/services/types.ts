import type { Product, Sale, SaleLine } from '../types'

export interface CreateSaleRequest {
  branchId: string
  cashier: string
  payment: Sale['payment']
  lines: SaleLine[]
}

export interface CreateSaleResponse {
  sale: Sale
  updatedProducts: Product[]
}
