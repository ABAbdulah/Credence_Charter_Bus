import { quoteEmail } from "@/lib/notification-email"
import type { QuoteRequest } from "@/lib/quote"
import { sendNotificationEmail } from "@/lib/resend-client"

export interface QuoteSender {
  send(request: QuoteRequest): Promise<void>
}

const emailQuoteSender: QuoteSender = {
  async send(request) {
    await sendNotificationEmail(quoteEmail(request))
  },
}

export const quoteSender: QuoteSender = emailQuoteSender
