"use client"

import * as React from "react"

export type SubmissionStatus = "idle" | "submitting" | "success" | "error"

type FormValues = Record<string, string>

type ChangeEventFor = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>

export function useFormSubmission<T extends FormValues>({
  endpoint,
  initialData,
  validate,
  idPrefix,
  extraPayload,
  resetOnSuccess,
}: {
  endpoint: string
  initialData: T
  validate: (data: T) => Partial<Record<keyof T, string>>
  idPrefix?: string
  extraPayload?: Record<string, string>
  resetOnSuccess?: boolean
}) {
  const [data, setData] = React.useState<T>(initialData)
  const [website, setWebsite] = React.useState("")
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>(
    {}
  )
  const [status, setStatus] = React.useState<SubmissionStatus>("idle")
  const inFlight = React.useRef(false)

  const idFor = (key: keyof T | string) =>
    idPrefix ? `${idPrefix}-${String(key)}` : String(key)

  const patch = (values: Partial<T>) => {
    setData((current) => ({ ...current, ...values }))
    setStatus((current) => (current === "success" ? "idle" : current))
  }

  const set = (key: keyof T) => (event: ChangeEventFor) =>
    patch({ [key]: event.target.value } as Partial<T>)

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
    if (inFlight.current) return
    const found = validate(data)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      requestAnimationFrame(() => {
        document.getElementById(idFor(firstInvalid))?.focus()
      })
      return
    }
    inFlight.current = true
    setStatus("submitting")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...extraPayload, website }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setStatus("success")
      if (resetOnSuccess) {
        setData(initialData)
        setErrors({})
        setWebsite("")
      }
    } catch {
      setStatus("error")
    } finally {
      inFlight.current = false
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
    patch,
    ariaProps,
    fieldProps,
    handleSubmit,
  }
}
