// import type { ReactNode } from "react"

// export interface Contact {
//   name: string
//   email: string
//   phone: string
//   address: string
//   logo?: string
//   icon?: ReactNode
//   niveau: string
//   tags: string[]
//   status_contact: string
//   sector: string
// }





// types/contact.ts
import * as React from "react";

export interface Contact {
  id: string;
  name: string;
  logo?: string;
  icon?: string | React.JSX.Element;
  email?: string | null;
  phone: string;
  link: string;
  niveau: "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT" | string;
  adresse?: string;
  tags: string;
  status_contact: string;
  sector: string;
}

export interface UpdatedContact {
  id: string;
  name: string;
  logo?: string;
  icon?: string | React.JSX.Element;
  email?: string | null;
  phone: string;
  link: string;
  niveau: string;
  adresse?: string;
  tags: string;
  status_contact: string;
  sector: string;
}