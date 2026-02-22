import bcrypt from 'bcrypt'
import { HTTPException } from 'hono/http-exception'
import { authRepository } from './auth.repository'
import { usersRepository } from '../users/users.repository'

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export const authService = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  },

  async adminLogin(email: string, password: string) {
    const admin = await authRepository.findAdminByEmail(email)
    if (!admin) throw new HTTPException(401, { message: 'Invalid email or password' })

    const valid = await this.verifyPassword(password, admin.passwordHash)
    if (!valid) throw new HTTPException(401, { message: 'Invalid email or password' })

    const session = await authRepository.createSession({
      adminId: admin.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    })

    return { session, admin }
  },

  async userRegister(data: { name: string; email: string; password: string }) {
    const existing = await authRepository.findUserByEmail(data.email)
    if (existing) throw new HTTPException(409, { message: 'Email already registered' })

    const passwordHash = await this.hashPassword(data.password)
    const user = await usersRepository.create({
      email: data.email,
      name: data.name,
      passwordHash,
    })

    const session = await authRepository.createSession({
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    })

    return { session, user }
  },

  async userLogin(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email)
    if (!user) throw new HTTPException(401, { message: 'Invalid email or password' })

    const valid = await this.verifyPassword(password, user.passwordHash)
    if (!valid) throw new HTTPException(401, { message: 'Invalid email or password' })

    const session = await authRepository.createSession({
      userId: user.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    })

    return { session, user }
  },

  async validateAdminSession(sessionId: string) {
    const session = await authRepository.findSessionById(sessionId)
    if (!session || !session.adminId) return null
    if (new Date(session.expiresAt) < new Date()) {
      await authRepository.deleteSession(session.id)
      return null
    }

    const admin = await authRepository.findAdminById(session.adminId)
    if (!admin) return null

    return { session, admin }
  },

  async validateUserSession(sessionId: string) {
    const session = await authRepository.findSessionById(sessionId)
    if (!session || !session.userId) return null
    if (new Date(session.expiresAt) < new Date()) {
      await authRepository.deleteSession(session.id)
      return null
    }

    const user = await authRepository.findUserById(session.userId)
    if (!user) return null

    return { session, user }
  },

  async logout(sessionId: string) {
    await authRepository.deleteSession(sessionId)
  },
}
