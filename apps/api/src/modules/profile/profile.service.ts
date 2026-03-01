import bcrypt from 'bcrypt'
import { HTTPException } from 'hono/http-exception'
import { profileRepository } from './profile.repository'

export const profileService = {
  async updateProfile(userId: string, data: { name: string; email: string }) {
    const existing = await profileRepository.findByEmail(data.email)
    if (existing && existing.id !== userId) {
      throw new HTTPException(409, { message: 'Email already in use' })
    }
    return profileRepository.updateProfile(userId, data)
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await profileRepository.findById(userId)
    if (!user) throw new HTTPException(404, { message: 'User not found' })

    if (!user.passwordHash) {
      throw new HTTPException(400, { message: 'Password change is not available for OAuth accounts' })
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) throw new HTTPException(400, { message: 'Current password is incorrect' })

    const passwordHash = await bcrypt.hash(newPassword, 10)
    return profileRepository.updatePassword(userId, passwordHash)
  },
}
