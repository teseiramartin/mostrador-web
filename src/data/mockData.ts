import type { Branch, Product, Sale } from '../types'

export const branches: Branch[] = [
  {
    id: 'centro',
    name: 'Sucursal Centro',
    shortName: 'Centro',
    code: '01',
    address: 'San Martín 742',
  },
  {
    id: 'norte',
    name: 'Sucursal Norte',
    shortName: 'Norte',
    code: '02',
    address: 'Av. Belgrano 1820',
  },
  {
    id: 'sur',
    name: 'Sucursal Sur',
    shortName: 'Sur',
    code: '03',
    address: 'Las Heras 356',
  },
]

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Queso cremoso',
    category: 'Quesos',
    code: '779001',
    unit: 'kg',
    price: 8900,
    stockByBranch: { centro: 12.4, norte: 8.2, sur: 5.6 },
    color: 'butter',
    initials: 'QC',
  },
  {
    id: 'p2',
    name: 'Jamón cocido natural',
    category: 'Fiambres',
    code: '779002',
    unit: 'kg',
    price: 12400,
    stockByBranch: { centro: 8.6, norte: 4.2, sur: 0.8 },
    color: 'rose',
    initials: 'JC',
  },
  {
    id: 'p3',
    name: 'Salame milán',
    category: 'Fiambres',
    code: '779003',
    unit: 'kg',
    price: 15800,
    stockByBranch: { centro: 6.1, norte: 7.3, sur: 4.2 },
    color: 'terra',
    initials: 'SM',
  },
  {
    id: 'p4',
    name: 'Provolone',
    category: 'Quesos',
    code: '779004',
    unit: 'kg',
    price: 13900,
    stockByBranch: { centro: 2.4, norte: 3.7, sur: 2.9 },
    color: 'sage',
    initials: 'PR',
  },
  {
    id: 'p5',
    name: 'Aceitunas verdes',
    category: 'Conservas',
    code: '779005',
    unit: 'kg',
    price: 6200,
    stockByBranch: { centro: 3.2, norte: 0.6, sur: 1.9 },
    color: 'olive',
    initials: 'AV',
  },
  {
    id: 'p6',
    name: 'Gaseosa cola 1.5 L',
    category: 'Bebidas',
    code: '779006',
    unit: 'unidad',
    price: 2400,
    stockByBranch: { centro: 24, norte: 18, sur: 12 },
    color: 'ink',
    initials: 'GC',
  },
  {
    id: 'p7',
    name: 'Queso pategrás',
    category: 'Quesos',
    code: '779007',
    unit: 'kg',
    price: 14500,
    stockByBranch: { centro: 0.7, norte: 2.8, sur: 3.4 },
    color: 'amber',
    initials: 'QP',
  },
  {
    id: 'p8',
    name: 'Mortadela con pistacho',
    category: 'Fiambres',
    code: '779008',
    unit: 'kg',
    price: 11800,
    stockByBranch: { centro: 3.8, norte: 1.4, sur: 2.2 },
    color: 'pink',
    initials: 'MP',
  },
]

type SaleSeed = Omit<Sale, 'id'>

