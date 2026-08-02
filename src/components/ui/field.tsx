import * as React from "react"

import { Label } from "@/components/ui/label"

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export { Field }
