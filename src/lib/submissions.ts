export type ContactMessage = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export type DriverApplication = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  cdlNumber: string
  cdlExpiration: string
  cdlEndorsements: string
  yearsExperience: string
  previousEmployers: string
  availability: string
  resumeSummary: string
  additionalInfo: string
}

export type AffiliateInquiry = {
  company: string
  contactName: string
  email: string
  phone: string
  city: string
  state: string
  fleetSize: string
  message: string
}

export type NewsletterSignup = {
  email: string
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export const contactSubjects = [
  "New trip or quote question",
  "Existing reservation",
  "Pricing and payment",
  "Feedback about a trip",
  "Something else",
]

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

function readStrings<T extends Record<string, string>>(
  payload: unknown,
  keys: (keyof T)[]
): T {
  const source =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {}
  const result = {} as T
  for (const key of keys) {
    const value = source[key as string]
    result[key] = (typeof value === "string" ? value.trim() : "") as T[keyof T]
  }
  return result
}

export function toContactMessage(payload: unknown): ContactMessage {
  return readStrings<ContactMessage>(payload, [
    "name",
    "email",
    "phone",
    "subject",
    "message",
  ])
}

export function validateContactMessage(
  data: ContactMessage
): FieldErrors<ContactMessage> {
  const errors: FieldErrors<ContactMessage> = {}
  if (data.name.length < 2) {
    errors.name = "Enter your name so we know who we're writing back to."
  }
  if (!emailPattern.test(data.email)) {
    errors.email = "Enter a valid email address for our reply."
  }
  if (data.phone && data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a valid phone number, or leave it blank."
  }
  if (!data.subject) {
    errors.subject = "Choose the option closest to your question."
  }
  if (data.message.length < 10) {
    errors.message = "Tell us a little more so we can point you the right way."
  }
  return errors
}

export function toDriverApplication(payload: unknown): DriverApplication {
  return readStrings<DriverApplication>(payload, [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "zip",
    "cdlNumber",
    "cdlExpiration",
    "cdlEndorsements",
    "yearsExperience",
    "previousEmployers",
    "availability",
    "resumeSummary",
    "additionalInfo",
  ])
}

export function validateDriverApplication(
  data: DriverApplication
): FieldErrors<DriverApplication> {
  const errors: FieldErrors<DriverApplication> = {}
  if (data.firstName.length < 2) {
    errors.firstName = "Enter your first name."
  }
  if (data.lastName.length < 2) {
    errors.lastName = "Enter your last name."
  }
  if (!emailPattern.test(data.email)) {
    errors.email = "Enter a valid email address."
  }
  if (data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter the phone number we should call you at."
  }
  if (!data.address) {
    errors.address = "Enter your street address."
  }
  if (!data.city) {
    errors.city = "Enter your city."
  }
  if (!data.state) {
    errors.state = "Enter your state."
  }
  if (!data.zip) {
    errors.zip = "Enter your ZIP code."
  }
  if (!data.cdlNumber) {
    errors.cdlNumber = "Enter your CDL number."
  }
  if (!datePattern.test(data.cdlExpiration)) {
    errors.cdlExpiration = "Choose your CDL expiration date."
  }
  if (!data.cdlEndorsements) {
    errors.cdlEndorsements =
      "List your endorsements — a P (Passenger) endorsement is required."
  }
  const years = Number(data.yearsExperience)
  if (!data.yearsExperience || Number.isNaN(years) || years < 0) {
    errors.yearsExperience =
      "Enter your years of commercial driving experience."
  }
  if (!data.availability) {
    errors.availability =
      "Tell us your availability — full-time, part-time, or weekends."
  }
  return errors
}

export function toAffiliateInquiry(payload: unknown): AffiliateInquiry {
  return readStrings<AffiliateInquiry>(payload, [
    "company",
    "contactName",
    "email",
    "phone",
    "city",
    "state",
    "fleetSize",
    "message",
  ])
}

export function validateAffiliateInquiry(
  data: AffiliateInquiry
): FieldErrors<AffiliateInquiry> {
  const errors: FieldErrors<AffiliateInquiry> = {}
  if (data.company.length < 2) {
    errors.company = "Enter your company name."
  }
  if (data.contactName.length < 2) {
    errors.contactName = "Enter the name of the person we should contact."
  }
  if (!emailPattern.test(data.email)) {
    errors.email = "Enter a valid email address."
  }
  if (data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter the phone number we should call."
  }
  if (!data.city) {
    errors.city = "Enter the city your operation is based in."
  }
  if (!data.state) {
    errors.state = "Enter your state."
  }
  return errors
}

export function toNewsletterSignup(payload: unknown): NewsletterSignup {
  return readStrings<NewsletterSignup>(payload, ["email"])
}

export function validateNewsletterSignup(
  data: NewsletterSignup
): FieldErrors<NewsletterSignup> {
  const errors: FieldErrors<NewsletterSignup> = {}
  if (!emailPattern.test(data.email)) {
    errors.email = "Enter a valid email address."
  }
  return errors
}
