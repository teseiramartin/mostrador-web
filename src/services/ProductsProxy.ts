import type { Product } from '../types'
import BaseProxy from './BaseProxy'

export class ProductsProxy extends BaseProxy {
  async getAll(): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/api/products')
    return response.data
  }
}
