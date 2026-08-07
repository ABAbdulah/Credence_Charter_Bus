"use client"

import { siteConfig } from "@/config/site"
import { useFormSubmission } from "@/hooks/use-form-submission"
import {
  validateAffiliateInquiry,
  type AffiliateInquiry,
} from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormErrorBanner, FormSuccessCard } from "@/components/site/form-status"
import { HoneypotField } from "@/components/site/honeypot-field"

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
    endpoint: "/api/affiliate",
    initialData: emptyInquiry,
    validate: validateAffiliateInquiry,
    idPrefix: "affiliate",
  })

  if (status === "success") {
    return (
      <FormSuccessCard heading="Inquiry received — thank you">
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
      </FormSuccessCard>
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
        <Field id={idFor("company")} label="Company name" error={errors.company}>
          <Input
            {...ariaProps("company")}
            value={data.company}
            onChange={set("company")}
            autoComplete="organization"
          />
        </Field>
        <Field
          id={idFor("contactName")}
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
        <Field id={idFor("email")} label="Email address" error={errors.email}>
          <Input
            {...ariaProps("email")}
            type="email"
            value={data.email}
            onChange={set("email")}
            autoComplete="email"
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
        <Field id={idFor("city")} label="City" error={errors.city}>
          <Input
            {...ariaProps("city")}
            value={data.city}
            onChange={set("city")}
          />
        </Field>
        <Field id={idFor("state")} label="State" error={errors.state}>
          <Input
            {...ariaProps("state")}
            value={data.state}
            onChange={set("state")}
          />
        </Field>
      </div>
      <div className="mt-6 flex flex-col gap-6">
        <Field
          id={idFor("fleetSize")}
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
          id={idFor("message")}
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
        <FormErrorBanner className="mt-6">
          Something went wrong sending your inquiry. Please try again, or call{" "}
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="font-semibold underline underline-offset-4"
          >
            {siteConfig.phone.display}
          </a>
          .
        </FormErrorBanner>
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
