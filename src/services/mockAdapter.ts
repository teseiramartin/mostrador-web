import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
} from 'axios'
import { branches, initialProducts, initialSales } from '../data/mockData'
import { initialClients } from '../data/mockClients'
import type { Client, Product, Sale, User } from '../types'
import type {
  CreateClientRequest,
  CreateProductRequest,
  CreateSaleRequest,
  CreateSaleResponse,
  LoginRequest,
} from './types'

// The mock owns its data. Responses are cloned so Redux cannot freeze the source.
let products: Product[] = structuredClone(initialProducts)
let sales: Sale[] = structuredClone(initialSales)
let clients: Client[] = structuredClone(initialClients)

export const mockAdapter: AxiosAdapter = async (config) => {
  const path = new URL(config.url ?? '', 'http://mock.local').pathname
  const method = config.method?.toLowerCase()
  const body = () => JSON.parse(String(config.data)) as unknown
  const respond = <T>(data: T, status = 200): AxiosResponse<T> => ({
    data: structuredClone(data),
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: new AxiosHeaders(),
    config,
  })

  if (method === 'post' && path === '/api/auth/login') {
    const request = body() as LoginRequest
    const email = request.email.trim().toLowerCase()
    const users: User[] = [
      {
        id: 'u-owner',
        name: 'Andrés Molina',
        email: 'dueno@mostrador.demo',
        role: 'owner',
        branchId: null,
      },
      {
        id: 'u-seller',
        name: 'Lucía Fernández',
        email: 'vendedor@mostrador.demo',
        role: 'seller',
        branchId: 'centro',
      },
    ]
    const user = users.find((item) => item.email === email)
    if (!user || request.password !== 'demo1234') {
      throw new AxiosError(
        'El correo o la contraseña no coinciden.',
        AxiosError.ERR_BAD_REQUEST,
        config,
      )
    }
    return respond(user)
  }

  if (method === 'get' && path === '/api/branches') return respond(branches)
  if (method === 'get' && path === '/api/products') return respond(products)
  if (method === 'get' && path === '/api/sales') return respond(sales)
  if (method === 'get' && path === '/api/clients') return respond(clients)

  if (method === 'post' && path === '/api/products') {
    const request = body() as CreateProductRequest
    if (
      !request.name?.trim() ||
      !request.code?.trim() ||
      products.some((item) => item.code === request.code)
    ) {
      throw new AxiosError(
        'Revisá el nombre y el código: el código debe ser único.',
        AxiosError.ERR_BAD_REQUEST,
        config,
      )
    }
    const product: Product = {
      ...request,
      id: `p${Math.max(0, ...products.map((item) => Number(item.id.slice(1)))) + 1}`,
      initials: request.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join(''),
      color: 'sage',
    }
    products = [...products, product]
    return respond(product, 201)
  }

  if (method === 'post' && path === '/api/clients') {
    const request = body() as CreateClientRequest
    if (
      !request.name?.trim() ||
      (request.document &&
        clients.some((item) => item.document === request.document))
    ) {
      throw new AxiosError(
        'Revisá el nombre y el documento del cliente.',
        AxiosError.ERR_BAD_REQUEST,
        config,
      )
    }
    const client: Client = {
      ...request,
      id: `c${Math.max(0, ...clients.map((item) => Number(item.id.slice(1)))) + 1}`,
    }
    clients = [...clients, client]
    return respond(client, 201)
  }

  if (method === 'post' && path === '/api/sales') {
    const request = body() as CreateSaleRequest
    const lines = request.lines
    const valid =
      branches.some((branch) => branch.id === request.branchId) &&
      lines.length > 0 &&
      lines.every((line) => {
        const product = products.find((item) => item.id === line.productId)
        return (
          product &&
          line.quantity > 0 &&
          line.quantity <= (product.stockByBranch[request.branchId] ?? 0) &&
          (product.unit !== 'unidad' || Number.isInteger(line.quantity))
        )
      })
    if (!valid)
      throw new AxiosError(
        'Revisá las cantidades y el stock disponible.',
        AxiosError.ERR_BAD_REQUEST,
        config,
      )

    const nextId =
      Math.max(0, ...sales.map((sale) => Number(sale.id.slice(2)))) + 1
    const sale: Sale = {
      id: `V-${nextId}`,
      branchId: request.branchId,
      cashier: request.cashier,
      payment: request.payment,
      time: new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }),
      lines: structuredClone(lines),
    }
    const updatedProducts = products.map((product) => {
      const line = lines.find((item) => item.productId === product.id)
      return line
        ? {
            ...product,
            stockByBranch: {
              ...product.stockByBranch,
              [request.branchId]:
                Math.round(
                  (product.stockByBranch[request.branchId] - line.quantity) *
                    100,
                ) / 100,
            },
          }
        : product
    })
    products = updatedProducts
    sales = [sale, ...sales]
    return respond<CreateSaleResponse>(
      {
        sale,
        updatedProducts: updatedProducts.filter((product) =>
          lines.some((line) => line.productId === product.id),
        ),
      },
      201,
    )
  }

  throw new AxiosError(
    `Endpoint mock no implementado: ${method?.toUpperCase()} ${path}`,
    AxiosError.ERR_BAD_REQUEST,
    config,
  )
}
