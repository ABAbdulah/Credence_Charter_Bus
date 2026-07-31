"use client"

import * as React from "react"
import { Phone } from "lucide-react"

import { fleetCategories } from "@/data/fleet"
import { services } from "@/data/services"
import { siteConfig } from "@/config/site"
import {
  emptyQuoteRequest,
  validateQuote,
  type QuoteFieldErrors,
  type QuoteRequest,
} from "@/lib/quote"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Status = "idle" | "submitting" | "success" | "error"

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function QuoteForm() {
  const [data, setData] = React.useState<QuoteRequest>(emptyQuoteRequest)
  const [errors, setErrors] = React.useState<QuoteFieldErrors>({})
  const [status, setStatus] = React.useState<Status>("idle")

  const set =
    (key: keyof QuoteRequest) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setData((current) => ({ ...current, [key]: event.target.value }))
    }

  const ariaProps = (key: keyof QuoteRequest) => ({
    id: key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateQuote(data)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(firstInvalid)?.focus()
      })
      return
    }
    setStatus("submitting")
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
        className="rounded-xl bg-card p-8 shadow-xs ring-1 ring-foreground/10"
      >
        <h2 className="text-2xl font-semibold text-primary">
          Request received — thank you
        </h2>
        <p className="mt-3">
          A coordinator is putting your quote together now. You&apos;ll hear
          from us within one business day, usually much sooner.
        </p>
        <p className="mt-3">
          Need an answer right away? Call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-semibold text-primary underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>{" "}
          — we answer around the clock.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Your name" error={errors.name}>
          <Input
            {...ariaProps("name")}
            value={data.name}
            onChange={set("name")}
            autoComplete="name"
          />
        </Field>
        <Field id="phone" label="Phone number" error={errors.phone}>
          <Input
            {...ariaProps("phone")}
            type="tel"
            value={data.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
        </Field>
        <Field id="email" label="Email address" error={errors.email}>
          <Input
            {...ariaProps("email")}
            type="email"
            value={data.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </Field>
        <Field id="passengers" label="Number of passengers" error={errors.passengers}>
          <Input
            {...ariaProps("passengers")}
            type="number"
            min={1}
            inputMode="numeric"
            value={data.passengers}
            onChange={set("passengers")}
          />
        </Field>
        <Field id="tripType" label="Type of trip" error={errors.tripType}>
          <Select
            {...ariaProps("tripType")}
            value={data.tripType}
            onChange={set("tripType")}
          >
            <option value="">Choose one…</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
            <option value="other">Something else</option>
          </Select>
        </Field>
        <Field id="vehicle" label="Vehicle preference" optional error={errors.vehicle}>
          <Select
            {...ariaProps("vehicle")}
            value={data.vehicle}
            onChange={set("vehicle")}
          >
            <option value="">Not sure yet — recommend one</option>
            {fleetCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.capacity})
              </option>
            ))}
          </Select>
        </Field>
        <Field id="pickupLocation" label="Pickup city or address" error={errors.pickupLocation}>
          <Input
            {...ariaProps("pickupLocation")}
            value={data.pickupLocation}
            onChange={set("pickupLocation")}
          />
        </Field>
        <Field id="destination" label="Destination" error={errors.destination}>
          <Input
            {...ariaProps("destination")}
            value={data.destination}
            onChange={set("destination")}
          />
        </Field>
        <Field id="departureDate" label="Departure date" error={errors.departureDate}>
          <Input
            {...ariaProps("departureDate")}
            type="date"
            value={data.departureDate}
            onChange={set("departureDate")}
          />
        </Field>
        <Field id="returnDate" label="Return date" optional error={errors.returnDate}>
          <Input
            {...ariaProps("returnDate")}
            type="date"
            value={data.returnDate}
            onChange={set("returnDate")}
          />
        </Field>
      </div>
      <div className="mt-6">
        <Field id="notes" label="Anything else we should know?" optional error={errors.notes}>
          <Textarea
            {...ariaProps("notes")}
            value={data.notes}
            onChange={set("notes")}
            placeholder="Multiple stops, accessibility needs, luggage, event timing…"
          />
        </Field>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-6 font-medium text-destructive">
          Something went wrong sending your request. Please try again, or call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-semibold underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>{" "}
          and we&apos;ll take the details over the phone.
        </p>
      )}
      <div className="mt-8 flex flex-col items-start gap-4">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request My Free Quote"}
        </Button>
        <p className="text-muted-foreground">
          Free, no obligation. Prefer the phone?{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4"
          >
            <Phone aria-hidden="true" className="size-4" />
            {siteConfig.phone.display}
          </a>
        </p>
      </div>
    </form>
  )
}

export { QuoteForm }
