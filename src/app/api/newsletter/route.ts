import { isHoneypotTripped, isRateLimited } from "@/lib/anti-spam"
import { toNewsletterSignup, validateNewsletterSignup } from "@/lib/submissions"
import { submissionSender } from "@/lib/submission-sender"

export async function POST(request: Request) {
  if (isRateLimited(request, "newsletter")) {
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
  const data = toNewsletterSignup(payload)
  const errors = validateNewsletterSignup(data)
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 })
  }
  try {
    await submissionSender.send({ kind: "newsletter", data })
  } catch {
    return Response.json(
      { ok: false, message: "The signup could not be saved." },
      { status: 502 }
    )
  }
  return Response.json({ ok: true })
}
