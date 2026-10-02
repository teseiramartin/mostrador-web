import type { Sale } from '../types'
import BaseProxy from './BaseProxy'
import type { CreateSaleRequest, CreateSaleResponse } from './types'

export class SalesProxy extends BaseProxy {
  async getAll(): Promise<Sale[]> {
    const response = await this.client.get<Sale[]>('/api/sales')
    return response.data
  }

  async post(request: CreateSaleRequest): Promise<CreateSaleResponse> {
    const response = await this.client.post<CreateSaleResponse>(
      '/api/sales',
      request,
    )
    return response.data
  }
}
