'use client'

import { CommonTable } from '@/components/CommonTable'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { MoreHorizontal, SlidersHorizontal } from 'lucide-react'
import PaginationGlobal from "@/components/paginationGlobal"
import { useState } from 'react'

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
  {
    id: '6',
    name: 'Tech Solutions',
    status: 'Active',
    address: 'Quartier Louis, Libreville',
    domain: 'Informatique',
  },
  {
    id: '7',
    name: 'Digital Gabon',
    status: 'Inactive',
    address: 'Mont-Bouët, Libreville',
    domain: 'Services Numériques',
  },
  {
    id: '8',
    name: 'Innovatech',
    status: 'Active',
    address: 'Nzeng-Ayong, Libreville',
    domain: 'Innovation',
  },
  {
    id: '9',
    name: 'Web Masters',
    status: 'Active',
    address: 'Glass, Libreville',
    domain: 'Développement Web',
  },
  {
    id: '10',
    name: 'Data Systems',
    status: 'Inactive',
    address: 'Akébé, Libreville',
    domain: 'Base de données',
  },
  {
    id: '11',
    name: 'Cloud Experts',
    status: 'Active',
    address: 'Okala, Libreville',
    domain: 'Cloud Computing',
  },
]

export default function VeilleConcurentielle() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

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
      label: 'Statut',
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

  // Calcul des données paginées
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedCompanies = companies.slice(startIndex, endIndex)

  const rows = paginatedCompanies.map(company => ({
    id: company.id,
    checkbox: <Checkbox />,
    name: (
      <div className="font-medium flex items-center gap-2">
        <div className="bg-gray-100 rounded-full p-2">
          <span className="text-gray-500">👤</span>
        </div>
        {company.name}
      </div>
    ),
    status: (
      <Badge className={company.status === 'Active' ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"}>
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
        className="text-blue-600 underline hover:text-blue-800"
      >
        {company.url.replace(/^https?:\/\//, '')}
      </a>
    ) : '-',
    actions: <MoreHorizontal className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />,
  }))

  const handleSort = (key: string) => {
    console.log('Sort by:', key)
    // Implémentez votre logique de tri ici
  }

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-lg overflow-hidden p-5 bg-white flex-grow">
        <CommonTable
          headers={headers}
          rows={rows}
          headerClassName="bg-gray-100"
          onSort={handleSort}
          className="border border-gray-200 rounded-lg"
        />
      </div>
      
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(companies.length / rowsPerPage)}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={companies.length}
      />
    </div>
  )
}