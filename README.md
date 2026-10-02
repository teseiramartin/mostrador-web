# Mostrador · demo para una fiambrería con varias sucursales

Prototipo navegable para conversar con Mabel y Kike sobre una primera versión. La pantalla inicial está pensada para el dueño de tres locales: ventas comparables, inventario por sucursal y puntos que requieren atención. Todos los datos son ficticios y viven en memoria.

## Ejecutar

Necesitás Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Abrí la dirección que muestra Vite. Para compilar: `npm run build`. El formato se aplica con `npm run format` y se comprueba con `npm run format:check`.

## Recorrido para la reunión

1. Ingresá con un perfil de prueba: **dueno@mostrador.demo** o **vendedor@mostrador.demo**, ambos con clave **demo1234**.
2. En **Vista general**, compará los importes de las tres sucursales y revisá las alertas de stock.
3. Entrá en la tarjeta de una sucursal para ver sus ventas recientes y qué productos están bajos.
4. En **Productos** y **Clientes**, cargá registros manualmente. Los productos nuevos también aparecen en Inventario.
5. Abrí **Inventario** para comparar existencias entre locales. La sugerencia de redistribución es informativa.
6. Revisá **Facturación ARCA** y **Pendientes de validar** para discutir el alcance siguiente.
7. Salí e ingresá como vendedora de Centro. Registrá una venta simulada y revisá cómo cambian ventas, promedio y stock de ese local.

## Estructura

- `src/app`: composición, tema de Material UI y estilos globales mínimos.
- `src/components`: navegación y formularios. Cada componente tiene su `.tsx` y `.module.scss` juntos.
- `src/pages`: pantallas del dueño, sucursal, tablas y pendientes; cada página tiene su `.module.scss`.
- `src/data`: sucursales, productos, ventas y clientes de ejemplo.
- `src/services`: proxies Axios con endpoints `/api/...` y adaptador mock intercambiable.
- `src/state/modules`: módulos `catalog`, `clients`, `sales` y `session`; cada uno tiene `actions.ts`, `reducers.ts`, `types.ts` e `index.ts`.
- `src/types` y `src/utils`: modelos, cálculos y formato.

Usa React, TypeScript, Vite, Material UI, Sass Modules, Redux Toolkit, React Redux, Axios, Formik y Yup. Redux guarda los datos compartidos; los diálogos y el menú móvil conservan estado local. Los thunks de `actions.ts` manejan carga, éxito y error. Los importes y promedios se calculan desde las ventas recibidas. Una venta actualiza ventas y stock en una sola respuesta.

## Conexión con un backend

La demo usa el adaptador mock por defecto. Para conectarla a una API, copiá `.env.example` como `.env.local`, cambiá `VITE_DATA_SOURCE=api` y configurá `VITE_API_BASE_URL` con el origen de tu backend. Reiniciá Vite después del cambio. Los componentes y las acciones de Redux usan los mismos proxies en ambos modos.

Contrato provisional de los proxies:

| Método | Ruta              | Respuesta esperada                           |
| ------ | ----------------- | -------------------------------------------- |
| GET    | `/api/branches`   | `Branch[]`                                   |
| GET    | `/api/products`   | `Product[]`                                  |
| POST   | `/api/products`   | `Product`                                    |
| GET    | `/api/clients`    | `Client[]`                                   |
| POST   | `/api/clients`    | `Client`                                     |
| GET    | `/api/sales`      | `Sale[]`                                     |
| POST   | `/api/sales`      | `{ sale: Sale, updatedProducts: Product[] }` |
| POST   | `/api/auth/login` | `User`                                       |

El POST de ventas recibe `{ branchId, cashier, payment, lines: [{ productId, quantity }] }`. `updatedProducts` incluye los productos afectados con su nuevo `stockByBranch`. El login envía `{ email, password }`; la propuesta es que el backend devuelva un usuario y establezca una sesión con cookie HttpOnly, Secure y SameSite apropiado. El cliente Axios ya usa `withCredentials`. Para producción faltan renovación o consulta de sesión (`GET /api/auth/me`), cierre (`POST /api/auth/logout`), protección CSRF según el despliegue y autorización de cada operación en el servidor. No se deben guardar credenciales fiscales en el frontend. Los tipos están en `src/types` y `src/services/types.ts`. Los proxies pueden adaptar respuestas del backend a los modelos de la interfaz.

## Alcance de la demo

El login es simulado y los perfiles representan una propuesta de permisos: el dueño consulta todos los locales y la vendedora opera en Centro. El frontend no ofrece seguridad real; el backend deberá validar identidad, rol y sucursal para cada endpoint. Las cuentas iniciales se crearían manualmente por el equipo; no hay registro público. La carga manual de productos y clientes opera sobre el mock en memoria. La importación de Excel figura como siguiente paso, sin carga de archivos todavía. Antes de implementarla habrá que definir una plantilla, mapeo de columnas, validación, vista previa y tratamiento de duplicados. Tampoco hay persistencia, caja, balanza o facturación fiscal; al recargar se restablecen los datos de muestra.

**ARCA:** la pantalla actual sirve para definir el alcance. La emisión exige un backend y decisiones sobre datos fiscales, punto de venta, certificados y estados de comprobantes. Se puede estudiar conexión directa con los servicios de ARCA o un proveedor como TusFacturasAPP; la demo no realiza ninguna conexión fiscal.

Los umbrales de stock y la posibilidad de mover mercadería entre locales son hipótesis de producto. Las preguntas de negocio están en **Pendientes de validar**.
