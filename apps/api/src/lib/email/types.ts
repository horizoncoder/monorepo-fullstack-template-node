export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  /** Override default sender address */
  from?: string
}

export interface EmailProvider {
  send(options: SendEmailOptions): Promise<void>
}

export interface EmailConfig {
  provider: 'maileroo'
  defaultFrom: string
  maileroo?: { apiKey: string }
}
