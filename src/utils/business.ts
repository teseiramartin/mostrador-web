import type { Branch, Product, Sale } from '../types'

export const getSaleTotal = (sale: Sale, products: Product[]) =>
  sale.lines.reduce((total, line) => {
    const product = products.find((item) => item.id === line.productId)
    return total + (product?.price ?? 0) * line.quantity
  }, 0)

export function getSalesSummary(
  sales: Sale[],
  products: Product[],
  branchId?: string,
) {
  const relevant = branchId
    ? sales.filter((sale) => sale.branchId === branchId)
    : sales
  const total = relevant.reduce(
    (sum, sale) => sum + getSaleTotal(sale, products),
    0,
  )
  return {
    total,
    count: relevant.length,
    average: relevant.length ? total / relevant.length : 0,
  }
}

export const stockLimit = (product: Product) => (product.unit === 'kg' ? 1 : 5)

export function getStockAlerts(
  products: Product[],
  branches: Branch[],
  branchId?: string,
) {
  return products.flatMap((product) =>
    branches
      .filter((branch) => !branchId || branch.id === branchId)
      .filter(
        (branch) => product.stockByBranch[branch.id] <= stockLimit(product),
      )
      .map((branch) => ({
        product,
        branch,
        quantity: product.stockByBranch[branch.id],
      })),
  )
}

export function getTransferSuggestion(products: Product[], branches: Branch[]) {
  for (const alert of getStockAlerts(products, branches)) {
    const candidate = branches
      .filter((branch) => branch.id !== alert.branch.id)
      .sort(
        (a, b) =>
          alert.product.stockByBranch[b.id] - alert.product.stockByBranch[a.id],
      )[0]
    if (
      candidate &&
      alert.product.stockByBranch[candidate.id] >= stockLimit(alert.product) * 2
    ) {
      return {
        alert,
        source: candidate,
        available: alert.product.stockByBranch[candidate.id],
      }
    }
  }
  return null
}
