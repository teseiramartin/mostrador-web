import axios from 'axios'
import { mockAdapter } from './mockAdapter'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  adapter: import.meta.env.VITE_DATA_SOURCE === 'api' ? undefined : mockAdapter,
})
