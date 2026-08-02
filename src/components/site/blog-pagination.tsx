import Link from "next/link"

import { cn } from "@/lib/utils"

const pageLinkClass =
  "flex min-h-11 min-w-11 items-center justify-center rounded-md px-3 font-medium transition-colors duration-150"

function blogPageHref(page: number) {
  return page === 1 ? "/blogs" : `/blogs/page/${page}`
}

function BlogPagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null

  return (
    <nav aria-label="Blog pages" className="mt-10 flex flex-wrap items-center gap-2">
      {page > 1 && (
        <Link
          href={blogPageHref(page - 1)}
          rel="prev"
          className={cn(pageLinkClass, "text-primary hover:bg-muted")}
        >
          ← Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) =>
        number === page ? (
          <span
            key={number}
            aria-current="page"
            className={cn(pageLinkClass, "bg-primary text-primary-foreground")}
          >
            {number}
          </span>
        ) : (
          <Link
            key={number}
            href={blogPageHref(number)}
            aria-label={`Page ${number}`}
            className={cn(pageLinkClass, "text-primary ring-1 ring-border hover:bg-muted")}
          >
            {number}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link
          href={blogPageHref(page + 1)}
          rel="next"
          className={cn(pageLinkClass, "text-primary hover:bg-muted")}
        >
          Next →
        </Link>
      )}
    </nav>
  )
}

export { BlogPagination, blogPageHref }
