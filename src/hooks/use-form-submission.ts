"use client"

import * as React from "react"

export type SubmissionStatus = "idle" | "submitting" | "success" | "error"

type FormValues = Record<string, string>

type ChangeEventFor = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

/**
 * The shared state machine behind every form on the site: validate, focus the
 * first invalid field, POST alongside the honeypot, then report status. Field
 * layout stays with each form — only this behavior is shared.
 */
export function useFormSubmission<T extends FormValues>({
  endpoint,
  initialData,
  validate,
  idPrefix,
  extraPayload,
}: {
  endpoint: string
  initialData: T
  validate: (data: T) => Partial<Record<keyof T, string>>
  idPrefix?: string
  extraPayload?: Record<string, string>
}) {
  const [data, setData] = React.useState<T>(initialData)
  const [website, setWebsite] = React.useState("")
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>(
    {}
  )
  const [status, setStatus] = React.useState<SubmissionStatus>("idle")

  const idFor = (key: keyof T | string) =>
    idPrefix ? `${idPrefix}-${String(key)}` : String(key)

  const set = (key: keyof T) => (event: ChangeEventFor) => {
    setData((current) => ({ ...current, [key]: event.target.value }))
  }

  const ariaProps = (key: keyof T) => ({
    id: idFor(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${idFor(key)}-error` : undefined,
  })

  const fieldProps = (key: keyof T) => ({
    ...ariaProps(key),
    value: data[key],
    onChange: set(key),
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(data)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(idFor(firstInvalid))?.focus()
      })
      return
    }
    setStatus("submitting")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...extraPayload, website }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return {
    data,
    errors,
    status,
    website,
    setWebsite,
    idFor,
    set,
    ariaProps,
    fieldProps,
    handleSubmit,
  }
}
