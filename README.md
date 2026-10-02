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

1. En **Vista general**, compará los importes de las tres sucursales y revisá las alertas de stock.
2. Entrá en la tarjeta de una sucursal para ver sus ventas recientes y qué productos están bajos.
3. Abrí **Inventario** para comparar existencias entre locales. La sugerencia de redistribución es informativa.
4. Abrí **Pendientes de validar** para revisar las decisiones de negocio todavía abiertas.
5. Usá **Cambiar perfil de prueba** para entrar como vendedora de Centro. Registrá una venta simulada y revisá cómo cambian ventas, promedio y stock de ese local.

## Estructura

- `src/app`: composición, tema de Material UI y estilos globales mínimos.
- `src/components`: navegación y diálogo de venta. Cada componente tiene su `.tsx` y `.module.scss` juntos.
- `src/pages`: pantallas del dueño, sucursal, tablas y pendientes; cada página tiene su `.module.scss`.
- `src/data`: sucursales, productos y ventas de ejemplo.
- `src/services`: proxies Axios con endpoints `/api/...` y adaptador mock intercambiable.
- `src/state/modules`: módulos `catalog`, `sales` y `session`; cada uno tiene `actions.ts`, `reducers.ts`, `types.ts` e `index.ts`.
- `src/types` y `src/utils`: modelos, cálculos y formato.

Usa React, TypeScript, Vite, Material UI, Sass Modules, Redux Toolkit, React Redux y Axios. `catalog`, `sales` y `session` guardan el estado compartido; el diálogo y el menú móvil conservan estado local. Los thunks de `actions.ts` manejan carga, éxito y error. Los importes y promedios se calculan desde las ventas recibidas. Una venta actualiza ventas y stock en una sola respuesta.

## Conexión con un backend

La demo usa el adaptador mock por defecto. Para conectarla a una API, copiá `.env.example` como `.env.local`, cambiá `VITE_DATA_SOURCE=api` y configurá `VITE_API_BASE_URL` con el origen de tu backend. Reiniciá Vite después del cambio. Los componentes y las acciones de Redux usan los mismos proxies en ambos modos.

Contrato provisional de los proxies:

| Método | Ruta            | Respuesta esperada                           |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/api/branches` | `Branch[]`                                   |
| GET    | `/api/products` | `Product[]`                                  |
| GET    | `/api/sales`    | `Sale[]`                                     |
| POST   | `/api/sales`    | `{ sale: Sale, updatedProducts: Product[] }` |

El POST recibe `{ branchId, cashier, payment, lines: [{ productId, quantity }] }`. `updatedProducts` incluye los productos afectados con su nuevo `stockByBranch`. Los tipos están en `src/types` y `src/services/types.ts`. Este contrato es una propuesta para la demo y se puede ajustar cuando exista la API. Los proxies son el lugar para adaptar una respuesta distinta del backend a los modelos que usa la interfaz.

## Alcance de la demo

El cambio de perfil representa una propuesta de permisos para discutir: el dueño consulta todos los locales y la vendedora opera en Centro. No hay inicio de sesión ni control de acceso real. El backend deberá validar identidad, rol y sucursal para cada endpoint. Tampoco hay persistencia, caja, balanza o facturación fiscal; al recargar se restablecen los datos de muestra.

Los umbrales de stock y la posibilidad de mover mercadería entre locales son hipótesis de producto. Las preguntas de negocio están en **Pendientes de validar**.
