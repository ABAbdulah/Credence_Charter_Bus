"use client"

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import {
  emptyQuoteRequest,
  validateQuote,
  type QuoteFieldErrors,
  type QuoteRequest,
} from "@/lib/quote"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type Status = "idle" | "submitting" | "success" | "error"

/**
 * Client-only so the prerendered HTML doesn't bake in the build date as the
 * earliest selectable departure.
 */
const neverChanges = () => () => {}
const todayOnClient = () => new Date().toISOString().slice(0, 10)
const todayOnServer = () => ""

function HeroQuoteForm() {
  const [data, setData] = React.useState<QuoteRequest>(emptyQuoteRequest)
  const [errors, setErrors] = React.useState<QuoteFieldErrors>({})
  const [status, setStatus] = React.useState<Status>("idle")
  const today = React.useSyncExternalStore(
    neverChanges,
    todayOnClient,
    todayOnServer
  )

  const set =
    (key: keyof QuoteRequest) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setData((current) => ({ ...current, [key]: event.target.value }))
    }

  const fieldProps = (key: keyof QuoteRequest) => ({
    id: `hero-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `hero-${key}-error` : undefined,
    value: data[key],
    onChange: set(key),
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateQuote(data, "quick")
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(`hero-${firstInvalid}`)?.focus()
      })
      return
    }
    setStatus("submitting")
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mode: "quick" }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-xl bg-card p-6 shadow-lg ring-1 ring-foreground/10 sm:p-8"
      >
        <h2 className="font-heading text-2xl font-bold text-primary">
          Request received — thank you
        </h2>
        <p className="mt-3">
          A coordinator is putting your quote together now and will call{" "}
          <span className="font-semibold">{data.phone}</span> to confirm the
          details.
        </p>
        <p className="mt-3">
          Need an answer sooner? Call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-semibold text-primary underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-lg ring-1 ring-foreground/10 sm:p-8">
      <h2 className="font-heading text-2xl font-bold text-primary">
        Get a free quote
      </h2>
      <p className="mt-1.5 text-muted-foreground">
        Tell us about the trip and we&apos;ll price it — no obligation.
      </p>
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={status === "submitting"}
        className="mt-6 flex flex-col gap-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="hero-departureDate"
            label="Departure date"
            error={errors.departureDate}
          >
            <Input
              {...fieldProps("departureDate")}
              type="date"
              min={today || undefined}
            />
          </Field>
          <Field id="hero-passengers" label="Passengers" error={errors.passengers}>
            <Input
              {...fieldProps("passengers")}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="24"
            />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="hero-pickupLocation"
            label="Pick-up city"
            error={errors.pickupLocation}
          >
            <Input {...fieldProps("pickupLocation")} placeholder="Dallas, TX" />
          </Field>
          <Field id="hero-destination" label="Destination" error={errors.destination}>
            <Input {...fieldProps("destination")} placeholder="Austin, TX" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="hero-name" label="Your name" error={errors.name}>
            <Input {...fieldProps("name")} autoComplete="name" />
          </Field>
          <Field id="hero-phone" label="Phone" error={errors.phone}>
            <Input
              {...fieldProps("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="(555) 018-2340"
            />
          </Field>
        </div>
        {status === "error" && (
          <p role="alert" className="font-medium text-destructive">
            Something went wrong sending your request. Please call{" "}
            {siteConfig.phone.display} and we&apos;ll take the details.
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : "Get my free quote"}
        </Button>
        <p className="text-sm text-muted-foreground">
          Need more options — round trip, vehicle type, extra stops?{" "}
          <Link
            href="/quote"
            className="font-semibold text-primary underline underline-offset-4"
          >
            Use the full form
          </Link>
          .
        </p>
      </form>
    </div>
  )
}

export { HeroQuoteForm }
