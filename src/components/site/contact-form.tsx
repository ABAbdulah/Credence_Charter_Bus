"use client"

import { siteConfig } from "@/config/site"
import { useFormSubmission } from "@/hooks/use-form-submission"
import {
  contactSubjects,
  validateContactMessage,
  type ContactMessage,
} from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FormErrorBanner, FormSuccessCard } from "@/components/site/form-status"
import { HoneypotField } from "@/components/site/honeypot-field"

const emptyMessage: ContactMessage = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

function ContactForm() {
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
    endpoint: "/api/contact",
    initialData: emptyMessage,
    validate: validateContactMessage,
    idPrefix: "contact",
    resetOnSuccess: true,
  })

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      {status === "success" && (
        <div className="mb-8">
          <FormSuccessCard heading="Message sent — thank you">
            <p className="mt-3">
              We read every message and reply within one business day, usually
              sooner. If it&apos;s urgent, call{" "}
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="font-semibold text-primary underline underline-offset-4"
              >
                {siteConfig.phone.display}
              </a>
              .
            </p>
          </FormSuccessCard>
        </div>
      )}
      <HoneypotField
        id="contact-website"
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
          id={idFor("phone")}
          label="Phone number"
          optional
          error={errors.phone}
        >
          <Input
            {...ariaProps("phone")}
            type="tel"
            value={data.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
        </Field>
        <Field id={idFor("subject")} label="Subject" error={errors.subject}>
          <Select
            {...ariaProps("subject")}
            value={data.subject}
            onChange={set("subject")}
          >
            <option value="">Choose one…</option>
            {contactSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="mt-6">
        <Field id={idFor("message")} label="Your message" error={errors.message}>
          <Textarea
            {...ariaProps("message")}
            value={data.message}
            onChange={set("message")}
            rows={6}
          />
        </Field>
      </div>
      {status === "error" && (
        <FormErrorBanner className="mt-6">
          Something went wrong sending your message. Please try again, or call{" "}
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
          {status === "submitting" ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  )
}

export { ContactForm }
