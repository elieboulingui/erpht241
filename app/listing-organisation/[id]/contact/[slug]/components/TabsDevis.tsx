"use client"
import React, { useState, useEffect } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  
} from "@tanstack/react-table";
import PaginationGlobal from "@/components/paginationGlobal";
import { selectionColumn } from "@/components/SelectionColumn";
import DevisAIGenerator from "@/app/agents/devis/component/ai-contact-devis-generator";
import { toast } from "sonner";
import DevisDetailsModal from "../ajout-devis/devis-details-modal";
import EditDevisModal from "../ajout-devis/edit-devis-modal";
import { DeleteDevisDialog } from "../ajout-devis/archive-devis-dialog";
import ChatModal from "@/app/agents/devis/component/chat";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Devis {
  id: string;
  devisNumber: string;
  totalAmount: number;
  taxAmount: number;
  taxType: string;
  totalWithTax: number;
  status: string;
}

const DevisTable = () => {
  const [data, setData] = useState<Devis[]>([]);

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const url = window.location.href;
        const regex = /\/contact\/([a-zA-Z0-9]+)/;
        const match = url.match(regex);

        if (!match || !match[1]) {
          console.error("Contact ID not found in URL");
          return;
        }

        const contactId = match[1];
        const response = await fetch(`/api/tabsdevis?contactId=${contactId}`);
        const responseData = await response.json();

        console.log("Données brutes API :", responseData);

        if (!responseData.data || !Array.isArray(responseData.data)) {
          console.error("Format de données incorrect");
          return;
        }

        setData(responseData.data); // 🔥 Fix principal : extraire `data`
      } catch (error) {
        console.error("Erreur fetchDevis:", error);
      }
    };

    fetchDevis();
  }, []);

  const columns: ColumnDef<Devis>[] = [
    {
      accessorKey: "id",
      header: "ID Devis",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "devisNumber",
      header: "Numéro de devis",
      cell: ({ row }) => <div>{row.original.devisNumber}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: "Montant total",
      cell: ({ row }) => <div>{row.original.totalAmount} xfa</div>,
    },
    {
      accessorKey: "taxAmount",
      header: "Montant taxe",
      cell: ({ row }) => <div>{row.original.taxAmount} xfa</div>,
    },
    {
      accessorKey: "taxType",
      header: "Type de taxe",
      cell: ({ row }) => <div>{row.original.taxType}</div>,
    },
    {
      accessorKey: "totalWithTax",
      header: "Total avec taxe",
      cell: ({ row }) => <div>{row.original.totalWithTax} xfa</div>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Validé"
                ? "bg-amber-100 text-amber-800"
                : status === "Facturé"
                ? "bg-green-100 text-green-800"
                : status === "ATTENTE"
                ? "bg-pink-200 text-pink-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden shadow-sm">
      {data.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Aucun devis trouvé</div>
      ) : (
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-900 font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default DevisTable;
