import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import type { LoginRequest } from '../../services/types'
import styles from './LoginPage.module.scss'

const schema = yup.object({
  email: yup
    .string()
    .email('Ingresá un correo válido.')
    .required('Ingresá el correo.'),
  password: yup.string().required('Ingresá la contraseña.'),
})

interface Props {
  pending: boolean
  error: string | null
  onLogin: (request: LoginRequest) => Promise<void>
}

export function LoginPage({ pending, error, onLogin }: Props) {
  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <span className={styles.kicker}>MOSTRADOR · ACCESO DE PRUEBA</span>
        <h1>
          El negocio, claro
          <br />
          <em>desde el primer vistazo.</em>
        </h1>
        <p>
          Ventas, productos e inventario en un mismo lugar. Elegí un perfil para
          recorrer esta versión con datos de ejemplo.
        </p>
        <div className={styles.stat}>
          <strong>3</strong>
          <span>
            sucursales conectadas
            <br />
            en esta demostración
          </span>
        </div>
      </section>
      <section className={styles.formSide}>
        <div className={styles.brand}>
          <span className={styles.mark}>m</span>
          <strong>
            mostrador<span>.</span>
          </strong>
        </div>
        <Paper className={styles.card} elevation={0}>
          <span className={styles.kicker}>BIENVENIDO</span>
          <h2>Ingresá a tu espacio</h2>
          <p>
            Las primeras cuentas las crea el equipo de mostrador. No necesitás
            registrarte.
          </p>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={schema}
            onSubmit={async (values) => {
              try {
                await onLogin(values)
              } catch {
                /* El error se muestra desde Redux. */
              }
            }}
          >
            {(form) => (
              <form onSubmit={form.handleSubmit} className={styles.form}>
                <TextField
                  fullWidth
                  name="email"
                  label="Correo electrónico"
                  autoComplete="username"
                  value={form.values.email}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={Boolean(form.touched.email && form.errors.email)}
                  helperText={form.touched.email && form.errors.email}
                />
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Contraseña"
                  autoComplete="current-password"
                  value={form.values.password}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={Boolean(form.touched.password && form.errors.password)}
                  helperText={form.touched.password && form.errors.password}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={pending}
                  fullWidth
                >
                  {pending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Ingresar'
                  )}
                </Button>
                <div className={styles.demoAccounts}>
                  <small>ACCESOS DE DEMOSTRACIÓN · CLAVE: demo1234</small>
                  <Button
                    type="button"
                    onClick={() => {
                      void form.setValues({
                        email: 'dueno@mostrador.demo',
                        password: 'demo1234',
                      })
                    }}
                  >
                    Usar perfil dueño
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      void form.setValues({
                        email: 'vendedor@mostrador.demo',
                        password: 'demo1234',
                      })
                    }}
                  >
                    Usar perfil vendedor
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Paper>
        <span className={styles.disclaimer}>
          Prototipo con datos ficticios · Sin autenticación real
        </span>
      </section>
    </main>
  )
}
