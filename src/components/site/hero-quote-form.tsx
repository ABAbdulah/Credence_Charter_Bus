"use client"

import * as React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { useFormSubmission } from "@/hooks/use-form-submission"
import { emptyQuoteRequest, validateQuote } from "@/lib/quote"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormErrorBanner } from "@/components/site/form-status"
import { HoneypotField } from "@/components/site/honeypot-field"

/**
 * Client-only so the prerendered HTML doesn't bake in the build date as the
 * earliest selectable departure.
 */
const neverChanges = () => () => {}
const todayOnClient = () => new Date().toISOString().slice(0, 10)
const todayOnServer = () => ""

const cardClass =
  "rounded-xl bg-card p-6 shadow-lg ring-1 ring-foreground/10 sm:p-8"

function HeroQuoteForm() {
  const { data, errors, status, website, setWebsite, idFor, fieldProps, handleSubmit } =
    useFormSubmission({
      endpoint: "/api/quote",
      initialData: emptyQuoteRequest,
      validate: (values) => validateQuote(values, "quick"),
      idPrefix: "hero",
      extraPayload: { mode: "quick" },
    })
  const today = React.useSyncExternalStore(
    neverChanges,
    todayOnClient,
    todayOnServer
  )

  if (status === "success") {
    return (
      <div role="status" className={cardClass}>
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
    <div className={cardClass}>
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
        <HoneypotField
          id="hero-website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id={idFor("departureDate")}
            label="Departure date"
            error={errors.departureDate}
          >
            <Input
              {...fieldProps("departureDate")}
              type="date"
              min={today || undefined}
            />
          </Field>
          <Field
            id={idFor("passengers")}
            label="Passengers"
            error={errors.passengers}
          >
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
            id={idFor("pickupLocation")}
            label="Pick-up city"
            error={errors.pickupLocation}
          >
            <Input {...fieldProps("pickupLocation")} placeholder="Dallas, TX" />
          </Field>
          <Field
            id={idFor("destination")}
            label="Destination"
            error={errors.destination}
          >
            <Input {...fieldProps("destination")} placeholder="Austin, TX" />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={idFor("name")} label="Your name" error={errors.name}>
            <Input {...fieldProps("name")} autoComplete="name" />
          </Field>
          <Field id={idFor("phone")} label="Phone" error={errors.phone}>
            <Input
              {...fieldProps("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="(555) 018-2340"
            />
          </Field>
        </div>
        {status === "error" && (
          <FormErrorBanner>
            Something went wrong sending your request. Please call{" "}
            {siteConfig.phone.display} and we&apos;ll take the details.
          </FormErrorBanner>
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
