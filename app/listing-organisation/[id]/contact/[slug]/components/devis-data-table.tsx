"use client"
import React, { useState, useEffect } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"; 
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure you have a Checkbox component

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

        setData(responseData.data); 
      } catch (error) {
        console.error("Erreur fetchDevis:", error);
      }
    };

    fetchDevis();
  }, []);

  const columns: ColumnDef<Devis>[] = [
    {
      id: "select", // ID for selection column
      header: ({ table }) => (
        <Checkbox
          onChange={(e) => {
            const isChecked = 
            table.getRowModel().rows.forEach((row) => {
              row.getToggleSelectedHandler()(isChecked);
            });
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: "id",
      header: () => (
        <div className="flex items-center gap-1">
          ID Devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by ID")}>Filter by ID</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Filter by another option")}>Another Filter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "devisNumber",
      header: () => (
        <div className="flex items-center gap-1">
          Numéro de devis
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by Numéro de devis")}>Filter by Numéro de devis</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.devisNumber}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: () => (
        <div className="flex items-center gap-1">
          Montant total
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by Montant total")}>Filter by Montant total</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.totalAmount} xfa</div>,
    },
    {
      accessorKey: "taxAmount",
      header: () => (
        <div className="flex items-center gap-1">
          Montant taxe
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by Montant taxe")}>Filter by Montant taxe</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.taxAmount} xfa</div>,
    },
    {
      accessorKey: "taxType",
      header: () => (
        <div className="flex items-center gap-1">
          Type de taxe
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by Type de taxe")}>Filter by Type de taxe</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.taxType}</div>,
    },
    {
      accessorKey: "totalWithTax",
      header: () => (
        <div className="flex items-center gap-1">
          Total avec taxe
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by Total avec taxe")}>Filter by Total avec taxe</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => <div>{row.original.totalWithTax} xfa</div>,
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-1">
          Statut
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1 hover:bg-gray-100 transition-colors">
                <Filter className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => console.log("Filter by Statut")}>Filter by Statut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
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
      <Table>
        <TableHeader className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-gray-900 font-medium">
                  <span>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-gray-500 py-4">
                Aucun devis trouvé
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DevisTable;
