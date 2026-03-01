import type { EmailProvider, SendEmailOptions } from '../types'

const MAILEROO_API_URL = 'https://smtp.maileroo.com/send'

export class MailerooProvider implements EmailProvider {
  private apiKey: string
  private defaultFrom: string

  constructor(apiKey: string, defaultFrom: string) {
    this.apiKey = apiKey
    this.defaultFrom = defaultFrom
  }

  async send(options: SendEmailOptions): Promise<void> {
    const from = options.from ?? this.defaultFrom
    const to = Array.isArray(options.to) ? options.to.join(',') : options.to

    const form = new FormData()
    form.append('from', from)
    form.append('to', to)
    form.append('subject', options.subject)
    if (options.html) form.append('html', options.html)
    if (options.text) form.append('plain', options.text)

    const res = await fetch(MAILEROO_API_URL, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey },
      body: form,
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Maileroo API error (${res.status}): ${body}`)
    }
  }
}
