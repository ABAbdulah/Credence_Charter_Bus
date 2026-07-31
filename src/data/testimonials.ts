export type Testimonial = {
  quote: string
  name: string
  role: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "The bus was spotless, the driver was early, and our 47 guests all made it from the hotel to the ceremony without a single hiccup. One less thing to worry about on a wedding day is worth a lot.",
    name: "Margaret H.",
    role: "Mother of the bride",
  },
  {
    quote:
      "We move our sales team to three conferences a year and Credence has made it routine. Same coordinator every time, invoice matches the quote, bus is where it should be.",
    name: "David R.",
    role: "Operations manager",
  },
  {
    quote:
      "Booking a charter for our church retreat felt daunting until I called. They walked me through the options, the quote was clear, and the driver treated our seniors with real patience and care.",
    name: "Pastor James W.",
    role: "Group trip organizer",
  },
]
