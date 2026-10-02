import { Chip, Paper, Typography } from '@mui/material'
import { FileCheck2, ListChecks, ShieldCheck } from 'lucide-react'
import styles from './FiscalPage.module.scss'

export function FiscalPage() {
  return (
    <div className={styles.page}>
      <span className={styles.kicker}>
        PRÓXIMA ETAPA · A DEFINIR CON EL NEGOCIO
      </span>
      <Typography variant="h1">
        Facturación ARCA<span>.</span>
      </Typography>
      <p className={styles.lead}>
        Una opción para emitir comprobantes desde mostrador cuando estén
        definidos el flujo fiscal y la conexión del servidor.
      </p>
      <Paper className={styles.hero}>
        <div className={styles.icon}>
          <FileCheck2 size={26} />
        </div>
        <div>
          <Chip label="Sin conexión activa" size="small" />
          <h2>Preparar la facturación sin complicar el mostrador</h2>
          <p>
            La venta y el comprobante fiscal deben tener estados separados: un
            problema de emisión no debería dejar dudas sobre qué se cobró o qué
            falta resolver.
          </p>
        </div>
      </Paper>
      <div className={styles.grid}>
        <Paper>
          <ListChecks size={22} />
          <h3>Definir el recorrido</h3>
          <p>
            Qué operaciones requieren factura, cuándo se solicita CUIT o DNI y
            quién puede emitir o anular.
          </p>
        </Paper>
        <Paper>
          <ShieldCheck size={22} />
          <h3>Elegir la conexión</h3>
          <p>
            Evaluar integración directa con ARCA o un proveedor especializado.
            Certificados y credenciales vivirán en el backend.
          </p>
        </Paper>
      </div>
      <p className={styles.note}>
        Esta pantalla presenta una posibilidad para validar. No emite
        comprobantes ni consulta servicios fiscales.
      </p>
    </div>
  )
}
