import { toQuoteMode, toQuoteRequest, validateQuote } from "@/lib/quote"
import { quoteSender } from "@/lib/quote-sender"

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json(
      { ok: false, message: "The request could not be read." },
      { status: 400 }
    )
  }
  const data = toQuoteRequest(payload)
  const errors = validateQuote(data, toQuoteMode(payload))
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 })
  }
  try {
    await quoteSender.send(data)
  } catch {
    return Response.json(
      { ok: false, message: "The request could not be delivered." },
      { status: 502 }
    )
  }
  return Response.json({ ok: true })
}
