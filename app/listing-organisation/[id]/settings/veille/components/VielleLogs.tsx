'use client'

import { CommonTable } from '@/components/CommonTable'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react'

const companies = [
  {
    id: '1',
    name: 'Gabon Meca',
    status: 'Active',
    address: 'Alfred Marche, Libreville',
    domain: 'Numérique',
    url: 'https://gabonmeca.com/',
  },
  {
    id: '2',
    name: 'INNA tech',
    status: 'Active',
    address: 'Marché de Nkembo, Libreville',
    domain: 'Numérique',
  },
  {
    id: '3',
    name: 'Kali Tech',
    status: 'Active',
    address: 'Marché, Oloumi, Libreville',
    domain: 'Produit Informatique',
  },
  {
    id: '4',
    name: 'El Tech',
    status: 'Active',
    address: 'Alfred Marche, Libreville',
    domain: 'Numérique',
  },
  {
    id: '5',
    name: 'Elite Tech',
    status: 'Active',
    address: 'Alfred Marche, Libreville',
    domain: 'Logiciel',
  },
]

export default function VielleLogs() {
  const headers = [
    {
      key: 'checkbox',
      label: <Checkbox className='h-4 w-4' />,
      width: '40px',
      align: 'left' as const,
    },
    {
      key: 'name',
      label: 'Entreprise',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Active',
      sortable: true,
    },
    {
      key: 'address',
      label: 'Adresse',
      sortable: true,
    },
    {
      key: 'domain',
      label: 'Type de domaine',
      sortable: true,
    },
    {
      key: 'url',
      label: 'URL',
      sortable: true,
    },
    {
      key: 'actions',
      label: <SlidersHorizontal className="h-4 w-4" />,
      align: 'right' as const,
    },
  ]

  const rows = companies.map(company => ({
    id: company.id,
    checkbox: <Checkbox />,
    name: (
      <div className="font-medium flex items-center gap-2 ">
        <div className="bg-gray-100 rounded-full p-2">
          <span className="text-gray-500">👤</span>
        </div>
        {company.name}
      </div>
    ),
    status: (
      <Badge className="bg-green-500 hover:bg-green-600">
        {company.status}
      </Badge>
    ),
    address: company.address,
    domain: company.domain,
    url: company.url ? (
      <a 
        href={company.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {company.url.replace(/^https?:\/\//, '')}
      </a>
    ) : '-',
    actions: <MoreHorizontal className="w-4 h-4 text-muted-foreground cursor-pointer" />,
  }))

  const handleSort = (key: string) => {
    console.log('Sort by:', key)
    // Implémentez votre logique de tri ici
  }

  return (
    <div className=" rounded overflow-hidden p-5">
      <CommonTable
        headers={headers}
        rows={rows}
        headerClassName="bg-gray-300"
        onSort={handleSort}
      />
    </div>
  )
}