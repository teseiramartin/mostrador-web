import type { Client } from '../types'

export const initialClients: Client[] = [
  {
    id: 'c1',
    name: 'Almacén Don Pedro',
    document: '30711222333',
    email: 'compras@donpedro.demo',
    phone: '11 4300 1122',
  },
  {
    id: 'c2',
    name: 'María Gómez',
    document: '28444555',
    email: 'maria@correo.demo',
    phone: '11 5555 3821',
  },
  { id: 'c3', name: 'Consumidor final', document: '', email: '', phone: '' },
]
