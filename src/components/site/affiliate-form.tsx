"use client"

import * as React from "react"

import { siteConfig } from "@/config/site"
import {
  validateAffiliateInquiry,
  type AffiliateInquiry,
  type FieldErrors,
} from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HoneypotField } from "@/components/site/honeypot-field"

type Status = "idle" | "submitting" | "success" | "error"

const emptyInquiry: AffiliateInquiry = {
  company: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  fleetSize: "",
  message: "",
}

function AffiliateForm() {
  const [data, setData] = React.useState<AffiliateInquiry>(emptyInquiry)
  const [website, setWebsite] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors<AffiliateInquiry>>({})
  const [status, setStatus] = React.useState<Status>("idle")

  const set =
    (key: keyof AffiliateInquiry) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setData((current) => ({ ...current, [key]: event.target.value }))
    }

  const ariaProps = (key: keyof AffiliateInquiry) => ({
    id: `affiliate-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `affiliate-${key}-error` : undefined,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateAffiliateInquiry(data)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(`affiliate-${firstInvalid}`)?.focus()
      })
      return
    }
    setStatus("submitting")
    try {
      const response = await fetch("/api/affiliate", {
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
          Inquiry received — thank you
        </h3>
        <p className="mt-3">
          Our partnerships team will review your operation and reach out to
          start the conversation. Questions in the meantime? Call{" "}
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
        id="affiliate-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="affiliate-company" label="Company name" error={errors.company}>
          <Input
            {...ariaProps("company")}
            value={data.company}
            onChange={set("company")}
            autoComplete="organization"
          />
        </Field>
        <Field
          id="affiliate-contactName"
          label="Contact person"
          error={errors.contactName}
        >
          <Input
            {...ariaProps("contactName")}
            value={data.contactName}
            onChange={set("contactName")}
            autoComplete="name"
          />
        </Field>
        <Field id="affiliate-email" label="Email address" error={errors.email}>
          <Input
            {...ariaProps("email")}
            type="email"
            value={data.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </Field>
        <Field id="affiliate-phone" label="Phone number" error={errors.phone}>
          <Input
            {...ariaProps("phone")}
            type="tel"
            value={data.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
        </Field>
        <Field id="affiliate-city" label="City" error={errors.city}>
          <Input
            {...ariaProps("city")}
            value={data.city}
            onChange={set("city")}
          />
        </Field>
        <Field id="affiliate-state" label="State" error={errors.state}>
          <Input
            {...ariaProps("state")}
            value={data.state}
            onChange={set("state")}
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        <Field
          id="affiliate-fleetSize"
          label="Fleet size and vehicle types"
          optional
          error={errors.fleetSize}
        >
          <Input
            {...ariaProps("fleetSize")}
            value={data.fleetSize}
            onChange={set("fleetSize")}
            placeholder="6 coaches, 4 mini buses…"
          />
        </Field>
        <Field
          id="affiliate-message"
          label="Tell us about your operation"
          optional
          error={errors.message}
        >
          <Textarea
            {...ariaProps("message")}
            value={data.message}
            onChange={set("message")}
            rows={4}
          />
        </Field>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-6 font-medium text-destructive">
          Something went wrong sending your inquiry. Please try again, or call{" "}
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
          {status === "submitting" ? "Sending…" : "Submit Inquiry"}
        </Button>
      </div>
    </form>
  )
}

export { AffiliateForm }
