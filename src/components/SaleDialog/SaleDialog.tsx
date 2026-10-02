import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { Check, Plus, Search, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import type { Branch, Product, Sale, SaleLine } from '../../types'
import { formatCurrency, formatQuantity } from '../../utils/format'
import styles from './SaleDialog.module.scss'

interface Props {
  branches: Branch[]
  pending: boolean
  open: boolean
  branchId: string
  products: Product[]
  onClose: () => void
  onConfirm: (lines: SaleLine[], payment: Sale['payment']) => Promise<boolean>
}

export function SaleDialog({
  branches,
  pending,
  open,
  branchId,
  products,
  onClose,
  onConfirm,
}: Props) {
  const [query, setQuery] = useState('')
  const [lines, setLines] = useState<SaleLine[]>([])
  const [payment, setPayment] = useState<Sale['payment']>('Efectivo')
  const branch = branches.find((item) => item.id === branchId)!
  const filtered = products.filter((product) =>
    `${product.name} ${product.category} ${product.code}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const total = lines.reduce(
    (sum, line) =>
      sum +
      (products.find((product) => product.id === line.productId)?.price ?? 0) *
        line.quantity,
    0,
  )
  const valid =
    lines.length > 0 &&
    lines.every((line) => {
      const product = products.find((item) => item.id === line.productId)
      return (
        Boolean(product) &&
        line.quantity > 0 &&
        line.quantity <= (product?.stockByBranch[branchId] ?? 0) &&
        (product?.unit !== 'unidad' || Number.isInteger(line.quantity))
      )
    })
  const add = (product: Product) => {
    const increment = product.unit === 'kg' ? 0.25 : 1
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id)
      const quantity =
        Math.round(((existing?.quantity ?? 0) + increment) * 100) / 100
      if (quantity > product.stockByBranch[branchId]) return current
      return existing
        ? current.map((line) =>
            line.productId === product.id ? { ...line, quantity } : line,
          )
        : [...current, { productId: product.id, quantity }]
    })
  }
  const setQuantity = (productId: string, raw: string) => {
    const product = products.find((item) => item.id === productId)!
    const requested = Math.min(
      product.stockByBranch[branchId],
      Math.max(0, Number(raw) || 0),
    )
    const quantity =
      product.unit === 'unidad'
        ? Math.trunc(requested)
        : Math.round(requested * 100) / 100
    setLines((current) =>
      current.map((line) =>
        line.productId === productId ? { ...line, quantity } : line,
      ),
    )
  }
  const close = () => {
    setLines([])
    setQuery('')
    setPayment('Efectivo')
    onClose()
  }
  const confirm = async () => {
    if (!valid || pending) return
    if (await onConfirm(lines, payment)) {
      setLines([])
      setQuery('')
      setPayment('Efectivo')
    }
  }
  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="md"
      PaperProps={{ className: styles.dialog }}
    >
      <DialogTitle className={styles.titleRow}>
        <div>
          <span>OPERACIÓN EN {branch.name.toUpperCase()}</span>
          <Typography variant="h2">
            Nueva venta<span>.</span>
          </Typography>
        </div>
        <IconButton aria-label="Cerrar" onClick={close}>
          <X size={19} />
        </IconButton>
      </DialogTitle>
      <DialogContent className={styles.content}>
        <div className={styles.columns}>
          <section className={styles.catalog}>
            <TextField
              fullWidth
              autoFocus
              placeholder="Buscar nombre, código o categoría"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} />
                  </InputAdornment>
                ),
              }}
            />
            <span className={styles.columnLabel}>CATÁLOGO DISPONIBLE</span>
            <div className={styles.catalogList}>
              {filtered.map((product) => (
                <button
                  key={product.id}
                  className={styles.productButton}
                  onClick={() => add(product)}
                  disabled={product.stockByBranch[branchId] <= 0}
                >
                  <span className={styles.productMark}>{product.initials}</span>
                  <span className={styles.productDescription}>
                    <strong>{product.name}</strong>
                    <small>
                      {formatCurrency(product.price)} / {product.unit} ·{' '}
                      {formatQuantity(
                        product.stockByBranch[branchId],
                        product.unit,
                      )}{' '}
                      disponibles
                    </small>
                  </span>
                  <Plus size={17} />
                </button>
              ))}
            </div>
          </section>
          <section className={styles.cart}>
            <div className={styles.cartHeading}>
              <div>
                <span>RESUMEN</span>
                <Typography variant="h3">La venta actual</Typography>
              </div>
              <Chip
                size="small"
                label={`${lines.length} artículo${lines.length === 1 ? '' : 's'}`}
              />
            </div>
            <div className={styles.cartLines}>
              {lines.length === 0 ? (
                <div className={styles.emptyCart}>
                  <span>＋</span>
                  <strong>Empezá por un producto.</strong>
                  <p>Agregá desde el catálogo de la izquierda.</p>
                </div>
              ) : (
                lines.map((line) => {
                  const product = products.find(
                    (item) => item.id === line.productId,
                  )!
                  return (
                    <div className={styles.line} key={line.productId}>
                      <div>
                        <strong>{product.name}</strong>
                        <small>
                          {formatCurrency(product.price)} / {product.unit}
                        </small>
                      </div>
                      <div className={styles.lineControls}>
                        <TextField
                          aria-label={`Cantidad de ${product.name}`}
                          type="number"
                          size="small"
                          value={line.quantity}
                          onChange={(event) =>
                            setQuantity(product.id, event.target.value)
                          }
                          inputProps={{
                            min: product.unit === 'kg' ? 0.05 : 1,
                            max: product.stockByBranch[branchId],
                            step: product.unit === 'kg' ? 0.05 : 1,
                          }}
                        />
                        <span>{product.unit}</span>
                        <IconButton
                          aria-label={`Quitar ${product.name}`}
                          size="small"
                          onClick={() =>
                            setLines((current) =>
                              current.filter(
                                (item) => item.productId !== product.id,
                              ),
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                      <strong className={styles.lineTotal}>
                        {formatCurrency(product.price * line.quantity)}
                      </strong>
                    </div>
                  )
                })
              )}
            </div>
            <Divider />
            <div className={styles.payment}>
              <span>MEDIO DE PAGO</span>
              <ToggleButtonGroup
                exclusive
                fullWidth
                size="small"
                value={payment}
                onChange={(_, value: Sale['payment'] | null) =>
                  value && setPayment(value)
                }
              >
                {(['Efectivo', 'Débito', 'Transferencia'] as const).map(
                  (method) => (
                    <ToggleButton key={method} value={method}>
                      {method}
                    </ToggleButton>
                  ),
                )}
              </ToggleButtonGroup>
            </div>
            <div className={styles.total}>
              <span>Total de la venta</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!valid || pending}
              startIcon={<Check size={18} />}
              onClick={confirm}
            >
              {pending ? 'Registrando...' : 'Registrar venta simulada'}
            </Button>
            <small className={styles.footnote}>
              Actualiza las ventas y el stock local de esta demo. No cobra
              dinero.
            </small>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
