import {
  AxiosError,
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
} from 'axios'
import { branches, initialProducts, initialSales } from '../data/mockData'
import type { Product, Sale } from '../types'
import type { CreateSaleRequest, CreateSaleResponse } from './types'

// The mock owns its data. Responses are cloned so Redux cannot freeze the source.
let products: Product[] = structuredClone(initialProducts)
let sales: Sale[] = structuredClone(initialSales)

export const mockAdapter: AxiosAdapter = async (config) => {
  const path = new URL(config.url ?? '', 'http://mock.local').pathname
  const method = config.method?.toLowerCase()
  const respond = <T>(data: T, status = 200): AxiosResponse<T> => ({
    data: structuredClone(data),
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: new AxiosHeaders(),
    config,
  })

  if (method === 'get' && path === '/api/branches') return respond(branches)
  if (method === 'get' && path === '/api/products') return respond(products)
  if (method === 'get' && path === '/api/sales') return respond(sales)

  if (method === 'post' && path === '/api/sales') {
    const request = JSON.parse(String(config.data)) as CreateSaleRequest
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
