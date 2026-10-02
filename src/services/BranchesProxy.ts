import type { Branch } from '../types'
import BaseProxy from './BaseProxy'

export class BranchesProxy extends BaseProxy {
  async getAll(): Promise<Branch[]> {
    const response = await this.client.get<Branch[]>('/api/branches')
    return response.data
  }
}
