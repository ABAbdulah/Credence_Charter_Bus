import { cn } from "@/lib/utils"

function BulletDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("mt-2.5 size-2 shrink-0 rounded-full bg-accent", className)}
    />
  )
}

function BulletList({
  items,
  className,
}: {
  items: { key: string; content: React.ReactNode }[]
  className?: string
}) {
  return (
    <ul className={cn("mt-4 flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item.key} className="flex items-start gap-3">
          <BulletDot />
          {item.content}
        </li>
      ))}
    </ul>
  )
}

export { BulletDot, BulletList }
