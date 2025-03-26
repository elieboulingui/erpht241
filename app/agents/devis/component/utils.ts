import type { Product } from "./types"

export function calculateProductTotal(product: Product): number {
  const subtotal = product.quantity * product.price
  const discountAmount = subtotal * (product.discount / 100)
  const taxAmount = (subtotal - discountAmount) * (product.tax / 100)
  return subtotal - discountAmount + taxAmount
}

export function getTotalAmount(products: Product[]): number {
  return products.reduce((sum, product) => sum + product.total, 0)
}

