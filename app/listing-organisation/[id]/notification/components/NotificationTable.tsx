// components/NotificationTable.tsx
"use client"

import { CommonTable } from "@/components/CommonTable"
import { useNotifications } from "./NotificationContext"

export default function NotificationTable() {
  const { notifications, markAsRead } = useNotifications()

  const headers = [
    { key: 'title', label: 'Titre', width: '25%', sortable: true },
    { key: 'message', label: 'Message', width: '40%', sortable: true },
    { 
      key: 'timestamp', 
      label: 'Date',
      width: '20%',
      sortable: true 
    },
    { 
      key: 'read', 
      label: 'Statut',
      width: '15%',
      sortable: true,
      align: 'center' as const
    }
  ]

  const rows = notifications.map(n => ({
    id: n.id,
    title: <span className="font-medium">{n.title}</span>,
    message: n.message,
    timestamp: new Date(n.timestamp).toLocaleString(),
    read: n.read ? (
      <span className="text-green-500">Lu</span>
    ) : (
      <span className="text-red-500">Non lu</span>
    )
  }))

  const handleSort = (key: string) => {
    // Implémentez votre logique de tri ici
    console.log(`Trier par ${key}`)
  }

  return (
    <div className="p-4">
      <CommonTable 
        headers={headers}
        rows={rows}
        rowClassName="transition-colors"
        onRowClick={markAsRead}
        onSort={handleSort}
        emptyState={
          <div className="py-4 text-center text-gray-500">
            Aucune notification disponible
          </div>
        }
      />
    </div>
  )
}