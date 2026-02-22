import type { CreateRole, UpdateRole } from '@repo/shared'
import { HTTPException } from 'hono/http-exception'
import { rolesRepository } from './roles.repository'

export const rolesService = {
  async getAll() {
    return rolesRepository.findAll()
  },

  async getById(id: string) {
    const role = await rolesRepository.findById(id)
    if (!role) throw new HTTPException(404, { message: 'Role not found' })
    return role
  },

  async create(data: CreateRole) {
    const existing = await rolesRepository.findByName(data.name)
    if (existing) throw new HTTPException(409, { message: 'Role with this name already exists' })

    const role = await rolesRepository.create({
      name: data.name,
      description: data.description,
    })

    if (data.permissions && data.permissions.length > 0) {
      await rolesRepository.setPermissions(role.id, data.permissions)
    }

    return rolesRepository.findById(role.id)
  },

  async update(id: string, data: UpdateRole) {
    const existing = await rolesRepository.findById(id)
    if (!existing) throw new HTTPException(404, { message: 'Role not found' })

    if (data.name && data.name !== existing.name) {
      const duplicate = await rolesRepository.findByName(data.name)
      if (duplicate) throw new HTTPException(409, { message: 'Role with this name already exists' })
    }

    const updateData: Partial<{ name: string; description: string }> = {}
    if (data.name) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description

    if (Object.keys(updateData).length > 0) {
      await rolesRepository.update(id, updateData)
    }

    if (data.permissions !== undefined) {
      await rolesRepository.setPermissions(id, data.permissions)
    }

    return rolesRepository.findById(id)
  },

  async delete(id: string) {
    const deleted = await rolesRepository.delete(id)
    if (!deleted) throw new HTTPException(404, { message: 'Role not found' })
  },
}
