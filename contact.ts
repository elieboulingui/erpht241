import type { ReactNode } from "react"

export interface Contact {
  name: string
  email: string
  phone: string
  address: string
  logo?: string
  icon?: ReactNode
  niveau: string
  tags: string[]
  status_contact: string
}

