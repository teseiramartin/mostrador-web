import { Chip, Paper, Typography } from '@mui/material'
import { CircleHelp, LockKeyhole, Scale, Store, WifiOff } from 'lucide-react'
import type { ReactNode } from 'react'
import styles from './PendingPage.module.scss'

const topics: {
  icon: ReactNode
  title: string
  question: string
  detail: string
}[] = [
  {
    icon: <Store size={19} />,
    title: 'Movimiento entre sucursales',
    question: '¿Compran por local o existe un depósito central?',
    detail:
      'También hay que acordar quién autoriza y registra una transferencia.',
  },
  {
    icon: <Scale size={19} />,
    title: 'Venta por peso',
    question: '¿El peso se ingresa a mano o llega desde una balanza?',
    detail:
      'La demo carga kilos manualmente; el hardware real requiere conocer el equipo.',
  },
  {
    icon: <LockKeyhole size={19} />,
    title: 'Usuarios y permisos',
    question: '¿Qué puede ver o cambiar el dueño, un encargado y un vendedor?',
    detail:
      'Los dos perfiles actuales son una propuesta visual. Los permisos reales necesitan backend.',
  },
  {
    icon: <WifiOff size={19} />,
    title: 'Trabajo sin internet',
    question: '¿Qué necesita seguir funcionando si se corta la conexión?',
    detail: 'Afecta el diseño de ventas, stock y sincronización entre locales.',
  },
]

export function PendingPage() {
  return (
    <div className={styles.page}>
      <span className={styles.eyebrow}>PARA CONVERSAR CON MABEL Y KIKE</span>
      <Typography variant="h1">
        Pendientes de validar<span>.</span>
      </Typography>
      <p className={styles.lead}>
        Estas decisiones pueden cambiar el alcance de la primera versión. Están
        fuera del tablero operativo para que la demo muestre el trabajo diario.
      </p>
      <div className={styles.grid}>
        {topics.map((topic, index) => (
          <Paper key={topic.title} className={styles.card}>
            <div className={styles.top}>
              <span className={styles.icon}>{topic.icon}</span>
              <small>0{index + 1}</small>
            </div>
            <Typography variant="h2">{topic.title}</Typography>
            <strong>{topic.question}</strong>
            <p>{topic.detail}</p>
            <Chip label="Por definir" size="small" />
          </Paper>
        ))}
      </div>
      <div className={styles.footer}>
        <CircleHelp size={17} />
        <span>
          También falta decidir si la primera entrega emite comprobantes
          fiscales o se integra más adelante con otra herramienta.
        </span>
      </div>
    </div>
  )
}