const saleSeeds: SaleSeed[] = [
  {
    branchId: 'centro',
    time: '12:41',
    cashier: 'Lucía Fernández',
    payment: 'Débito',
    lines: [
      { productId: 'p1', quantity: 0.45 },
      { productId: 'p3', quantity: 0.32 },
      { productId: 'p6', quantity: 2 },
    ],
  },
  {
    branchId: 'norte',
    time: '12:34',
    cashier: 'Marina López',
    payment: 'Efectivo',
    lines: [
      { productId: 'p2', quantity: 0.36 },
      { productId: 'p4', quantity: 0.28 },
    ],
  },
  {
    branchId: 'sur',
    time: '12:27',
    cashier: 'Diego Paz',
    payment: 'Transferencia',
    lines: [
      { productId: 'p1', quantity: 0.54 },
      { productId: 'p6', quantity: 1 },
    ],
  },
  {
    branchId: 'centro',
    time: '12:19',
    cashier: 'Lucía Fernández',
    payment: 'Efectivo',
    lines: [
      { productId: 'p7', quantity: 0.21 },
      { productId: 'p8', quantity: 0.27 },
    ],
  },
  {
    branchId: 'norte',
    time: '12:05',
    cashier: 'Marina López',
    payment: 'Débito',
    lines: [
      { productId: 'p3', quantity: 0.41 },
      { productId: 'p6', quantity: 2 },
    ],
  },
  {
    branchId: 'centro',
    time: '11:52',
    cashier: 'Tomás Ríos',
    payment: 'Transferencia',
    lines: [
      { productId: 'p2', quantity: 0.38 },
      { productId: 'p5', quantity: 0.2 },
    ],
  },
  {
    branchId: 'sur',
    time: '11:41',
    cashier: 'Diego Paz',
    payment: 'Efectivo',
    lines: [
      { productId: 'p3', quantity: 0.34 },
      { productId: 'p4', quantity: 0.18 },
    ],
  },
  {
    branchId: 'centro',
    time: '11:24',
    cashier: 'Lucía Fernández',
    payment: 'Efectivo',
    lines: [
      { productId: 'p1', quantity: 0.25 },
      { productId: 'p2', quantity: 0.18 },
    ],
  },
  {
    branchId: 'norte',
    time: '11:17',
    cashier: 'Marina López',
    payment: 'Transferencia',
    lines: [
      { productId: 'p1', quantity: 0.31 },
      { productId: 'p8', quantity: 0.26 },
    ],
  },
  {
    branchId: 'sur',
    time: '11:04',
    cashier: 'Diego Paz',
    payment: 'Débito',
    lines: [
      { productId: 'p4', quantity: 0.43 },
      { productId: 'p6', quantity: 2 },
    ],
  },
  {
    branchId: 'centro',
    time: '10:53',
    cashier: 'Tomás Ríos',
    payment: 'Débito',
    lines: [
      { productId: 'p3', quantity: 0.3 },
      { productId: 'p6', quantity: 2 },
    ],
  },
  {
    branchId: 'norte',
    time: '10:37',
    cashier: 'Marina López',
    payment: 'Efectivo',
    lines: [
      { productId: 'p5', quantity: 0.22 },
      { productId: 'p2', quantity: 0.24 },
    ],
  },
  {
    branchId: 'centro',
    time: '10:22',
    cashier: 'Lucía Fernández',
    payment: 'Efectivo',
    lines: [{ productId: 'p4', quantity: 0.4 }],
  },
  {
    branchId: 'sur',
    time: '10:11',
    cashier: 'Diego Paz',
    payment: 'Efectivo',
    lines: [
      { productId: 'p8', quantity: 0.3 },
      { productId: 'p1', quantity: 0.42 },
    ],
  },
  {
    branchId: 'norte',
    time: '09:49',
    cashier: 'Marina López',
    payment: 'Débito',
    lines: [
      { productId: 'p6', quantity: 3 },
      { productId: 'p7', quantity: 0.24 },
    ],
  },
  {
    branchId: 'centro',
    time: '09:35',
    cashier: 'Tomás Ríos',
    payment: 'Transferencia',
    lines: [
      { productId: 'p8', quantity: 0.22 },
      { productId: 'p5', quantity: 0.18 },
    ],
  },
  {
    branchId: 'sur',
    time: '09:21',
    cashier: 'Diego Paz',
    payment: 'Débito',
    lines: [
      { productId: 'p2', quantity: 0.29 },
      { productId: 'p6', quantity: 1 },
    ],
  },
  {
    branchId: 'norte',
    time: '09:08',
    cashier: 'Marina López',
    payment: 'Efectivo',
    lines: [
      { productId: 'p3', quantity: 0.39 },
      { productId: 'p1', quantity: 0.2 },
    ],
  },
]

export const initialSales: Sale[] = saleSeeds.map((sale, index) => ({
  ...sale,
  id: `V-${1120 - index}`,
}))
