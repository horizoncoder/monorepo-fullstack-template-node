import type { CreateProduct, UpdateProduct } from '@repo/shared'
import { HTTPException } from 'hono/http-exception'
import { productsRepository } from './products.repository'

export const productsService = {
  getAll() { return productsRepository.findAll() },
  getById(id: string) {
    const product = productsRepository.findById(id)
    if (!product) throw new HTTPException(404, { message: 'Product not found' })
    return product
  },
  create(data: CreateProduct) { return productsRepository.create(data) },
  update(id: string, data: UpdateProduct) {
    const product = productsRepository.update(id, data)
    if (!product) throw new HTTPException(404, { message: 'Product not found' })
    return product
  },
  delete(id: string) {
    const deleted = productsRepository.delete(id)
    if (!deleted) throw new HTTPException(404, { message: 'Product not found' })
  },
}
