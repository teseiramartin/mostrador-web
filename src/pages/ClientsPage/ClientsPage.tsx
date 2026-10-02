import {
  Alert,
  Button,
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
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import type { Client } from '../../types'
import styles from './ClientsPage.module.scss'

interface Props {
  clients: Client[]
  pending: boolean
  error: string | null
  onNewClient: () => void
}
export function ClientsPage({ clients, pending, error, onNewClient }: Props) {
  const [query, setQuery] = useState('')
  const visible = clients.filter((client) =>
    `${client.name} ${client.document} ${client.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  return (
    <div className={styles.page}>
      {error && <Alert severity="error">{error}</Alert>}
      <div className={styles.heading}>
        <div>
          <span>GESTIÓN · RED DE LOCALES</span>
          <Typography variant="h1">
            Clientes<span>.</span>
          </Typography>
          <p>Datos de contacto para atender mejor cada operación.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus size={17} />}
          onClick={onNewClient}
        >
          Nuevo cliente
        </Button>
      </div>
      <Paper className={styles.panel}>
        <div className={styles.toolbar}>
          <div>
            <Typography variant="h2">Directorio de clientes</Typography>
            <p>
              {pending
                ? 'Cargando…'
                : `${clients.length} clientes registrados en esta demostración.`}
            </p>
          </div>
          <TextField
            size="small"
            placeholder="Buscar nombre, documento o correo"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            InputProps={{ startAdornment: <Search size={17} /> }}
          />
        </div>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>CLIENTE</TableCell>
                <TableCell>DOCUMENTO</TableCell>
                <TableCell>CORREO</TableCell>
                <TableCell>TELÉFONO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <strong>{client.name}</strong>
                  </TableCell>
                  <TableCell>{client.document || '—'}</TableCell>
                  <TableCell>{client.email || '—'}</TableCell>
                  <TableCell>{client.phone || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!pending && visible.length === 0 && (
          <p className={styles.empty}>
            No hay clientes que coincidan con la búsqueda.
          </p>
        )}
      </Paper>
      <Paper className={styles.importNote}>
        <strong>Importar clientes desde Excel</strong>
        <span>
          Previsto para una próxima etapa. Por ahora podés cargarlos
          manualmente.
        </span>
        <Button disabled>Importar Excel · próximamente</Button>
      </Paper>
    </div>
  )
}
