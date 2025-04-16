'use client'
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, XCircle, AlertOctagon } from "lucide-react";
import { CommonTable } from "@/components/CommonTable";
import PaginationGlobal from "@/components/paginationGlobal";
import Chargement from "@/components/Chargement";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const organisationId = pathname.split("/")[2];

  const getSeverityStyle = (severityLabel: string) => {
    return severities.find((s) => s.label === severityLabel);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/organisation/log?id=${organisationId}`);
        const json = await res.json();
        setLogs(json || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des logs :", err);
      } finally {
        setIsLoading(false);
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
    const user = row.user || {};

    return {
      id: row.id,
      checkbox: <Checkbox />,
      employee: (
        <div className="flex items-center gap-2">
          <img
            src={user.image || "/default-avatar.png"}
            alt="Image de l'employé"
            className="w-10 h-10 rounded-full"
          />
          <div className="font-bold">{user.name || "Nom non disponible"}</div>
        </div>
      ),
      severity: (
        <Badge className={`${severity?.color} text-white flex items-center gap-1 w-8 h-8 rounded-full`}>
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
      role: user.role || "Rôle non disponible",
      datetime: row.createdAt,
    };
  });

  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key: string) => {
    console.log("Sort by:", key);
    // Implémentez la logique de tri ici si nécessaire
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Gravité */}
      <div>
        <h2 className="text-base font-semibold flex items-center gap-2 px-5 py-3">
          <AlertTriangle className="w-8 h-8" color="white" fill="gray" />
          Niveau de gravité
        </h2>

        <p className="font-bold border-gray-100 border-t-2 py-3 px-5">
          Signification des niveaux de gravité :
        </p>

        <ul className="flex text-sm px-5 flex-wrap gap-2">
          {severities.map((severity, idx) => (
            <li key={idx} className="flex items-center">
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
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Chargement />
          </div>
        ) : (
          <CommonTable
            headers={headers}
            rows={paginatedRows}
            headerClassName="bg-gray-100"
            onSort={handleSort}
          />
        )}
      </div>

      {/* Pagination */}
      {!isLoading && rows.length > 0 && (
        <PaginationGlobal
          currentPage={currentPage}
          totalPages={Math.ceil(rows.length / rowsPerPage)}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
          totalItems={rows.length}
        />
      )}
    </div>
  );
}