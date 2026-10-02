import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import type { CreateClientRequest } from '../../services/types'
import styles from './ClientFormDialog.module.scss'

const schema = yup.object({
  name: yup.string().trim().required('Ingresá el nombre o razón social.'),
  document: yup.string(),
  email: yup.string().email('Ingresá un correo válido.'),
  phone: yup.string(),
})
interface Props {
  open: boolean
  pending: boolean
  error: string | null
  onClose: () => void
  onSubmit: (request: CreateClientRequest) => Promise<boolean>
}

export function ClientFormDialog({
  open,
  pending,
  error,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Nuevo cliente</DialogTitle>
      <Formik
        initialValues={{ name: '', document: '', email: '', phone: '' }}
        validationSchema={schema}
        onSubmit={async (values) => {
          await onSubmit({
            name: values.name.trim(),
            document: values.document.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
          })
        }}
      >
        {(form) => (
          <form onSubmit={form.handleSubmit}>
            <DialogContent className={styles.fields}>
              <p>
                Estos datos sirven para identificar al cliente en la demo. Los
                datos fiscales se definirán antes de emitir comprobantes.
              </p>
              <TextField
                fullWidth
                name="name"
                label="Nombre o razón social"
                value={form.values.name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={Boolean(form.touched.name && form.errors.name)}
                helperText={form.touched.name && form.errors.name}
              />
              <TextField
                fullWidth
                name="document"
                label="DNI o CUIT (opcional)"
                value={form.values.document}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <TextField
                fullWidth
                name="email"
                label="Correo (opcional)"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={Boolean(form.touched.email && form.errors.email)}
                helperText={form.touched.email && form.errors.email}
              />
              <TextField
                fullWidth
                name="phone"
                label="Teléfono (opcional)"
                value={form.values.phone}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              {error && <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions className={styles.actions}>
              <Button onClick={onClose} disabled={pending}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={pending}>
                {pending ? 'Guardando…' : 'Guardar cliente'}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}
