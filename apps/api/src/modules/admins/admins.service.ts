import type { CreateAdmin, UpdateAdmin } from '@repo/shared'
import { HTTPException } from 'hono/http-exception'
import bcrypt from 'bcrypt'
import { adminsRepository } from './admins.repository'

export const adminsService = {
  async getAll() {
    return adminsRepository.findAll()
  },

  async getById(id: string) {
    const admin = await adminsRepository.findById(id)
    if (!admin) throw new HTTPException(404, { message: 'Admin not found' })
    return admin
  },

  async create(data: CreateAdmin) {
    const existing = await adminsRepository.findByEmail(data.email)
    if (existing) throw new HTTPException(409, { message: 'Admin with this email already exists' })
    const passwordHash = await bcrypt.hash(data.password, 10)

    const admin = await adminsRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
      isSuperuser: data.isSuperuser ?? false,
    })

    if (data.roleIds && data.roleIds.length > 0) {
      await adminsRepository.setRoles(admin.id, data.roleIds)
    }

    return adminsRepository.findById(admin.id)
  },

  async update(id: string, data: UpdateAdmin) {
    const updateData: Partial<{ email: string; name: string; passwordHash: string; isSuperuser: boolean }> = {}
    if (data.email) updateData.email = data.email
    if (data.name) updateData.name = data.name
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10)
    if (data.isSuperuser !== undefined) updateData.isSuperuser = data.isSuperuser

    if (Object.keys(updateData).length > 0) {
      const admin = await adminsRepository.update(id, updateData)
      if (!admin) throw new HTTPException(404, { message: 'Admin not found' })
    }

    if (data.roleIds !== undefined) {
      await adminsRepository.setRoles(id, data.roleIds)
    }

    return adminsRepository.findById(id)
  },

  async delete(id: string) {
    const deleted = await adminsRepository.delete(id)
    if (!deleted) throw new HTTPException(404, { message: 'Admin not found' })
  },
}
