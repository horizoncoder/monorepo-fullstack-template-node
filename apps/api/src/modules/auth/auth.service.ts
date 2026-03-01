import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { HTTPException } from 'hono/http-exception'
import { authRepository } from './auth.repository'
import { usersRepository } from '../users/users.repository'
import { getEmailService } from '../../lib/email'

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
    if (!user || !user.passwordHash) throw new HTTPException(401, { message: 'Invalid email or password' })

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

  async requestPasswordReset(email: string) {
    const user = await authRepository.findUserByEmail(email)
    // Always return success to prevent email enumeration
    if (!user) return
    // Skip for OAuth users (they don't have passwords)
    if (user.provider !== 'local') return

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await authRepository.createPasswordResetToken(user.id, token, expiresAt)

    const resetUrl = `${process.env.WEB_URL || 'https://develop'}/reset-password?token=${token}`
    const emailService = getEmailService()
    await emailService.send({
      to: user.email,
      subject: 'Password Reset',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    })
  },

  async resetPassword(token: string, newPassword: string) {
    const resetToken = await authRepository.findValidResetToken(token)
    if (!resetToken) {
      throw new HTTPException(400, { message: 'Invalid or expired reset token' })
    }

    const passwordHash = await this.hashPassword(newPassword)
    await usersRepository.update(resetToken.userId, { passwordHash })
    await authRepository.markTokenUsed(resetToken.id)
  },

  async googleAuth(credential: string) {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
    )
    if (!response.ok) {
      throw new HTTPException(401, { message: 'Invalid Google token' })
    }
    const payload = await response.json()

    const clientId = process.env.GOOGLE_CLIENT_ID
    if (payload.aud !== clientId) {
      throw new HTTPException(401, { message: 'Invalid Google token audience' })
    }

    const { sub: googleId, email, name } = payload
    if (!email) {
      throw new HTTPException(400, { message: 'Google account has no email' })
    }

    // Find existing user by provider+id
    let user = await authRepository.findUserByProviderAndId('google', googleId)

    if (!user) {
      // Auto-link: check if a user with this email exists
      const existingByEmail = await authRepository.findUserByEmail(email)
      if (existingByEmail) {
        user = existingByEmail
      } else {
        user = await usersRepository.create({
          email,
          name: name || email.split('@')[0],
          provider: 'google',
          providerId: googleId,
          passwordHash: null,
        })
      }
    }

    const session = await authRepository.createSession({
      userId: user!.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    })

    return { session, user: user! }
  },

  async telegramAuth(data: {
    id: number
    first_name: string
    last_name?: string
    username?: string
    photo_url?: string
    auth_date: number
    hash: string
  }) {
    // Verify auth_date is not too old (5 minute window)
    const now = Math.floor(Date.now() / 1000)
    if (now - data.auth_date > 300) {
      throw new HTTPException(401, { message: 'Telegram auth data is expired' })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      throw new HTTPException(500, { message: 'Telegram bot token not configured' })
    }

    // Verify hash using HMAC-SHA256
    const { hash, ...checkData } = data
    const dataCheckString = Object.keys(checkData)
      .sort()
      .map((key) => `${key}=${checkData[key as keyof typeof checkData]}`)
      .filter((pair) => !pair.endsWith('=undefined'))
      .join('\n')

    const secretKey = crypto.createHash('sha256').update(botToken).digest()
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    if (hmac !== hash) {
      throw new HTTPException(401, { message: 'Invalid Telegram auth hash' })
    }

    const telegramId = String(data.id)
    let user = await authRepository.findUserByProviderAndId('telegram', telegramId)

    if (!user) {
      const name = [data.first_name, data.last_name].filter(Boolean).join(' ')
      user = await usersRepository.create({
        email: null,
        name,
        provider: 'telegram',
        providerId: telegramId,
        passwordHash: null,
      })
    }

    const session = await authRepository.createSession({
      userId: user!.id,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
    })

    return { session, user: user! }
  },
}
