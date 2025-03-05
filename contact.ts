import type { ReactNode } from "react"

export interface Contact {
  name: string
  email: string
  phone: string
  address: string
  logo?: string
  icon?: ReactNode
  stage: string
  tags: string[]
  record: string
  status_contact: string
}

