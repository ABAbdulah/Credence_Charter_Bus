"use client"

import { Phone } from "lucide-react"

import { fleetCategories } from "@/data/fleet"
import { services } from "@/data/services"
import { siteConfig } from "@/config/site"
import { useFormSubmission } from "@/hooks/use-form-submission"
import { emptyQuoteRequest, validateQuote } from "@/lib/quote"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FormErrorBanner, FormSuccessCard } from "@/components/site/form-status"
import { HoneypotField } from "@/components/site/honeypot-field"

function QuoteForm() {
  const {
    data,
    errors,
    status,
    website,
    setWebsite,
    idFor,
    set,
    ariaProps,
    handleSubmit,
  } = useFormSubmission({
    endpoint: "/api/quote",
    initialData: emptyQuoteRequest,
    validate: (values) => validateQuote(values),
  })

  if (status === "success") {
    return (
      <FormSuccessCard as="h2" heading="Request received — thank you">
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
      </FormSuccessCard>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <HoneypotField
        id="quote-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={idFor("name")} label="Your name" error={errors.name}>
          <Input
            {...ariaProps("name")}
            value={data.name}
            onChange={set("name")}
            autoComplete="name"
          />
        </Field>
        <Field id={idFor("phone")} label="Phone number" error={errors.phone}>
          <Input
            {...ariaProps("phone")}
            type="tel"
            value={data.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
        </Field>
        <Field id={idFor("email")} label="Email address" error={errors.email}>
          <Input
            {...ariaProps("email")}
            type="email"
            value={data.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </Field>
        <Field
          id={idFor("passengers")}
          label="Number of passengers"
          error={errors.passengers}
        >
          <Input
            {...ariaProps("passengers")}
            type="number"
            min={1}
            inputMode="numeric"
            value={data.passengers}
            onChange={set("passengers")}
          />
        </Field>
        <Field id={idFor("tripType")} label="Type of trip" error={errors.tripType}>
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
        <Field
          id={idFor("vehicle")}
          label="Vehicle preference"
          optional
          error={errors.vehicle}
        >
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
        <Field
          id={idFor("pickupLocation")}
          label="Pickup city or address"
          error={errors.pickupLocation}
        >
          <Input
            {...ariaProps("pickupLocation")}
            value={data.pickupLocation}
            onChange={set("pickupLocation")}
          />
        </Field>
        <Field
          id={idFor("destination")}
          label="Destination"
          error={errors.destination}
        >
          <Input
            {...ariaProps("destination")}
            value={data.destination}
            onChange={set("destination")}
          />
        </Field>
        <Field
          id={idFor("departureDate")}
          label="Departure date"
          error={errors.departureDate}
        >
          <Input
            {...ariaProps("departureDate")}
            type="date"
            value={data.departureDate}
            onChange={set("departureDate")}
          />
        </Field>
        <Field
          id={idFor("returnDate")}
          label="Return date"
          optional
          error={errors.returnDate}
        >
          <Input
            {...ariaProps("returnDate")}
            type="date"
            value={data.returnDate}
            onChange={set("returnDate")}
          />
        </Field>
      </div>
      <div className="mt-6">
        <Field
          id={idFor("notes")}
          label="Anything else we should know?"
          optional
          error={errors.notes}
        >
          <Textarea
            {...ariaProps("notes")}
            value={data.notes}
            onChange={set("notes")}
            placeholder="Multiple stops, accessibility needs, luggage, event timing…"
          />
        </Field>
      </div>
      {status === "error" && (
        <FormErrorBanner className="mt-6">
          Something went wrong sending your request. Please try again, or call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-semibold underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>{" "}
          and we&apos;ll take the details over the phone.
        </FormErrorBanner>
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
