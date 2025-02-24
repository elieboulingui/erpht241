"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface NavigationLinkProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  active?: boolean
}

export function NavigationLink({ href, icon: Icon, children, active: forcedActive }: NavigationLinkProps) {
  const pathname = usePathname()
  const active = forcedActive || pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        active ? "text-black" : " hover:bg-gray-100 hover:border "
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}