import Link from "next/link"

interface CompanyLinkProps {
  name: string
  color: string
}

export function CompanyLink({ name, color }: CompanyLinkProps) {
  const slug = name.toLowerCase()
  return (
    <Link
      href={`/contacts/${slug}`}
      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:text-primary"
    >
      <div className="flex h-4 w-4 items-center justify-center rounded-sm" style={{ backgroundColor: color }} />
      {name}
    </Link>
  )
}