"use client"

import { useFormSubmission } from "@/hooks/use-form-submission"
import { validateNewsletterSignup } from "@/lib/submissions"
import { Button } from "@/components/ui/button"
import { FormErrorBanner } from "@/components/site/form-status"
import { HoneypotField } from "@/components/site/honeypot-field"

function NewsletterForm() {
  const { errors, status, website, setWebsite, idFor, fieldProps, handleSubmit } =
    useFormSubmission({
      endpoint: "/api/newsletter",
      initialData: { email: "" },
      validate: (values) => validateNewsletterSignup({ email: values.email.trim() }),
      idPrefix: "newsletter",
    })

  if (status === "success") {
    return (
      <p role="status" className="text-primary-foreground/85">
        You&apos;re on the list — thanks for subscribing.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
      <HoneypotField
        id="newsletter-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <label htmlFor={idFor("email")} className="text-primary-foreground/85">
        Travel ideas and planning tips, a few times a year. No spam.
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          {...fieldProps("email")}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="min-h-11 w-full max-w-64 rounded-md border border-primary-foreground/30 bg-primary-foreground px-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/60 focus-visible:outline-none"
        />
        <Button
          type="submit"
          variant="accent"
          disabled={status === "submitting"}
          className="focus-visible:ring-primary-foreground/60"
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      {errors.email && (
        <p id={`${idFor("email")}-error`} className="font-medium text-accent">
          {errors.email}
        </p>
      )}
      {status === "error" && (
        <FormErrorBanner className="text-accent">
          Something went wrong — please try again.
        </FormErrorBanner>
      )}
    </form>
  )
}

export { NewsletterForm }
