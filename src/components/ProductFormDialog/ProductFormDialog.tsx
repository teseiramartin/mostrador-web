import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import { Formik, getIn } from 'formik'
import * as yup from 'yup'
import type { CreateProductRequest } from '../../services/types'
import type { Branch, Unit } from '../../types'
import styles from './ProductFormDialog.module.scss'

interface Values {
  name: string
  code: string
  category: string
  unit: Unit
  price: string
  stockByBranch: Record<string, string>
}
interface Props {
  open: boolean
  branches: Branch[]
  pending: boolean
  error: string | null
  onClose: () => void
  onSubmit: (request: CreateProductRequest) => Promise<boolean>
}

export function ProductFormDialog({
  open,
  branches,
  pending,
  error,
  onClose,
  onSubmit,
}: Props) {
  const schema = yup
    .object({
      name: yup.string().trim().required('Ingresá el nombre.'),
      code: yup.string().trim().required('Ingresá un código.'),
      category: yup.string().trim().required('Ingresá la categoría.'),
      unit: yup.string().oneOf(['kg', 'unidad']).required(),
      price: yup
        .number()
        .typeError('Ingresá un precio.')
        .positive('Debe ser mayor que cero.')
        .required('Ingresá el precio.'),
      stockByBranch: yup
        .object()
        .shape(
          Object.fromEntries(
            branches.map((branch) => [
              branch.id,
              yup
                .number()
                .typeError('Ingresá una cantidad.')
                .min(0, 'No puede ser negativa.')
                .required('Ingresá la cantidad.'),
            ]),
          ),
        ),
    })
    .test(
      'whole-unit',
      'Usá un número entero para unidades.',
      function (value) {
        if (value?.unit !== 'unidad') return true
        const branch = branches.find(
          (item) => !Number.isInteger(value.stockByBranch?.[item.id]),
        )
        return branch
          ? this.createError({ path: `stockByBranch.${branch.id}` })
          : true
      },
    )
  const initialValues: Values = {
    name: '',
    code: '',
    category: '',
    unit: 'kg',
    price: '',
    stockByBranch: Object.fromEntries(
      branches.map((branch) => [branch.id, '0']),
    ),
  }
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Nuevo producto</DialogTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={schema}
        onSubmit={async (values) => {
          await onSubmit({
            name: values.name.trim(),
            code: values.code.trim(),
            category: values.category.trim(),
            unit: values.unit,
            price: Number(values.price),
            stockByBranch: Object.fromEntries(
              branches.map((branch) => [
                branch.id,
                Number(values.stockByBranch[branch.id]),
              ]),
            ),
          })
        }}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            <DialogContent className={styles.fields}>
              <p>
                Completá los datos del producto y el stock inicial de cada
                local.
              </p>
              {(['name', 'code', 'category'] as const).map((key) => (
                <TextField
                  key={key}
                  fullWidth
                  name={key}
                  label={
                    { name: 'Nombre', code: 'Código', category: 'Categoría' }[
                      key
                    ]
                  }
                  value={form.values[key]}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={Boolean(form.touched[key] && form.errors[key])}
                  helperText={form.touched[key] && form.errors[key]}
                />
              ))}
              <div className={styles.row}>
                <TextField
                  select
                  fullWidth
                  name="unit"
                  label="Forma de venta"
                  value={form.values.unit}
                  onChange={form.handleChange}
                >
                  <MenuItem value="kg">Por peso · kg</MenuItem>
                  <MenuItem value="unidad">Por unidad</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  name="price"
                  type="number"
                  label="Precio por kg o unidad"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={form.values.price}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={Boolean(form.touched.price && form.errors.price)}
                  helperText={form.touched.price && form.errors.price}
                />
              </div>
              <strong>Stock inicial por sucursal</strong>
              <div className={styles.row}>
                {branches.map((branch) => {
                  const key = `stockByBranch.${branch.id}`
                  return (
                    <TextField
                      key={key}
                      name={key}
                      type="number"
                      label={branch.shortName}
                      inputProps={{
                        min: 0,
                        step: form.values.unit === 'unidad' ? 1 : 0.01,
                      }}
                      value={form.values.stockByBranch[branch.id] ?? '0'}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      error={Boolean(
                        getIn(form.touched, key) && getIn(form.errors, key),
                      )}
                      helperText={
                        getIn(form.touched, key) && getIn(form.errors, key)
                      }
                    />
                  )
                })}
              </div>
              {error && <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions className={styles.actions}>
              <Button onClick={onClose} disabled={pending}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={pending}>
                {pending ? 'Guardando…' : 'Guardar producto'}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}
