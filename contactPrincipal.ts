import type React from "react"
export interface ContactPrincipal {
  id: string
  name: string
  logo?: string
  icon?: string | React.JSX.Element
  email: string
  phone: string
  link: string
  niveau: "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT" | string
  adresse: string
  tags: string | string[]
  status_contact: string
}

