import {
  Button,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  LogOut,
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  PackageSearch,
  ReceiptText,
  Store,
  UsersRound,
  FileCheck2,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { Branch, Role, User, View } from '../../types'
import styles from './Sidebar.module.scss'

type NavigationItem = { view: View; label: string; icon: ReactNode }

const ownerItems: NavigationItem[] = [
  {
    view: 'overview',
    label: 'Vista general',
    icon: <ChartNoAxesCombined size={18} />,
  },
  { view: 'branch', label: 'Sucursales', icon: <Store size={18} /> },
  { view: 'sales', label: 'Ventas', icon: <ReceiptText size={18} /> },
  { view: 'products', label: 'Productos', icon: <PackageSearch size={18} /> },
  { view: 'clients', label: 'Clientes', icon: <UsersRound size={18} /> },
  { view: 'stock', label: 'Inventario', icon: <Boxes size={18} /> },
  { view: 'fiscal', label: 'Facturación ARCA', icon: <FileCheck2 size={18} /> },
  {
    view: 'pending',
    label: 'Pendientes de validar',
    icon: <ClipboardList size={18} />,
  },
]

const sellerItems: NavigationItem[] = [
  {
    view: 'overview',
    label: 'Mi mostrador',
    icon: <ChartNoAxesCombined size={18} />,
  },
  { view: 'sales', label: 'Ventas del local', icon: <ReceiptText size={18} /> },
  { view: 'products', label: 'Productos', icon: <PackageSearch size={18} /> },
  { view: 'stock', label: 'Stock del local', icon: <Boxes size={18} /> },
]

interface Props {
  branches: Branch[]
  branchId: string
  role: Role
  user: User
  view: View
  alertCount: number
  onSelect: (view: View) => void
  onLogout: () => void
}

export function Sidebar({
  branches,
  branchId,
  role,
  user,
  view,
  alertCount,
  onSelect,
  onLogout,
}: Props) {
  const items = role === 'owner' ? ownerItems : sellerItems
  const assignedBranch = branches.find((branch) => branch.id === branchId)
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.mark}>
          <span>m</span>
          <i />
        </div>
        <div>
          <strong>mostrador.</strong>
          <small>GESTIÓN PARA COMERCIOS</small>
        </div>
      </div>
      <div className={styles.business}>
        <div className={styles.businessIcon}>LE</div>
        <div>
          <strong>La Esquina</strong>
          <small>Fiambrería · {branches.length} sucursales</small>
        </div>
      </div>
      <div className={styles.navScroll}>
        <span className={styles.navCaption}>
          {role === 'owner' ? 'ADMINISTRACIÓN' : 'OPERACIÓN DEL LOCAL'}
        </span>
        <List className={styles.navList} disablePadding>
          {items.map((item) => (
            <ListItemButton
              key={item.view}
              selected={view === item.view}
              onClick={() => onSelect(item.view)}
              className={styles.navItem}
            >
              <ListItemIcon className={styles.navIcon}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: view === item.view ? 700 : 500,
                }}
              />
              {item.view === 'stock' && alertCount > 0 && (
                <span className={styles.alertCount}>{alertCount}</span>
              )}
            </ListItemButton>
          ))}
        </List>
      </div>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user.name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className={styles.profileText}>
          <strong>{user.name}</strong>
          <small>
            {role === 'owner'
              ? 'Dueño · Todos los locales'
              : `Vendedora · ${assignedBranch?.shortName ?? 'Local'}`}
          </small>
        </div>
        <Chip size="small" label="Demo" className={styles.demoChip} />
      </div>
      <Button
        className={styles.switchButton}
        size="small"
        startIcon={<LogOut size={14} />}
        onClick={onLogout}
      >
        Salir · elegir otro perfil
      </Button>
    </aside>
  )
}
