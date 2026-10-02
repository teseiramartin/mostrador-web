import type { Client } from '../types'
import BaseProxy from './BaseProxy'
import type { CreateClientRequest } from './types'

export class ClientsProxy extends BaseProxy {
  async getAll(): Promise<Client[]> {
    const response = await this.client.get<Client[]>('/api/clients')
    return response.data
  }

  async post(request: CreateClientRequest): Promise<Client> {
    const response = await this.client.post<Client>('/api/clients', request)
    return response.data
  }
}
