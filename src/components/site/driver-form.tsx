"use client"

import { siteConfig } from "@/config/site"
import { useFormSubmission } from "@/hooks/use-form-submission"
import {
  validateDriverApplication,
  type DriverApplication,
} from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormErrorBanner, FormSuccessCard } from "@/components/site/form-status"
import { HoneypotField } from "@/components/site/honeypot-field"

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
    endpoint: "/api/driver",
    initialData: emptyApplication,
    validate: validateDriverApplication,
    idPrefix: "driver",
  })

  if (status === "success") {
    return (
      <FormSuccessCard heading="Application received — thank you">
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
      </FormSuccessCard>
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
        <Field
          id={idFor("firstName")}
          label="First name"
          error={errors.firstName}
        >
          <Input
            {...ariaProps("firstName")}
            value={data.firstName}
            onChange={set("firstName")}
            autoComplete="given-name"
          />
        </Field>
        <Field id={idFor("lastName")} label="Last name" error={errors.lastName}>
          <Input
            {...ariaProps("lastName")}
            value={data.lastName}
            onChange={set("lastName")}
            autoComplete="family-name"
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
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Field id={idFor("address")} label="Street address" error={errors.address}>
          <Input
            {...ariaProps("address")}
            value={data.address}
            onChange={set("address")}
            autoComplete="street-address"
          />
        </Field>
        <Field id={idFor("city")} label="City" error={errors.city}>
          <Input
            {...ariaProps("city")}
            value={data.city}
            onChange={set("city")}
            autoComplete="address-level2"
          />
        </Field>
        <Field id={idFor("state")} label="State" error={errors.state}>
          <Input
            {...ariaProps("state")}
            value={data.state}
            onChange={set("state")}
            autoComplete="address-level1"
          />
        </Field>
        <Field id={idFor("zip")} label="ZIP code" error={errors.zip}>
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
        <Field id={idFor("cdlNumber")} label="CDL number" error={errors.cdlNumber}>
          <Input
            {...ariaProps("cdlNumber")}
            value={data.cdlNumber}
            onChange={set("cdlNumber")}
          />
        </Field>
        <Field
          id={idFor("cdlExpiration")}
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
          id={idFor("cdlEndorsements")}
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
          id={idFor("yearsExperience")}
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
          id={idFor("availability")}
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
          id={idFor("previousEmployers")}
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
          id={idFor("resumeSummary")}
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
          id={idFor("additionalInfo")}
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
        <FormErrorBanner className="mt-6">
          Something went wrong sending your application. Please try again, or
          call{" "}
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
          {status === "submitting" ? "Sending…" : "Submit Application"}
        </Button>
      </div>
    </form>
  )
}

export { DriverForm }
