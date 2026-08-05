"use client"

import * as React from "react"

import { siteConfig } from "@/config/site"
import {
  contactSubjects,
  validateContactMessage,
  type ContactMessage,
  type FieldErrors,
} from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { HoneypotField } from "@/components/site/honeypot-field"

type Status = "idle" | "submitting" | "success" | "error"

const emptyMessage: ContactMessage = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
}

function ContactForm() {
  const [data, setData] = React.useState<ContactMessage>(emptyMessage)
  const [website, setWebsite] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors<ContactMessage>>({})
  const [status, setStatus] = React.useState<Status>("idle")

  const set =
    (key: keyof ContactMessage) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setData((current) => ({ ...current, [key]: event.target.value }))
    }

  const ariaProps = (key: keyof ContactMessage) => ({
    id: `contact-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validateContactMessage(data)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(`contact-${firstInvalid}`)?.focus()
      })
      return
    }
    setStatus("submitting")
    try {
      const response = await fetch("/api/contact", {
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
          Message sent — thank you
        </h3>
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
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <HoneypotField
        id="contact-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contact-name" label="Your name" error={errors.name}>
          <Input
            {...ariaProps("name")}
            value={data.name}
            onChange={set("name")}
            autoComplete="name"
          />
        </Field>
        <Field id="contact-email" label="Email address" error={errors.email}>
          <Input
            {...ariaProps("email")}
            type="email"
            value={data.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </Field>
        <Field
          id="contact-phone"
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
        <Field id="contact-subject" label="Subject" error={errors.subject}>
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
        <Field id="contact-message" label="Your message" error={errors.message}>
          <Textarea
            {...ariaProps("message")}
            value={data.message}
            onChange={set("message")}
            rows={6}
          />
        </Field>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-6 font-medium text-destructive">
          Something went wrong sending your message. Please try again, or call{" "}
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
          {status === "submitting" ? "Sending…" : "Send Message"}
        </Button>
      </div>
    </form>
  )
}

export { ContactForm }
