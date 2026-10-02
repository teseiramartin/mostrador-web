import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Snackbar,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { SaleDialog } from '../components/SaleDialog/SaleDialog'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'
import { BranchDashboard } from '../pages/BranchDashboard/BranchDashboard'
import { DataPage } from '../pages/DataPage/DataPage'
import { OwnerDashboard } from '../pages/OwnerDashboard/OwnerDashboard'
import { PendingPage } from '../pages/PendingPage/PendingPage'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { loadCatalog } from '../state/modules/catalog'
import { createSale, loadSales } from '../state/modules/sales'
import { setBranch, setRole } from '../state/modules/session'
import type { Role, Sale, SaleLine, View } from '../types'
import { getStockAlerts } from '../utils/business'
import styles from './App.module.scss'

const pageTitle: Record<View, string> = {
  overview: 'Vista general',
  branch: 'Sucursal',
  sales: 'Ventas',
  products: 'Productos',
  stock: 'Inventario',
  pending: 'Pendientes de validar',
}

export default function App() {
  const dispatch = useAppDispatch()
  const { role, branchId } = useAppSelector((state) => state.session)
  const {
    branches,
    products,
    loaded: catalogLoaded,
    pending: catalogPending,
    error: catalogError,
  } = useAppSelector((state) => state.catalog)
  const {
    items: sales,
    loaded: salesLoaded,
    pending: salesPending,
    pendingCreate,
    error: salesError,
  } = useAppSelector((state) => state.sales)
  const [view, setView] = useState<View>('overview')
  const [saleOpen, setSaleOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notice, setNotice] = useState<{
    text: string
    severity: 'success' | 'error'
  } | null>(null)
  useEffect(() => {
    void dispatch(loadCatalog())
    void dispatch(loadSales())
  }, [dispatch])
  const alertCount = getStockAlerts(
    products,
    branches,
    role === 'seller' ? branchId : undefined,
  ).length

  const selectView = (next: View) => {
    if (role === 'seller' && (next === 'pending' || next === 'branch')) return
    if (next === 'branch' && branchId === 'all') dispatch(setBranch('centro'))
    setView(next)
    setMobileOpen(false)
  }

  const switchRole = () => {
    const next: Role = role === 'owner' ? 'seller' : 'owner'
    dispatch(setRole(next))
    setView('overview')
    setMobileOpen(false)
    setSaleOpen(false)
    setNotice({
      severity: 'success',
      text:
        next === 'owner'
          ? 'Vista de demostración: dueño'
          : 'Vista de demostración: vendedor de Centro',
    })
  }

  const selectBranch = (next: string) => {
    if (role !== 'owner') return
    dispatch(setBranch(next))
    if (view === 'overview' || view === 'branch')
      setView(next === 'all' ? 'overview' : 'branch')
  }

  const registerSale = async (
    lines: SaleLine[],
    payment: Sale['payment'],
  ): Promise<boolean> => {
    if (role !== 'seller') return false
    try {
      const sale = await dispatch(
        createSale({ branchId, cashier: 'Lucía Fernández', payment, lines }),
      )
      setSaleOpen(false)
      setView('sales')
      setNotice({
        text: `Venta ${sale.id} registrada; stock del local actualizado.`,
        severity: 'success',
      })
      return true
    } catch (error) {
      setNotice({
        text:
          error instanceof Error
            ? error.message
            : 'No se pudo registrar la venta.',
        severity: 'error',
      })
      return false
    }
  }

  const content =
    !catalogLoaded || !salesLoaded ? (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 360 }}>
        {catalogError || salesError ? (
          <Alert
            severity="error"
            action={
              <Button
                onClick={() => {
                  void dispatch(loadCatalog())
                  void dispatch(loadSales())
                }}
              >
                Reintentar
              </Button>
            }
          >
            {catalogError || salesError}
          </Alert>
        ) : catalogPending || salesPending ? (
          <CircularProgress />
        ) : null}
      </Box>
    ) : role === 'owner' && view === 'overview' ? (
      <OwnerDashboard
        branches={branches}
        products={products}
        sales={sales}
        onBranch={(id) => {
          dispatch(setBranch(id))
          setView('branch')
        }}
        onNavigate={selectView}
      />
    ) : (role === 'seller' && view === 'overview') || view === 'branch' ? (
      <BranchDashboard
        branches={branches}
        role={role}
        branchId={branchId}
        products={products}
        sales={sales}
        onBack={() => selectBranch('all')}
        onNewSale={() => setSaleOpen(true)}
        onNavigate={selectView}
      />
    ) : view === 'pending' ? (
      <PendingPage />
    ) : (
      <DataPage
        branches={branches}
        view={view as 'sales' | 'products' | 'stock'}
        role={role}
        branchId={branchId}
        products={products}
        sales={sales}
        onNewSale={() => setSaleOpen(true)}
        onBranch={selectBranch}
      />
    )

  const sidebar = (
    <Sidebar
      branches={branches}
      branchId={branchId}
      role={role}
      view={view}
      alertCount={alertCount}
      onSelect={selectView}
      onSwitchRole={switchRole}
    />
  )
  return (
    <div className={styles.shell}>
      <div className={styles.desktopSidebar}>{sidebar}</div>
      <Drawer
        className={styles.mobileDrawer}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 248, height: '100dvh', overflow: 'hidden' },
        }}
      >
        {sidebar}
      </Drawer>
      <div className={styles.main}>
        <Topbar
          branches={branches}
          role={role}
          branchId={branchId}
          title={
            role === 'seller' && view === 'overview'
              ? 'Mi mostrador'
              : pageTitle[view]
          }
          alertCount={alertCount}
          onBranchChange={selectBranch}
          onMenuOpen={() => setMobileOpen(true)}
          onAlerts={() => selectView('stock')}
          onSwitchRole={switchRole}
        />
        <main className={styles.scrollArea}>
          <div className={styles.content}>
            {content}
            <footer className={styles.footer}>
              <span>MOSTRADOR · PROTOTIPO PARA CONVERSAR</span>
              <span>DATOS DE EJEMPLO · SIN CONEXIÓN A UNA CAJA REAL</span>
            </footer>
          </div>
        </main>
      </div>
      {catalogLoaded && branches.length > 0 && (
        <SaleDialog
          branches={branches}
          pending={pendingCreate}
          open={saleOpen}
          branchId={branchId === 'all' ? branches[0].id : branchId}
          products={products}
          onClose={() => setSaleOpen(false)}
          onConfirm={registerSale}
        />
      )}
      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={4300}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotice(null)}
          severity={notice?.severity ?? 'success'}
          variant="filled"
        >
          {notice?.text}
        </Alert>
      </Snackbar>
    </div>
  )
}
