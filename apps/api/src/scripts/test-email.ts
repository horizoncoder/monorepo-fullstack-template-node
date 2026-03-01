import { getEmailService } from '../lib/email'

async function main() {
  const to = process.argv[2]
  if (!to) {
    console.error('Usage: tsx src/scripts/test-email.ts <recipient@example.com>')
    process.exit(1)
  }

  const email = getEmailService()

  console.log(`Sending test email to ${to}...`)

  await email.send({
    to,
    subject: 'Test Email from SaaS App',
    html: '<h1>It works!</h1><p>This is a test email sent via the email service wrapper.</p>',
    text: 'It works! This is a test email sent via the email service wrapper.',
  })

  console.log('Email sent successfully!')
}

main().catch((err) => {
  console.error('Failed to send email:', err.message)
  process.exit(1)
})
