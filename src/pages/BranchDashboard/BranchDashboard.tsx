import {
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Plus,
  ReceiptText,
  Store,
} from 'lucide-react'
import type { Branch, Product, Role, Sale, View } from '../../types'
import {
  getSaleTotal,
  getSalesSummary,
  getStockAlerts,
} from '../../utils/business'
import { formatCurrency, formatQuantity } from '../../utils/format'
import styles from './BranchDashboard.module.scss'

interface Props {
  branches: Branch[]
  role: Role
  branchId: string
  products: Product[]
  sales: Sale[]
  onBack: () => void
  onNewSale: () => void
  onNavigate: (view: View) => void
}

export function BranchDashboard({
  branches,
  role,
  branchId,
  products,
  sales,
  onBack,
  onNewSale,
  onNavigate,
}: Props) {
  const branch = branches.find((item) => item.id === branchId)!
  const summary = getSalesSummary(sales, products, branchId)
  const alerts = getStockAlerts(products, branches, branchId)
  const recent = sales.filter((sale) => sale.branchId === branchId).slice(0, 5)
  return (
    <div className={styles.page}>
      {role === 'owner' && (
        <Button
          className={styles.back}
          size="small"
          startIcon={<ArrowLeft size={15} />}
          onClick={onBack}
        >
          Todas las sucursales
        </Button>
      )}
      <div className={styles.heading}>
        <div>
          <span className={styles.eyebrow}>
            {role === 'owner'
              ? `LOCAL ${branch.code} · DETALLE DE SUCURSAL`
              : 'PERFIL VENDEDOR · TU LOCAL'}
          </span>
          <Typography variant="h1">
            {role === 'owner' ? branch.name : 'Listos para atender.'}
          </Typography>
          <p>
            {role === 'owner'
              ? branch.address
              : `Estás operando en ${branch.name}. ${branch.address}.`}
          </p>
        </div>
        {role === 'seller' && (
          <Button
            variant="contained"
            startIcon={<Plus size={17} />}
            onClick={onNewSale}
          >
            Nueva venta
          </Button>
        )}
      </div>
      <section className={styles.summary}>
        <div className={styles.primaryMetric}>
          <span>VENTAS DE LA JORNADA</span>
          <strong>{formatCurrency(summary.total)}</strong>
          <small>
            {summary.count} operaciones en {branch.shortName}
          </small>
        </div>
        <div className={styles.secondaryMetric}>
          <ReceiptText size={20} />
          <span>Ticket promedio</span>
          <strong>{formatCurrency(summary.average)}</strong>
          <small>Total de ventas ÷ operaciones</small>
        </div>
        <div className={styles.secondaryMetric}>
          <CircleAlert size={20} />
          <span>Stock a revisar</span>
          <strong>
            {alerts.length} producto{alerts.length === 1 ? '' : 's'}
          </strong>
          <small>Con nivel bajo en este local</small>
        </div>
      </section>
      <div className={styles.columns}>
        <Paper className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span>MOVIMIENTO RECIENTE</span>
              <Typography variant="h2">Últimas ventas</Typography>
            </div>
            <Button onClick={() => onNavigate('sales')}>
              Ver historial <ArrowRight size={15} />
            </Button>
          </div>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>VENTA</TableCell>
                  <TableCell>HORARIO</TableCell>
                  <TableCell>MEDIO</TableCell>
                  <TableCell align="right">IMPORTE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recent.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <strong>{sale.id}</strong>
                    </TableCell>
                    <TableCell>{sale.time}</TableCell>
                    <TableCell>{sale.payment}</TableCell>
                    <TableCell align="right">
                      <strong>
                        {formatCurrency(getSaleTotal(sale, products))}
                      </strong>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span>INVENTARIO DEL LOCAL</span>
              <Typography variant="h2">Para reponer</Typography>
            </div>
            <Store size={18} />
          </div>
          {alerts.length ? (
            alerts.map(({ product, quantity }) => (
              <div className={styles.alertLine} key={product.id}>
                <span className={styles.productIcon}>{product.initials}</span>
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>
                <Chip
                  size="small"
                  label={formatQuantity(quantity, product.unit)}
                  className={styles.alertChip}
                />
              </div>
            ))
          ) : (
            <p className={styles.empty}>
              Por ahora no hay productos bajo el mínimo de muestra.
            </p>
          )}
          <Button onClick={() => onNavigate('stock')}>
            Ver stock del local <ArrowRight size={15} />
          </Button>
        </Paper>
      </div>
      {role === 'seller' && (
        <div className={styles.roleNotice}>
          Los permisos mostrados aquí son una propuesta de interfaz. El acceso
          real se definirá con el backend.
        </div>
      )}
    </div>
  )
}
