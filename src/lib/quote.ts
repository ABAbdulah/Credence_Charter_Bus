export type QuoteRequest = {
  name: string
  phone: string
  email: string
  contactMethod: string
  tripType: string
  vehicle: string
  passengers: string
  pickupLocation: string
  destination: string
  departureDate: string
  departureTime: string
  returnDate: string
  returnTime: string
  notes: string
}

export type QuoteFieldErrors = Partial<Record<keyof QuoteRequest, string>>

export type QuoteOption = { value: string; label: string }

export const tripTypes: QuoteOption[] = [
  { value: "one-way", label: "One-way" },
  { value: "round-trip", label: "Round-trip" },
  { value: "multi-day", label: "Multi-day" },
  { value: "other", label: "Other" },
]

export const contactMethods: QuoteOption[] = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "either", label: "Either" },
]

const returnLegTripTypes = new Set(["round-trip", "multi-day", "other"])

export function needsReturnLeg(tripType: string): boolean {
  return returnLegTripTypes.has(tripType)
}

function labelFor(options: QuoteOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value
}

export function tripTypeLabel(value: string): string {
  return labelFor(tripTypes, value)
}

export function contactMethodLabel(value: string): string {
  return labelFor(contactMethods, value)
}

export const emptyQuoteRequest: QuoteRequest = {
  name: "",
  phone: "",
  email: "",
  contactMethod: "either",
  tripType: "",
  vehicle: "",
  passengers: "",
  pickupLocation: "",
  destination: "",
  departureDate: "",
  departureTime: "",
  returnDate: "",
  returnTime: "",
  notes: "",
}

export function toQuoteRequest(payload: unknown): QuoteRequest {
  const source =
    typeof payload === "object" && payload !== null
      ? (payload as Record<string, unknown>)
      : {}
  const read = (key: keyof QuoteRequest) => {
    const value = source[key]
    return typeof value === "string" ? value.trim() : ""
  }
  return {
    name: read("name"),
    phone: read("phone"),
    email: read("email"),
    contactMethod: read("contactMethod"),
    tripType: read("tripType"),
    vehicle: read("vehicle"),
    passengers: read("passengers"),
    pickupLocation: read("pickupLocation"),
    destination: read("destination"),
    departureDate: read("departureDate"),
    departureTime: read("departureTime"),
    returnDate: read("returnDate"),
    returnTime: read("returnTime"),
    notes: read("notes"),
  }
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^\d{2}:\d{2}$/

export function validateQuote(data: QuoteRequest): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {}
  if (data.name.length < 2) {
    errors.name = "Enter your name so we know who to address the quote to."
  }
  if (data.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter the phone number we should call about your trip."
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Enter a valid email address for your written quote."
  }
  if (!tripTypes.some((option) => option.value === data.tripType)) {
    errors.tripType = "Choose whether the trip is one-way, round-trip, or longer."
  }
  const passengerCount = Number(data.passengers)
  if (
    !data.passengers ||
    !Number.isInteger(passengerCount) ||
    passengerCount < 1
  ) {
    errors.passengers = "Enter how many people are traveling."
  }
  if (!data.pickupLocation) {
    errors.pickupLocation = "Enter the city or address where the trip starts."
  }
  if (!data.destination) {
    errors.destination = "Enter where the group is headed."
  }
  if (!datePattern.test(data.departureDate)) {
    errors.departureDate = "Choose your departure date."
  }

  const wantsReturn = needsReturnLeg(data.tripType)
  if (!timePattern.test(data.departureTime)) {
    errors.departureTime = "Choose the time the group should be picked up."
  }
  if (wantsReturn && !timePattern.test(data.returnTime)) {
    errors.returnTime = "Choose the time the group heads back."
  }
  if (data.tripType === "other" && data.notes.length < 10) {
    errors.notes = "Describe the trip so we can price it accurately."
  }
  if (data.returnDate && !datePattern.test(data.returnDate)) {
    errors.returnDate = "Choose a valid return date."
  } else if (wantsReturn && !data.returnDate) {
    errors.returnDate = "Choose your return date."
  } else if (
    datePattern.test(data.returnDate) &&
    datePattern.test(data.departureDate) &&
    data.returnDate < data.departureDate
  ) {
    errors.returnDate = "The return date can't be before the departure date."
  }
  return errors
}
