"use client"

import * as React from "react"

import { siteConfig } from "@/config/site"
import {
  validateDriverApplication,
  type DriverApplication,
  type FieldErrors,
} from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HoneypotField } from "@/components/site/honeypot-field"

type Status = "idle" | "submitting" | "success" | "error"

const emptyApplication: DriverApplication = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cdlNumber: "",
  cdlExpiration: "",
  cdlEndorsements: "",
  yearsExperience: "",
  previousEmployers: "",
  availability: "",
  resumeSummary: "",
  additionalInfo: "",
}

function DriverForm() {
  const [data, setData] = React.useState<DriverApplication>(emptyApplication)
  const [website, setWebsite] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors<DriverApplication>>({})
  const [status, setStatus] = React.useState<Status>("idle")

  const set =
    (key: keyof DriverApplication) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setData((current) => ({ ...current, [key]: event.target.value }))
    }

  const ariaProps = (key: keyof DriverApplication) => ({
    id: `driver-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `driver-${key}-error` : undefined,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateDriverApplication(data)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(`driver-${firstInvalid}`)?.focus()
      })
      return
    }
    setStatus("submitting")
    try {
      const response = await fetch("/api/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website }),
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
        <h3 className="text-2xl font-semibold text-primary">
          Application received — thank you
        </h3>
        <p className="mt-3">
          Our team reviews every application and will reach out about next
          steps. Questions in the meantime? Call{" "}
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
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <HoneypotField
        id="driver-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="driver-firstName" label="First name" error={errors.firstName}>
          <Input
            {...ariaProps("firstName")}
            value={data.firstName}
            onChange={set("firstName")}
            autoComplete="given-name"
          />
        </Field>
        <Field id="driver-lastName" label="Last name" error={errors.lastName}>
          <Input
            {...ariaProps("lastName")}
            value={data.lastName}
            onChange={set("lastName")}
            autoComplete="family-name"
          />
        </Field>
        <Field id="driver-email" label="Email address" error={errors.email}>
          <Input
            {...ariaProps("email")}
            type="email"
            value={data.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </Field>
        <Field id="driver-phone" label="Phone number" error={errors.phone}>
          <Input
            {...ariaProps("phone")}
            type="tel"
            value={data.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
        </Field>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Field id="driver-address" label="Street address" error={errors.address}>
          <Input
            {...ariaProps("address")}
            value={data.address}
            onChange={set("address")}
            autoComplete="street-address"
          />
        </Field>
        <Field id="driver-city" label="City" error={errors.city}>
          <Input
            {...ariaProps("city")}
            value={data.city}
            onChange={set("city")}
            autoComplete="address-level2"
          />
        </Field>
        <Field id="driver-state" label="State" error={errors.state}>
          <Input
            {...ariaProps("state")}
            value={data.state}
            onChange={set("state")}
            autoComplete="address-level1"
          />
        </Field>
        <Field id="driver-zip" label="ZIP code" error={errors.zip}>
          <Input
            {...ariaProps("zip")}
            value={data.zip}
            onChange={set("zip")}
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </Field>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Field id="driver-cdlNumber" label="CDL number" error={errors.cdlNumber}>
          <Input
            {...ariaProps("cdlNumber")}
            value={data.cdlNumber}
            onChange={set("cdlNumber")}
          />
        </Field>
        <Field
          id="driver-cdlExpiration"
          label="CDL expiration date"
          error={errors.cdlExpiration}
        >
          <Input
            {...ariaProps("cdlExpiration")}
            type="date"
            value={data.cdlExpiration}
            onChange={set("cdlExpiration")}
          />
        </Field>
        <Field
          id="driver-cdlEndorsements"
          label="CDL endorsements"
          error={errors.cdlEndorsements}
        >
          <Input
            {...ariaProps("cdlEndorsements")}
            value={data.cdlEndorsements}
            onChange={set("cdlEndorsements")}
            placeholder="P (Passenger), S (School Bus)"
          />
        </Field>
        <Field
          id="driver-yearsExperience"
          label="Years of commercial driving experience"
          error={errors.yearsExperience}
        >
          <Input
            {...ariaProps("yearsExperience")}
            type="number"
            min={0}
            inputMode="numeric"
            value={data.yearsExperience}
            onChange={set("yearsExperience")}
          />
        </Field>
        <Field
          id="driver-availability"
          label="Availability"
          error={errors.availability}
        >
          <Input
            {...ariaProps("availability")}
            value={data.availability}
            onChange={set("availability")}
            placeholder="Full-time, part-time, weekends…"
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        <Field
          id="driver-previousEmployers"
          label="Previous employers"
          optional
          error={errors.previousEmployers}
        >
          <Textarea
            {...ariaProps("previousEmployers")}
            value={data.previousEmployers}
            onChange={set("previousEmployers")}
            rows={3}
          />
        </Field>
        <Field
          id="driver-resumeSummary"
          label="Resume / experience summary"
          optional
          error={errors.resumeSummary}
        >
          <Textarea
            {...ariaProps("resumeSummary")}
            value={data.resumeSummary}
            onChange={set("resumeSummary")}
            rows={4}
          />
        </Field>
        <Field
          id="driver-additionalInfo"
          label="Anything else we should know?"
          optional
          error={errors.additionalInfo}
        >
          <Textarea
            {...ariaProps("additionalInfo")}
            value={data.additionalInfo}
            onChange={set("additionalInfo")}
            rows={3}
          />
        </Field>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-6 font-medium text-destructive">
          Something went wrong sending your application. Please try again, or
          call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-semibold underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>
          .
        </p>
      )}
      <div className="mt-8">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Submit Application"}
        </Button>
      </div>
    </form>
  )
}

export { DriverForm }
