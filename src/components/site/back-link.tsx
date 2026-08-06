import Link from "next/link"

function BackLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-base font-medium text-muted-foreground hover:text-primary hover:underline"
    >
      ← {children}
    </Link>
  )
}

export { BackLink }
