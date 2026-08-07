import { siteConfig } from "@/config/site"
import type { QuoteRequest } from "@/lib/quote"
import type { NotificationEmail } from "@/lib/resend-client"
import type { Submission } from "@/lib/submission-sender"

type Row = [label: string, value: string]

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function compose(heading: string, rows: Row[]): { text: string; html: string } {
  const filled = rows.filter(([, value]) => value)
  const text = [
    heading,
    "",
    ...filled.map(([label, value]) => `${label}: ${value}`),
    "",
    `Sent from ${siteConfig.url}`,
  ].join("\n")

  const cells = filled
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0;vertical-align:top;color:#5A6B82;font-weight:600;">${escapeHtml(label)}</th><td style="padding:6px 0;vertical-align:top;color:#22252B;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`
    )
    .join("")

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:16px;line-height:1.5;color:#22252B;"><h2 style="font-size:20px;margin:0 0 16px;color:#1B2A4A;">${escapeHtml(heading)}</h2><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${cells}</table><p style="margin:24px 0 0;font-size:14px;color:#5A6B82;">Sent from ${escapeHtml(siteConfig.url)}</p></div>`

  return { text, html }
}

export function quoteEmail(data: QuoteRequest): NotificationEmail {
  const heading = `New quote request from ${data.name}`
  return {
    subject: `${heading} — ${data.passengers} passengers`,
    ...compose(heading, [
      ["Name", data.name],
      ["Phone", data.phone],
      ["Email", data.email],
      ["Trip type", data.tripType],
      ["Vehicle preference", data.vehicle],
      ["Passengers", data.passengers],
      ["Pickup", data.pickupLocation],
      ["Destination", data.destination],
      ["Departure date", data.departureDate],
      ["Return date", data.returnDate],
      ["Notes", data.notes],
    ]),
    ...(data.email ? { replyTo: data.email } : {}),
  }
}

export function submissionEmail(submission: Submission): NotificationEmail {
  switch (submission.kind) {
    case "contact": {
      const { data } = submission
      const heading = `New contact message from ${data.name}`
      return {
        subject: `${heading} — ${data.subject}`,
        ...compose(heading, [
          ["Name", data.name],
          ["Email", data.email],
          ["Phone", data.phone],
          ["Subject", data.subject],
          ["Message", data.message],
        ]),
        replyTo: data.email,
      }
    }
    case "driver": {
      const { data } = submission
      const heading = `New driver application from ${data.firstName} ${data.lastName}`
      return {
        subject: heading,
        ...compose(heading, [
          ["Name", `${data.firstName} ${data.lastName}`],
          ["Email", data.email],
          ["Phone", data.phone],
          [
            "Address",
            `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
          ],
          ["CDL number", data.cdlNumber],
          ["CDL expiration", data.cdlExpiration],
          ["Endorsements", data.cdlEndorsements],
          ["Years experience", data.yearsExperience],
          ["Availability", data.availability],
          ["Previous employers", data.previousEmployers],
          ["Resume summary", data.resumeSummary],
          ["Additional info", data.additionalInfo],
        ]),
        replyTo: data.email,
      }
    }
    case "affiliate": {
      const { data } = submission
      const heading = `New affiliate inquiry from ${data.company}`
      return {
        subject: `${heading} — ${data.city}, ${data.state}`,
        ...compose(heading, [
          ["Company", data.company],
          ["Contact", data.contactName],
          ["Email", data.email],
          ["Phone", data.phone],
          ["Location", `${data.city}, ${data.state}`],
          ["Fleet", data.fleetSize],
          ["Message", data.message],
        ]),
        replyTo: data.email,
      }
    }
    case "newsletter": {
      const { data } = submission
      const heading = "New newsletter signup"
      return {
        subject: `${heading} — ${data.email}`,
        ...compose(heading, [["Email", data.email]]),
        replyTo: data.email,
      }
    }
  }
}
