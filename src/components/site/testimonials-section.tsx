import { testimonials } from "@/data/testimonials"
import { Card, CardContent } from "@/components/ui/card"

function TestimonialsSection() {
  return (
    <ul className="grid gap-6 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <li key={testimonial.name}>
          <Card className="h-full">
            <CardContent className="flex h-full flex-col">
              <span
                aria-hidden="true"
                className="font-heading text-5xl leading-none text-accent"
              >
                &ldquo;
              </span>
              <blockquote className="mt-2 flex-1">
                <p>{testimonial.quote}</p>
              </blockquote>
              <footer className="mt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-muted-foreground">{testimonial.role}</p>
              </footer>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}

export { TestimonialsSection }
