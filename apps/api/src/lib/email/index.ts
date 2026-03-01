import type { EmailConfig, EmailProvider, SendEmailOptions } from './types'
import { MailerooProvider } from './providers/maileroo'

export type { SendEmailOptions, EmailProvider, EmailConfig }

function createProvider(config: EmailConfig): EmailProvider {
  switch (config.provider) {
    case 'maileroo': {
      const apiKey = config.maileroo?.apiKey
      if (!apiKey) throw new Error('MAILEROO_API_KEY is required when EMAIL_PROVIDER=maileroo')
      return new MailerooProvider(apiKey, config.defaultFrom)
    }
    default:
      throw new Error(`Unknown email provider: ${config.provider}`)
  }
}

export function createEmailService(config: EmailConfig) {
  const provider = createProvider(config)

  return {
    send(options: SendEmailOptions) {
      return provider.send({
        ...options,
        from: options.from ?? config.defaultFrom,
      })
    },
  }
}

/** Default singleton — reads config from environment variables. */
let _instance: ReturnType<typeof createEmailService> | null = null

export function getEmailService() {
  if (_instance) return _instance

  const provider = process.env.EMAIL_PROVIDER as EmailConfig['provider'] | undefined
  const defaultFrom = process.env.EMAIL_FROM

  if (!provider || !defaultFrom) {
    throw new Error('EMAIL_PROVIDER and EMAIL_FROM environment variables are required')
  }

  _instance = createEmailService({
    provider,
    defaultFrom,
    maileroo: { apiKey: process.env.MAILEROO_API_KEY ?? '' },
  })

  return _instance
}
