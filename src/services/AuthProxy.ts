import type { User } from '../types'
import BaseProxy from './BaseProxy'
import type { LoginRequest } from './types'

export class AuthProxy extends BaseProxy {
  async login(request: LoginRequest): Promise<User> {
    const response = await this.client.post<User>('/api/auth/login', request)
    return response.data
  }
}
