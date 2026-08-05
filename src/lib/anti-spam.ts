const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const MAX_TRACKED_KEYS = 10_000

const hits = new Map<string, number[]>()

/**
 * The `website` field exists only as a bot trap — no real form shows it.
 * A payload that fills it is silently accepted upstream without sending.
 */
export function isHoneypotTripped(payload: unknown): boolean {
  if (typeof payload !== "object" || payload === null) return false
  const value = (payload as Record<string, unknown>).website
  return typeof value === "string" && value.length > 0
}

/**
 * Per-instance memory only — enough to stop casual floods, not a substitute
 * for edge-level protection on the hosting platform.
 */
export function isRateLimited(request: Request, endpoint: string): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const key = `${endpoint}:${ip}`
  const now = Date.now()
  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [tracked, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(tracked)
    }
  }
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS)
  recent.push(now)
  hits.set(key, recent)
  return recent.length > MAX_PER_WINDOW
}
