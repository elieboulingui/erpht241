'use client'
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, XCircle, AlertOctagon } from "lucide-react";
import { CommonTable } from "@/components/CommonTable";

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
];

export default function BodyLogs() {
  const pathname = usePathname();
  const [logs, setLogs] = useState<any[]>([]);

  const organisationId = pathname.split("/")[2]; // ex: cm9h6axxp0007vm1kh876x48c

  const getSeverityStyle = (severityLabel: string) => {
    return severities.find((s) => s.label === severityLabel);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/organisation/log?id=${organisationId}`);
        const json = await res.json();
        setLogs(json || []); // Ensure that we handle empty or malformed data gracefully
      } catch (err) {
        console.error("Erreur lors de la récupération des logs :", err);
      }
    };

    if (organisationId) fetchLogs();
  }, [organisationId]);

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
  ];

  const rows = logs.map((row) => {
    const severity = getSeverityStyle(row.severity);
    const user = row.user || {}; // Avoid null or undefined user

    return {
      id: row.id,
      checkbox: <Checkbox />,
      employee: (
        <div className="flex items-center gap-2">
          <img
            src={user.image || "/default-avatar.png"} // Fallback to a default image if user.image is not available
            alt="Image de l'employé"
            className="w-10 h-10 rounded-full"
          />
          <div className="font-bold">{user.name || "Nom non disponible"}</div> {/* Fallback if user.name is not available */}
        </div>
      ),
      severity: (
        <Badge className={`${severity?.color} text-white flex items-center gap-1 w-[70%] h-8 rounded-full`}>
          {severity?.icon}
          {row.severity}
        </Badge>
      ),
      connection: `Connexion au back-office depuis ${row.ip}`, // Assuming 'ip' exists in row
      device: (
        <>
          {row.device}<br />
          {row.deviceIp} {/* Assuming 'deviceIp' exists in row */}
        </>
      ),
      role: user.role || "Rôle non disponible", // Fallback if user.role is not available
      datetime: row.createdAt, // Assuming 'createdAt' is available in the log object
    };
  });

  const handleSort = (key: string) => {
    console.log("Sort by:", key);
    // Implémentez la logique de tri ici si nécessaire
  };

  return (
    <div className="space-y-6">
      {/* Gravité */}
      <div>
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
  );
}
