import React from 'react'

import { TableProduitIa } from './components/Table'
import { MarqueHeader } from './components/MarqueHeader'


export default function page() {
  return (
    <div>
        <MarqueHeader/>
        <TableProduitIa/>
    </div>
  )
}
