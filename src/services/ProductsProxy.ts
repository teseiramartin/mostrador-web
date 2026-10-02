import type { Product } from '../types'
import BaseProxy from './BaseProxy'
import type { CreateProductRequest } from './types'

export class ProductsProxy extends BaseProxy {
  async getAll(): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/api/products')
    return response.data
  }

  async post(request: CreateProductRequest): Promise<Product> {
    const response = await this.client.post<Product>('/api/products', request)
    return response.data
  }
}
