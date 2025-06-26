'use client'
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, XCircle, AlertOctagon } from "lucide-react";
import { CommonTable } from "@/components/CommonTable";
import PaginationGlobal from "@/components/paginationGlobal";
import Chargement from "@/components/Chargement";

// ... autres imports

const severities = [
  {
    label: "A but informatif",
    number: "1. ",
    color: "bg-green-500",
    icon: <Info className="w-4 h-4 text-white" />,
    value: "A but informatif"
  },
  {
    label: "Attention",
    number: "2. ",
    color: "bg-yellow-400",
    icon: <AlertTriangle className="w-4 h-4 text-white" />,
    value: "Attention"
  },
  {
    label: "Erreur",
    number: "3. ",
    color: "bg-red-500",
    icon: <XCircle className="w-4 h-4 text-white" />,
    value: "Erreur"
  },
  {
    label: "Problème majeur (erreur critique)",
    number: "4. ",
    color: "bg-black",
    icon: <AlertOctagon className="w-4 h-4 text-white" />,
    value: "Problème majeur (erreur critique)"
  },
];

export default function BodyLogs({ searchQuery }: { searchQuery: string }) {
  const pathname = usePathname();
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);

  const organisationId = pathname.split("/")[2];

  const getSeverityStyle = (severityLabel: string) => {
    return severities.find((s) => s.label === severityLabel);
  };

  const filterLogs = useCallback(() => {
    let filtered = [...logs];

    // Filtre par recherche texte
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter(log => {
        const user = log.user || {};
        return (
          user.name?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query) ||
          log.severity?.toLowerCase().includes(query) ||
          log.ipAddress?.toLowerCase().includes(query) ||  // Filtrage par adresse IP
          log.device?.toLowerCase().includes(query) ||
          log.createdAt?.toLowerCase().includes(query)
        );
      });
    }

    if (selectedSeverities.length > 0) {
      filtered = filtered.filter(log =>
        selectedSeverities.includes(log.severity)
      );
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après un nouveau filtre
  }, [logs, searchQuery, selectedSeverities]);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/organisation/log?id=${organisationId}`);
        const json = await res.json();
        setLogs(json || []);
        setFilteredLogs(json || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des logs :", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (organisationId) fetchLogs();
  }, [organisationId]);

  const toggleSeverity = (severityValue: string) => {
    setSelectedSeverities(prev =>
      prev.includes(severityValue)
        ? prev.filter(s => s !== severityValue)
        : [...prev, severityValue]
    );
  };

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
      key: "action",
      label: "Action effectuée",
      sortable: true,
    },
    {
      key: "ipAddress",
      label: "Adresse IP",
      sortable: true,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
    },
    {
      key: "duration",
      label: "Durée",
      sortable: true,
    },
    {
      key: "browser",
      label: "Navigateur",
      sortable: true,
    },
    {
      key: "location",
      label: "Localisation",
      sortable: true,
    },
    {
      key: "datetime",
      label: "Date et Heure",
      sortable: true,
    },
  ];

  const rows = filteredLogs.map((row) => {
    const severity = getSeverityStyle(row.severity);
    const user = row.user || {};

    return {
      id: row.id,
      checkbox: <Checkbox />,
      employee: (
        <div className="flex items-center gap-2">
          <div className="font-bold">{user.name || "Nom non disponible"}</div>
        </div>
      ),
      severity: (
        <Badge className={`${severity?.color} text-white flex items-center gap-1 w-8 h-8 rounded-full`}>
          {severity?.icon}
          {row.severity}
        </Badge>
      ),
      connection: `Connexion au back-office depuis ${row.ipAddress}`,
      device: (
        <>
          {row.device}<br />
          {row.deviceIp}
        </>
      ),
      role: user.role || "Rôle non disponible",
      action: row.action || "Non spécifiée",
      ipAddress: row.ipAddress || "N/A",
      status: row.status || "Terminé",
      duration: row.duration || "N/A",
      browser: row.browser || "Inconnu",
      location: row.location || "Non disponible",
      datetime: row.createdAt,
    };
  });

  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
              <button
                onClick={() => toggleSeverity(severity.value)}
                className={`text-white text-xs px-3 py-2 font-bold rounded-full flex items-center gap-1 ${severity.color} ${selectedSeverities.includes(severity.value) ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
              >
                {severity.icon}
                {severity.label}
              </button>
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
          <>
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10">
                {searchQuery || selectedSeverities.length > 0
                  ? "Aucun résultat trouvé pour vos critères de recherche."
                  : "Aucun log disponible."}
              </div>
            ) : (
              <CommonTable
                headers={headers}
                rows={paginatedRows}
                headerClassName="bg-gray-100"
              />
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredLogs.length > 0 && (
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
