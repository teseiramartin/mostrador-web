import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Snackbar,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { ClientFormDialog } from '../components/ClientFormDialog/ClientFormDialog'
import { ProductFormDialog } from '../components/ProductFormDialog/ProductFormDialog'
import { SaleDialog } from '../components/SaleDialog/SaleDialog'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'
import { BranchDashboard } from '../pages/BranchDashboard/BranchDashboard'
import { ClientsPage } from '../pages/ClientsPage/ClientsPage'
import { DataPage } from '../pages/DataPage/DataPage'
import { FiscalPage } from '../pages/FiscalPage/FiscalPage'
import { LoginPage } from '../pages/LoginPage/LoginPage'
import { OwnerDashboard } from '../pages/OwnerDashboard/OwnerDashboard'
import { PendingPage } from '../pages/PendingPage/PendingPage'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { loadCatalog } from '../state/modules/catalog'
import { createProduct } from '../state/modules/catalog'
import { createClient, loadClients } from '../state/modules/clients'
import { createSale, loadSales } from '../state/modules/sales'
import { login, logout, setBranch } from '../state/modules/session'
import type {
  CreateClientRequest,
  CreateProductRequest,
} from '../services/types'
import type { Sale, SaleLine, View } from '../types'
import { getStockAlerts } from '../utils/business'
import styles from './App.module.scss'

const pageTitle: Record<View, string> = {
  overview: 'Vista general',
  branch: 'Sucursal',
  sales: 'Ventas',
  products: 'Productos',
  clients: 'Clientes',
  stock: 'Inventario',
  fiscal: 'Facturación ARCA',
  pending: 'Pendientes de validar',
}

export default function App() {
  const dispatch = useAppDispatch()
  const {
    user,
    role,
    branchId,
    pending: loginPending,
    error: loginError,
  } = useAppSelector((state) => state.session)
  const {
    branches,
    products,
    loaded: catalogLoaded,
    pending: catalogPending,
    error: catalogError,
  } = useAppSelector((state) => state.catalog)
  const {
    items: clients,
    pending: clientsPending,
    error: clientsLoadError,
    saving: clientSaving,
    saveError: clientError,
  } = useAppSelector((state) => state.clients)
  const { saving: productSaving, saveError: productError } = useAppSelector(
    (state) => state.catalog,
  )
  const {
    items: sales,
    loaded: salesLoaded,
    pending: salesPending,
    pendingCreate,
    error: salesError,
  } = useAppSelector((state) => state.sales)
  const [view, setView] = useState<View>('overview')
  const [saleOpen, setSaleOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [clientOpen, setClientOpen] = useState(false)
  const [productAttempted, setProductAttempted] = useState(false)
  const [clientAttempted, setClientAttempted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notice, setNotice] = useState<{
    text: string
    severity: 'success' | 'error'
  } | null>(null)
  useEffect(() => {
    if (!user) return
    void dispatch(loadCatalog())
    void dispatch(loadSales())
    if (user.role === 'owner') void dispatch(loadClients())
  }, [dispatch, user])
  const alertCount = getStockAlerts(
    products,
    branches,
    role === 'seller' ? branchId : undefined,
  ).length

  const selectView = (next: View) => {
    if (
      role === 'seller' &&
      (next === 'pending' ||
        next === 'branch' ||
        next === 'clients' ||
        next === 'fiscal')
    )
      return
    if (next === 'branch' && branchId === 'all') dispatch(setBranch('centro'))
    setView(next)
    setMobileOpen(false)
  }

  const signOut = () => {
    dispatch(logout())
    setView('overview')
    setMobileOpen(false)
    setSaleOpen(false)
    setProductOpen(false)
    setClientOpen(false)
    setProductAttempted(false)
    setClientAttempted(false)
    setNotice(null)
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
        createSale({
          branchId,
          cashier: user?.name ?? 'Vendedor',
          payment,
          lines,
        }),
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

  const saveProduct = async (
    request: CreateProductRequest,
  ): Promise<boolean> => {
    setProductAttempted(true)
    try {
      await dispatch(createProduct(request))
      setProductOpen(false)
      setNotice({
        text: 'Producto agregado al catálogo y al inventario.',
        severity: 'success',
      })
      return true
    } catch {
      return false
    }
  }

  const saveClient = async (request: CreateClientRequest): Promise<boolean> => {
    setClientAttempted(true)
    try {
      await dispatch(createClient(request))
      setClientOpen(false)
      setNotice({
        text: 'Cliente agregado al directorio.',
        severity: 'success',
      })
      return true
    } catch {
      return false
    }
  }

  if (!user)
    return (
      <LoginPage
        pending={loginPending}
        error={loginError}
        onLogin={(request) => dispatch(login(request))}
      />
    )

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
    ) : view === 'clients' ? (
      <ClientsPage
        clients={clients}
        pending={clientsPending}
        error={clientsLoadError}
        onNewClient={() => {
          setClientAttempted(false)
          setClientOpen(true)
        }}
      />
    ) : view === 'fiscal' ? (
      <FiscalPage />
    ) : (
      <DataPage
        branches={branches}
        view={view as 'sales' | 'products' | 'stock'}
        role={role}
        branchId={branchId}
        products={products}
        sales={sales}
        onNewSale={() => setSaleOpen(true)}
        onNewProduct={() => {
          setProductAttempted(false)
          setProductOpen(true)
        }}
        onBranch={selectBranch}
      />
    )

  const sidebar = (
    <Sidebar
      branches={branches}
      branchId={branchId}
      role={role}
      user={user}
      view={view}
      alertCount={alertCount}
      onSelect={selectView}
      onLogout={signOut}
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
          onLogout={signOut}
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
      {productOpen && (
        <ProductFormDialog
          open={productOpen}
          branches={branches}
          pending={productSaving}
          error={productAttempted ? productError : null}
          onClose={() => {
            setProductOpen(false)
            setProductAttempted(false)
          }}
          onSubmit={saveProduct}
        />
      )}
      {clientOpen && (
        <ClientFormDialog
          open={clientOpen}
          pending={clientSaving}
          error={clientAttempted ? clientError : null}
          onClose={() => {
            setClientOpen(false)
            setClientAttempted(false)
          }}
          onSubmit={saveClient}
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
