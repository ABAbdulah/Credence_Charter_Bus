import { Resend } from "resend"

import { siteConfig } from "@/config/site"

export type NotificationEmail = {
  subject: string
  text: string
  html: string
  replyTo?: string
}

/**
 * Sends from siteConfig.email. Its domain must be VERIFIED in Resend — note
 * that is the bare `credencecharterbus.com`; the `www.` host from
 * siteConfig.url is a separate domain to Resend and 403s as unverified.
 * RESEND_FROM overrides this for testing (e.g. `onboarding@resend.dev`).
 */
const fromAddress =
  process.env.RESEND_FROM ?? `${siteConfig.name} <${siteConfig.email}>`

const toAddress = process.env.SUBMISSIONS_TO ?? siteConfig.email

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
    to: toAddress,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  })

  if (error) {
    /** The route turns this into a bare 502, so log it or the cause is invisible. */
    console.error(
      `Resend rejected the message (from=${fromAddress} to=${toAddress}): ${error.message}`
    )
    throw new Error(`Resend rejected the message: ${error.message}`)
  }
}
