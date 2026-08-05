"use client"

import * as React from "react"

/**
 * Bot trap posted as `website` — see lib/anti-spam.ts. Hidden from sighted
 * users, screen readers, and the tab order; only autofilling bots touch it.
 */
function HoneypotField({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div aria-hidden="true" className="sr-only">
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export { HoneypotField }
