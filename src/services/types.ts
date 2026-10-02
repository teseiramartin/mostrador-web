import type { Client, Product, Sale, SaleLine, Unit } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateProductRequest {
  name: string
  code: string
  category: string
  unit: Unit
  price: number
  stockByBranch: Record<string, number>
}

export type CreateClientRequest = Omit<Client, 'id'>

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
