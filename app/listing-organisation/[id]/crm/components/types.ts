export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  avatar?: string;
};

export type Merchant = {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  role: string;
  contacts: Contact[];
};

export type Deal = {
  id: string;
  label: string;
  description?: string;
  amount: number;
  merchantId?: string;
  tags: string[];
  tagColors: string[];
  icons?: string[];
  contactId?: string;
  avatar?: string;
  iconColors?: string[];
  deadline?: string;
  stepId?: any;
  assignedUserId?: string;
};

export type DealStage = {
  id: string;
  label: string;
  color: string;
  opportunities: Deal[]
};
export type DealStag = {
  id: string;
  label: string;
  color: string;
  
};

export const INITIAL_DEAL_STAGES: DealStage[] = [

];

export const merchantsData: Merchant[] = [
 
];

export const initialDealsData: Record<string, Deal[]> = {
 
};