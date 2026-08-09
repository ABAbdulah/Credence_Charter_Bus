import { isHoneypotTripped, isRateLimited } from "@/lib/anti-spam"
import { toQuoteRequest, validateQuote } from "@/lib/quote"
import { quoteSender } from "@/lib/quote-sender"

export async function POST(request: Request) {
  if (isRateLimited(request, "quote")) {
    return Response.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json(
      { ok: false, message: "The request could not be read." },
      { status: 400 }
    )
  }
  if (isHoneypotTripped(payload)) {
    return Response.json({ ok: true })
  }
  const data = toQuoteRequest(payload)
  const errors = validateQuote(data)
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
