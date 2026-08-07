import { Resend } from "resend"

import { siteConfig } from "@/config/site"

export type NotificationEmail = {
  subject: string
  text: string
  html: string
  replyTo?: string
}

/**
 * Sends from the domain in siteConfig.url, so a domain change follows the
 * config rather than needing an edit here. That domain must stay verified in
 * Resend or delivery fails.
 */
const fromAddress = `${siteConfig.name} <notifications@${new URL(siteConfig.url).hostname}>`

let client: Resend | null = null
let warned = false

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  client ??= new Resend(apiKey)
  return client
}

export async function sendNotificationEmail({
  subject,
  text,
  html,
  replyTo,
}: NotificationEmail): Promise<void> {
  const resend = getClient()
  if (!resend) {
    if (!warned) {
      warned = true
      console.warn(
        "RESEND_API_KEY is not set — form submissions are being logged instead of emailed."
      )
    }
    console.info(`[submission] ${subject}\n${text}`)
    return
  }

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: siteConfig.email,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  })

  if (error) {
    throw new Error(`Resend rejected the message: ${error.message}`)
  }
}
