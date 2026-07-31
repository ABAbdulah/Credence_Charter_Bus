import type { QuoteRequest } from "@/lib/quote"

export interface QuoteSender {
  send(request: QuoteRequest): Promise<void>
}

const consoleQuoteSender: QuoteSender = {
  async send(request) {
    console.info("Quote request received:", JSON.stringify(request, null, 2))
  },
}

export const quoteSender: QuoteSender = consoleQuoteSender
