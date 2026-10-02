import {
  Button,
  Chip,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowRight, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import type { Branch, Product, Role, Sale, View } from '../../types'
import {
  getSaleTotal,
  getSalesSummary,
  getStockAlerts,
  stockLimit,
} from '../../utils/business'
import { formatCurrency, formatQuantity } from '../../utils/format'
import styles from './DataPage.module.scss'

interface Props {
  branches: Branch[]
  view: Extract<View, 'sales' | 'products' | 'stock'>
  role: Role
  branchId: string
  products: Product[]
  sales: Sale[]
  onNewSale: () => void
  onNewProduct: () => void
  onBranch: (id: string) => void
}

const heading: Record<Props['view'], string> = {
  sales: 'Ventas',
  products: 'Productos',
  stock: 'Inventario',
}

export function DataPage({
  branches,
  view,
  role,
  branchId,
  products,
  sales,
  onNewSale,
  onNewProduct,
  onBranch,
}: Props) {
  const [query, setQuery] = useState('')
  const scope =
    branchId === 'all'
      ? 'toda la red'
      : (branches.find((item) => item.id === branchId)?.name ?? '')
  const visibleSales = sales.filter(
    (sale) =>
      (branchId === 'all' || sale.branchId === branchId) &&
      `${sale.id} ${sale.cashier} ${branches.find((branch) => branch.id === sale.branchId)?.name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.code} ${product.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const summary = getSalesSummary(
    sales,
    products,
    branchId === 'all' ? undefined : branchId,
  )
  const alerts = getStockAlerts(
    products,
    branches,
    branchId === 'all' ? undefined : branchId,
  )
  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>
            {role === 'owner'
              ? 'GESTIÓN · RED DE LOCALES'
              : 'OPERACIÓN · SUCURSAL CENTRO'}
          </span>
          <Typography variant="h1">
            {heading[view]}
            <span>.</span>
          </Typography>
          <p>
            {view === 'sales'
              ? `Operaciones registradas en ${scope}.`
              : view === 'products'
                ? 'Precios y formas de venta del catálogo de ejemplo.'
                : `Existencias separadas por local. ${alerts.length} alertas en ${scope}.`}
          </p>
        </div>
        {role === 'seller' && view === 'sales' && (
          <Button
            variant="contained"
            startIcon={<Plus size={17} />}
            onClick={onNewSale}
          >
            Nueva venta
          </Button>
        )}
        {role === 'owner' && view === 'products' && (
          <Button
            variant="contained"
            startIcon={<Plus size={17} />}
            onClick={onNewProduct}
          >
            Nuevo producto
          </Button>
        )}
      </div>
      <div className={styles.summaryStrip}>
        <div>
          <span>
            {view === 'sales' ? 'IMPORTE REGISTRADO' : 'PRODUCTOS EN CATÁLOGO'}
          </span>
          <strong>
            {view === 'sales' ? formatCurrency(summary.total) : products.length}
          </strong>
        </div>
        <div>
          <span>{view === 'sales' ? 'OPERACIONES' : 'LOCALES'}</span>
          <strong>
            {view === 'sales'
              ? summary.count
              : role === 'owner'
                ? branches.length
                : 1}
          </strong>
        </div>
        <div>
          <span>
            {view === 'sales' ? 'TICKET PROMEDIO' : 'ALERTAS DE STOCK'}
          </span>
          <strong>
            {view === 'sales' ? formatCurrency(summary.average) : alerts.length}
          </strong>
        </div>
      </div>
      <Paper className={styles.tablePanel}>
        <div className={styles.toolbar}>
          <div>
            <Typography variant="h2">
              {view === 'sales'
                ? 'Registro de ventas'
                : view === 'stock'
                  ? 'Disponibilidad por local'
                  : 'Catálogo de productos'}
            </Typography>
            <p>
              {view === 'sales'
                ? 'Cada importe participa en los totales de la vista.'
                : 'Datos de demostración para validar el flujo con el negocio.'}
            </p>
          </div>
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              view === 'sales'
                ? 'Buscar venta, local o vendedor'
                : 'Buscar nombre, categoría o código'
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={17} />
                </InputAdornment>
              ),
            }}
            className={styles.search}
          />
        </div>
        <TableContainer>
          <Table size="small" className={styles.table}>
            {view === 'sales' ? (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>VENTA</TableCell>
                    <TableCell>LOCAL</TableCell>
                    <TableCell>VENDEDOR</TableCell>
                    <TableCell>ARTÍCULOS</TableCell>
                    <TableCell>MEDIO</TableCell>
                    <TableCell align="right">TOTAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <strong>{sale.id}</strong>
                        <small>{sale.time}</small>
                      </TableCell>
                      <TableCell>
                        {
                          branches.find((branch) => branch.id === sale.branchId)
                            ?.shortName
                        }
                      </TableCell>
                      <TableCell>{sale.cashier}</TableCell>
                      <TableCell>{sale.lines.length}</TableCell>
                      <TableCell>{sale.payment}</TableCell>
                      <TableCell align="right">
                        <strong>
                          {formatCurrency(getSaleTotal(sale, products))}
                        </strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            ) : view === 'products' ? (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>PRODUCTO</TableCell>
                    <TableCell>CATEGORÍA</TableCell>
                    <TableCell>FORMA DE VENTA</TableCell>
                    <TableCell align="right">PRECIO</TableCell>
                    <TableCell align="right">
                      {branchId === 'all' ? 'STOCK EN RED' : 'STOCK LOCAL'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleProducts.map((product) => {
                    const quantity =
                      branchId === 'all'
                        ? branches.reduce(
                            (sum, branch) =>
                              sum + product.stockByBranch[branch.id],
                            0,
                          )
                        : product.stockByBranch[branchId]
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className={styles.productCell}>
                            <span className={styles.productMark}>
                              {product.initials}
                            </span>
                            <div>
                              <strong>{product.name}</strong>
                              <small>#{product.code}</small>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.unit === 'kg'
                            ? 'Por peso · kg'
                            : 'Por unidad'}
                        </TableCell>
                        <TableCell align="right">
                          <strong>{formatCurrency(product.price)}</strong> /{' '}
                          {product.unit}
                        </TableCell>
                        <TableCell align="right">
                          {formatQuantity(quantity, product.unit)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </>
            ) : (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell>PRODUCTO</TableCell>
                    {(branchId === 'all'
                      ? branches
                      : branches.filter((branch) => branch.id === branchId)
                    ).map((branch) => (
                      <TableCell key={branch.id} align="right">
                        {branch.shortName.toUpperCase()}
                      </TableCell>
                    ))}
                    <TableCell align="right">PRECIO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className={styles.productCell}>
                          <span className={styles.productMark}>
                            {product.initials}
                          </span>
                          <div>
                            <strong>{product.name}</strong>
                            <small>
                              #{product.code} · {product.category}
                            </small>
                          </div>
                        </div>
                      </TableCell>
                      {(branchId === 'all'
                        ? branches
                        : branches.filter((branch) => branch.id === branchId)
                      ).map((branch) => {
                        const quantity = product.stockByBranch[branch.id]
                        return (
                          <TableCell key={branch.id} align="right">
                            <span
                              className={
                                quantity <= stockLimit(product)
                                  ? styles.low
                                  : styles.available
                              }
                            >
                              {formatQuantity(quantity, product.unit)}
                            </span>
                          </TableCell>
                        )
                      })}
                      <TableCell align="right">
                        {formatCurrency(product.price)} / {product.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
        {view === 'stock' && role === 'owner' && (
          <div className={styles.bottomNote}>
            <Chip size="small" label="Idea para validar" />
            <span>
              Una alerta puede indicar reposición o un posible movimiento desde
              otro local. Aún no registra transferencias.
            </span>
            <Button onClick={() => onBranch('all')}>
              Comparar todos <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </Paper>
      {view === 'products' && role === 'owner' && (
        <Paper className={styles.importNote}>
          <strong>¿Tenés una lista en Excel?</strong>
          <span>
            La importación por archivo será el siguiente paso. Por ahora podés
            cargar productos uno por uno.
          </span>
          <Button disabled>Importar Excel · próximamente</Button>
        </Paper>
      )}
    </div>
  )
}
