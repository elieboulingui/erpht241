export interface Product {
  id: number
  name: string
  quantity: number
  price: number
  discount: number
  tax: number
  total: number
}

export interface Client {
  name: string
  email: string
  address: string
}

export interface DevisFormProps {
  initialData: {
    client: Client
    paymentMethod: string
    sendLater: boolean
    terms: string
    products: Array<{
      id: number
      name: string
      quantity: number
      price: number
      discount: number
      tax: number
    }>
  }
}

