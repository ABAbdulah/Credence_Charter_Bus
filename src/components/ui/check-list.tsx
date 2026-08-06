import { CheckCircle2 } from "lucide-react"

function CheckList({
  items,
  className,
}: {
  items: string[]
  className: string
}) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <CheckCircle2
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-accent-deep"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export { CheckList }
