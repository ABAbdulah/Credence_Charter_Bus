const steps = [
  {
    title: "Request a quote",
    body: "Tell us your group size, dates, and route — online or over the phone. It takes about two minutes.",
  },
  {
    title: "Receive your estimate",
    body: "We send a clear, itemized quote — driver, fuel, tolls, and taxes included. No surprises later.",
  },
  {
    title: "Sign and ride",
    body: "Approve the agreement and you're booked. Your driver arrives early, and our team stays reachable throughout.",
  },
]

function BookingSteps() {
  return (
    <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
      {steps.map((step, index) => {
        const last = index === steps.length - 1
        return (
          <li key={step.title}>
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-lg font-bold text-accent-foreground"
              >
                {index + 1}
              </span>
              {!last && (
                <span
                  aria-hidden="true"
                  className="hidden h-0.5 flex-1 rounded-full bg-accent/40 md:block"
                />
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-primary">
              {step.title}
            </h3>
            <p className="mt-2 text-muted-foreground">{step.body}</p>
          </li>
        )
      })}
    </ol>
  )
}

export { BookingSteps }
