import { Button, Chip, Paper, Typography } from '@mui/material'
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CircleAlert,
  MoveRight,
  Store,
  TrendingUp,
} from 'lucide-react'
import type { Branch, Product, Sale, View } from '../../types'
import {
  getSalesSummary,
  getStockAlerts,
  getTransferSuggestion,
} from '../../utils/business'
import { formatCurrency, formatQuantity } from '../../utils/format'
import styles from './OwnerDashboard.module.scss'

interface Props {
  branches: Branch[]
  products: Product[]
  sales: Sale[]
  onBranch: (id: string) => void
  onNavigate: (view: View) => void
}

export function OwnerDashboard({
  branches,
  products,
  sales,
  onBranch,
  onNavigate,
}: Props) {
  const network = getSalesSummary(sales, products)
  const alerts = getStockAlerts(products, branches)
  const suggestion = getTransferSuggestion(products, branches)
  const branchRows = branches.map((branch) => ({
    branch,
    ...getSalesSummary(sales, products, branch.id),
    alerts: getStockAlerts(products, branches, branch.id).length,
  }))
  const highest = Math.max(...branchRows.map((row) => row.total), 1)
  const date = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div>
          <span className={styles.kicker}>
            VISTA DEL DUEÑO <span /> {date.toLocaleUpperCase('es-AR')}
          </span>
          <Typography variant="h1" className={styles.title}>
            El pulso de <em>La Esquina.</em>
          </Typography>
          <p>
            {branches.length} locales, una mirada clara de la jornada. Elegí
            dónde actuar primero.
          </p>
        </div>
        <Button
          variant="outlined"
          className={styles.pendingButton}
          onClick={() => onNavigate('pending')}
        >
          Pendientes de validar <ArrowUpRight size={16} />
        </Button>
      </div>

      <section className={styles.hero} aria-label="Resumen de la jornada">
        <div className={styles.heroPrimary}>
          <span className={styles.heroEyebrow}>
            VENTAS DE TODOS LOS LOCALES
          </span>
          <strong>{formatCurrency(network.total)}</strong>
          <span className={styles.heroCaption}>
            Importe de {network.count} ventas registradas en la demo
          </span>
          <div className={styles.heroDashes}>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className={styles.heroSecondary}>
          <div>
            <span>Ticket promedio</span>
            <strong>{formatCurrency(network.average)}</strong>
            <small>Total ÷ {network.count} operaciones</small>
          </div>
          <div>
            <span>Atención de stock</span>
            <strong>
              {alerts.length} <small>productos</small>
            </strong>
            <small>Con nivel bajo en algún local</small>
          </div>
        </div>
        <span className={styles.heroWatermark}>
          {String(branches.length).padStart(2, '0')}
        </span>
      </section>

      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.sectionKicker}>01 / COMPARAR</span>
          <Typography variant="h2">Cada sucursal, en contexto</Typography>
          <p>Los importes y promedios salen de las mismas ventas de ejemplo.</p>
        </div>
        <Button variant="text" onClick={() => onNavigate('sales')}>
          Ver todas las ventas <ArrowRight size={16} />
        </Button>
      </div>
      <div className={styles.branchGrid}>
        {branchRows.map((row, index) => (
          <Paper
            key={row.branch.id}
            component="button"
            className={`${styles.branchCard} ${styles[`tone${index}`]}`}
            onClick={() => onBranch(row.branch.id)}
          >
            <div className={styles.branchTop}>
              <span className={styles.branchIndex}>
                {row.branch.code} / LOCAL
              </span>
              <ArrowUpRight size={18} />
            </div>
            <div className={styles.branchIdentity}>
              <span className={styles.branchSymbol}>
                <Store size={18} />
              </span>
              <div>
                <strong>{row.branch.shortName}</strong>
                <small>{row.branch.address}</small>
              </div>
            </div>
            <strong className={styles.branchAmount}>
              {formatCurrency(row.total)}
            </strong>
            <div className={styles.barTrack}>
              <i
                style={{
                  width: `${Math.max(8, (row.total / highest) * 100)}%`,
                }}
              />
            </div>
            <div className={styles.branchFoot}>
              <span>
                {row.count} ventas <b>·</b> ticket {formatCurrency(row.average)}
              </span>
              {row.alerts > 0 && (
                <span className={styles.branchAlert}>
                  {row.alerts} alerta{row.alerts > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </Paper>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <section className={styles.attention}>
          <div className={styles.panelTop}>
            <div>
              <span className={styles.sectionKicker}>02 / REVISAR</span>
              <Typography variant="h2">Lo que necesita atención</Typography>
            </div>
            <span className={styles.countBubble}>{alerts.length}</span>
          </div>
          <p className={styles.panelLead}>
            Stock por debajo del mínimo de muestra en cada local.
          </p>
          <div className={styles.alertList}>
            {alerts.slice(0, 4).map(({ product, branch, quantity }) => (
              <div
                className={styles.alertRow}
                key={`${branch.id}-${product.id}`}
              >
                <div className={styles.alertIcon}>
                  <CircleAlert size={17} />
                </div>
                <div>
                  <strong>{product.name}</strong>
                  <small>
                    {branch.name} · {product.category}
                  </small>
                </div>
                <Chip
                  className={styles.quantityChip}
                  label={formatQuantity(quantity, product.unit)}
                  size="small"
                />
              </div>
            ))}
          </div>
          <Button variant="text" onClick={() => onNavigate('stock')}>
            Abrir inventario <ArrowRight size={16} />
          </Button>
        </section>
        <section className={styles.opportunity}>
          <div className={styles.opportunityIcon}>
            <TrendingUp size={21} />
          </div>
          <span className={styles.sectionKicker}>
            03 / UNA OPORTUNIDAD PARA REVISAR
          </span>
          <Typography variant="h2">
            El stock también cuenta una historia.
          </Typography>
          {suggestion ? (
            <>
              <p>
                <strong>{suggestion.alert.branch.shortName}</strong> tiene{' '}
                {formatQuantity(
                  suggestion.alert.quantity,
                  suggestion.alert.product.unit,
                )}{' '}
                de {suggestion.alert.product.name.toLowerCase()}.{' '}
                <strong>{suggestion.source.shortName}</strong> muestra{' '}
                {formatQuantity(
                  suggestion.available,
                  suggestion.alert.product.unit,
                )}
                .
              </p>
              <div className={styles.opportunityRoute}>
                <span>{suggestion.source.shortName}</span>
                <MoveRight size={19} />
                <span>{suggestion.alert.branch.shortName}</span>
              </div>
              <Button
                variant="contained"
                className={styles.opportunityButton}
                onClick={() => onNavigate('stock')}
              >
                Comparar existencias <ArrowRight size={15} />
              </Button>
              <small>
                Posible redistribución para conversar; no genera movimientos.
              </small>
            </>
          ) : (
            <>
              <p>
                Por ahora no hay un local con stock bajo que coincida con
                disponibilidad alta en otro.
              </p>
              <Button
                variant="contained"
                className={styles.opportunityButton}
                onClick={() => onNavigate('stock')}
              >
                Ver inventario <ArrowRight size={15} />
              </Button>
            </>
          )}
          <Boxes className={styles.opportunityBackground} size={150} />
        </section>
      </div>
    </div>
  )
}
