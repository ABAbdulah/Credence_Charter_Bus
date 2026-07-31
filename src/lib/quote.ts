export type QuoteRequest = {
  name: string
  phone: string
  email: string
  tripType: string
  vehicle: string
  passengers: string
  pickupLocation: string
  destination: string
  departureDate: string
  returnDate: string
  notes: string
}

export type QuoteFieldErrors = Partial<Record<keyof QuoteRequest, string>>

export const emptyQuoteRequest: QuoteRequest = {
  name: "",
  phone: "",
  email: "",
  tripType: "",
  vehicle: "",
  passengers: "",
  pickupLocation: "",
  destination: "",
  departureDate: "",
  returnDate: "",
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
    tripType: read("tripType"),
    vehicle: read("vehicle"),
    passengers: read("passengers"),
    pickupLocation: read("pickupLocation"),
    destination: read("destination"),
    departureDate: read("departureDate"),
    returnDate: read("returnDate"),
    notes: read("notes"),
  }
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/

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
  if (!data.tripType) {
    errors.tripType = "Choose the option closest to your trip."
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
  if (data.returnDate) {
    if (!datePattern.test(data.returnDate)) {
      errors.returnDate = "Choose a valid return date."
    } else if (
      datePattern.test(data.departureDate) &&
      data.returnDate < data.departureDate
    ) {
      errors.returnDate = "The return date can't be before the departure date."
    }
  }
  return errors
}
