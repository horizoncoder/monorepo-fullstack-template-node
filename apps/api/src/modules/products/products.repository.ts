import type { Product, CreateProduct, UpdateProduct } from '@repo/shared'
import { randomUUID } from 'crypto'

const products: Product[] = [
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    name: 'Laptop Pro',
    description: 'High-performance laptop',
    price: 1299.99,
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 29.99,
    stock: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440003',
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub',
    price: 49.99,
    stock: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const productsRepository = {
  findAll(): Product[] { return products },
  findById(id: string): Product | undefined { return products.find((p) => p.id === id) },
  create(data: CreateProduct): Product {
    const now = new Date().toISOString()
    const product: Product = { id: randomUUID(), ...data, createdAt: now, updatedAt: now }
    products.push(product)
    return product
  },
  update(id: string, data: UpdateProduct): Product | undefined {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return undefined
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() }
    return products[index]
  },
  delete(id: string): boolean {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false
    products.splice(index, 1)
    return true
  },
}
