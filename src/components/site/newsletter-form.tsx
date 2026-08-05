"use client"

import * as React from "react"

import { validateNewsletterSignup } from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { HoneypotField } from "@/components/site/honeypot-field"

type Status = "idle" | "submitting" | "success" | "error"

function NewsletterForm() {
  const [email, setEmail] = React.useState("")
  const [website, setWebsite] = React.useState("")
  const [error, setError] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validateNewsletterSignup({ email: email.trim() })
    if (errors.email) {
      setError(errors.email)
      document.getElementById("newsletter-email")?.focus()
      return
    }
    setError("")
    setStatus("submitting")
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="text-primary-foreground/85">
        You&apos;re on the list — thanks for subscribing.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
      <HoneypotField
        id="newsletter-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <label htmlFor="newsletter-email" className="text-primary-foreground/85">
        Travel ideas and planning tips, a few times a year. No spam.
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-email-error" : undefined}
          className="min-h-11 w-full max-w-64 rounded-md border border-primary-foreground/30 bg-primary-foreground px-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/60 focus-visible:outline-none"
        />
        <Button
          type="submit"
          variant="accent"
          disabled={status === "submitting"}
          className="focus-visible:ring-primary-foreground/60"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {error && (
        <p id="newsletter-email-error" className="font-medium text-accent">
          {error}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="font-medium text-accent">
          Something went wrong — please try again.
        </p>
      )}
    </form>
  )
}

export { NewsletterForm }
