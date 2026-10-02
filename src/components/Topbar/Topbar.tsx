import {
  Badge,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material'
import { Bell, ChevronDown, LogOut, Menu, Store } from 'lucide-react'
import type { Branch, Role } from '../../types'
import styles from './Topbar.module.scss'

interface Props {
  branches: Branch[]
  role: Role
  branchId: string
  title: string
  alertCount: number
  onBranchChange: (id: string) => void
  onMenuOpen: () => void
  onAlerts: () => void
  onLogout: () => void
}

export function Topbar({
  branches,
  role,
  branchId,
  title,
  alertCount,
  onBranchChange,
  onMenuOpen,
  onAlerts,
  onLogout,
}: Props) {
  const active = branches.find((branch) => branch.id === branchId)
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <IconButton
          className={styles.mobileMenu}
          aria-label="Abrir menú"
          onClick={onMenuOpen}
        >
          <Menu size={20} />
        </IconButton>
        <span className={styles.business}>La Esquina</span>
        <span className={styles.slash}>/</span>
        <strong>{title}</strong>
      </div>
      <div className={styles.actions}>
        <span className={styles.demoLabel}>ENTORNO DE PRUEBA</span>
        {role === 'owner' ? (
          <FormControl size="small" className={styles.branchControl}>
            <Select
              value={branchId}
              onChange={(event: SelectChangeEvent) =>
                onBranchChange(event.target.value)
              }
              displayEmpty
              aria-label="Seleccionar sucursal"
              IconComponent={ChevronDown}
            >
              <MenuItem value="all">Todas las sucursales</MenuItem>
              {branches.map((branch) => (
                <MenuItem value={branch.id} key={branch.id}>
                  {branch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <span className={styles.fixedBranch}>
            <Store size={15} /> {active?.name}
          </span>
        )}
        <IconButton
          className={styles.notification}
          aria-label={`${alertCount} ${alertCount === 1 ? 'alerta' : 'alertas'} de stock`}
          onClick={onAlerts}
        >
          <Badge badgeContent={alertCount} color="secondary">
            <Bell size={18} />
          </Badge>
        </IconButton>
        <Button
          className={styles.roleButton}
          variant="outlined"
          onClick={onLogout}
        >
          Salir <LogOut size={14} />
        </Button>
      </div>
    </header>
  )
}
