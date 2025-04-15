"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Info,
  XCircle,
  AlertOctagon,
} from "lucide-react"
import { CommonTable } from "@/components/CommonTable"
import { number } from "zod"

const severities = [
  {
    label: "A but informatif",
    number: "1. ",
    color: "bg-green-500",
    icon: <Info className="w-4 h-4 text-white" />,
  },
  {
    label: "Attention",
    number: "2. ",
    color: "bg-yellow-400",
    icon: <AlertTriangle className="w-4 h-4 text-white" />,
  },
  {
    label: "Erreur",
    number: "3. ",
    color: "bg-red-500",
    icon: <XCircle className="w-4 h-4 text-white" />,
  },
  {
    label: "Problème majeur (erreur critique)",
    number: "4. ",
    color: "bg-black",
    icon: <AlertOctagon className="w-4 h-4 text-white" />,
  },
]

const data = [
  {
    id: "1",
    employee: "Elie",
    severity: "A but informatif",
    image: "https://picsum.photos/200/300",
    ip: "41.211.144.193",
    device: "Macbook Pro",
    deviceIp: "192.168.123.132",
    role: "Caisse",
    datetime: "14/05/2025 14:30",
  },
  {
    id: "2",
    number: "2.",
    employee: "Elie",
    severity: "A but informatif",
    image: "https://picsum.photos/200/300",
    ip: "41.211.144.193",
    device: "Macbook Pro",
    deviceIp: "192.168.123.132",
    role: "Caisse",
    datetime: "14/05/2025 15:30",
  },
  {
    id: "3",
    employee: "Elie",
    severity: "A but informatif",
    image: "https://picsum.photos/200/300",
    ip: "41.211.144.193",
    device: "Macbook Pro",
    deviceIp: "192.168.123.132",
    role: "Caisse",
    datetime: "14/05/2025 15:50",
  },
  {
    id: "4",
    employee: "Elie",
    severity: "A but informatif",
    image: "https://picsum.photos/200/300",
    ip: "41.211.144.193",
    device: "Macbook Pro",
    deviceIp: "192.168.123.132",
    role: "Caisse",
    datetime: "14/05/2025 16:20",
  },
  {
    id: "5",
    employee: "Elie",
    severity: "A but informatif",
    image: "https://picsum.photos/200/300",
    ip: "41.211.144.193",
    device: "Macbook Pro",
    deviceIp: "192.168.123.132",
    role: "Caisse",
    datetime: "14/05/2025 17:45",
  },
]

export default function BodyLogs() {
  const getSeverityStyle = (severityLabel: string) => {
    return severities.find((s) => s.label === severityLabel)
  }

  const headers = [
    {
      key: "checkbox",
      label: <Checkbox className="h-4 w-4" />,
      width: "40px",
      align: "center" as const,
    },
    {
      key: "employee",
      label: "Employé",
      sortable: true,
    },
    {
      key: "severity",
      label: "Gravité",
      sortable: true,
    },
    {
      key: "connection",
      label: "Connexion",
    },
    {
      key: "device",
      label: "Type d'objet ID",
    },
    {
      key: "role",
      label: "Rôle",
      sortable: true,
    },
    {
      key: "datetime",
      label: "Date et Heure",
      sortable: true,
    },
  ]

  const rows = data.map((row) => {
    const severity = getSeverityStyle(row.severity)
    return {
      id: row.id,
      checkbox: <Checkbox />,
      employee:
        (
          <div className="flex items-center gap-2">
            <img src={row.image} alt="Image de l'employé" className="w-10 h-10 rounded-full" />
            <div className="font-bold">

              {row.employee}
            </div>
          </div>
        ),
      severity: (
        <Badge className={`${severity?.color} text-white flex items-center gap-1 w-[70%] h-8 rounded-full `}>
          {severity?.icon}
          {row.severity}
        </Badge>
      ),
      connection: `Connexion au back-office depuis ${row.ip}`,
      device: (
        <>
          {row.device}<br />
          {row.deviceIp}
        </>
      ),
      role: row.role,
      datetime: row.datetime,
    }
  })

  const handleSort = (key: string) => {
    console.log("Sort by:", key)
    // Implémentez votre logique de tri ici
  }

  return (
    <div className=" space-y-6">
      {/* Gravité */}
      <div className="">
        <h2 className="text-base font-semibold flex items-center gap-2 px-5 py-3">
          <AlertTriangle className="w-8 h-8" color="white" fill="gray" />
          Niveau de gravité
        </h2>

        <p className="font-bold border-gray-100 border-t-2 py-3 px-5">
          Signification des niveaux de gravité :
        </p>


        <ul className="space-y-2 text-sm px-5">
          {severities.map((severity, idx) => (
            <li key={idx} className="flex items-center gap-2 px-5">
              <span className="font-bold">{severity.number}</span>
              <span className={`text-white text-xs px-3 py-2 font-bold rounded-full flex items-center gap-1 ${severity.color}`}>
                {severity.icon}
                {severity.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tableau */}
      <div className="rounded px-5 overflow-x-auto">
        <CommonTable
          headers={headers}
          rows={rows}
          headerClassName="bg-gray-100"
          onSort={handleSort}
        />
      </div>
    </div>
  )
}