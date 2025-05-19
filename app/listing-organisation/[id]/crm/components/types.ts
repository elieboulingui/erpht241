export type Contact = {
  id: string
  name: string
  email?: string
  phone?: string
  position?: string
  avatar?: string
}

export type Merchant = {
  id: string
  name: string
  photo: string
  phone: string
  email: string
  role: string
  contacts: Contact[]
}

export type Deal = {
  id: string
  label: string
  description?: string
  amount: number
  merchantId?: string
  tags: string[]
  tagColors: string[]
  icons?: string[]
  contactId?: string
  avatar?: string
  iconColors?: string[]
  deadline?: string
  stepId?: any
  stepNumber: number; // <-- Ajouté ici
  assignedUserId?: string
}

export type DealStage = {
  id: string
  label: string
  color: string
  stepNumber: number; // <-- Ajouté ici
  opportunities: Deal[]
}

// Modifions le type DealStag pour rendre la propriété color optionnelle ou nullable
export type DealStag = {
  opportunities: any[]
  id: string
  label: string
  stepNumber:any
  color: string | null
}

// Ajoutons également un type pour le retour de la fonction addStep
export type AddStepResponse = {
  success: boolean
  error?: string
  id?: string
  newStep?: {
    id: string
    label: string
    color: string | null
    description: string
    organisationId: string
    stepNumber: number
  }
}

export const INITIAL_DEAL_STAGES: DealStage[] = []

export const merchantsData: Merchant[] = []

export const initialDealsData: Record<string, Deal[]> = {}
