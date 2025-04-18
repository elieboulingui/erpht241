"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import Chargement from "@/components/Chargement";
import { toast } from "sonner";

import { ContactsTableColumns } from "./ContactsTableColumnsProps";
import { ContactsTableFilters } from "./ContactsTableFiltersProps";
import { DeleteContactDialog } from "./DeleteContactDialog";
import { EditContactModal } from "./EditContactModal";
import { DeleteContact } from "../action/deleteContact";
import PaginationGlobal from "@/components/paginationGlobal";

declare global {
  interface Window {
    createdContact: any;
  }
}

interface Contact {
  id: string;
  name: string;
  logo?: string;
  icon?: string | React.JSX.Element;
  email: string;
  phone: string;
  link: string;
  niveau: "PROSPECT_POTENTIAL" | "PROSPECT" | "CLIENT" | string;
  adresse: string;
  tags: string;
  status_contact: string;
  sector: string;
}

interface UpdatedContact {
  id: string;
  name: string;
  logo?: string;
  icon?: string | React.JSX.Element;
  email: string;
  phone: string;
  link: string;
  niveau: string;
  adresse?: string;
  tags: string;
  status_contact: string;
  sector: string;
}

interface ContactsTableWithServerDataProps {
  initialContacts: Contact[];
  organisationId: string;
  searchQuery: string;
}

const ContactsTables = ({ initialContacts, organisationId, searchQuery }: ContactsTableWithServerDataProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [tagsFilter, setTagsFilter] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const router = useRouter();

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getOrganisationIdFromUrl = () => {
    const urlPath = window.location.pathname;
    const regex = /\/listing-organisation\/([a-zA-Z0-9_-]+)\/contact/;
    const match = urlPath.match(regex);
    return match ? match[1] : null;
  };

  const fetchContacts = async (organisationId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/getContactsByOrganisationId?organisationId=${organisationId}`);
      const formattedContacts = await response.json();
      setContacts(formattedContacts);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const organisationId = getOrganisationIdFromUrl();
    const fetchData = async () => {
      if (organisationId) {
        await fetchContacts(organisationId);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleNewContactAdded = () => {
      if (window.createdContact) {
        const newContact = {
          id: window.createdContact.id,
          name: window.createdContact.name,
          email: window.createdContact.email,
          phone: window.createdContact.phone || "",
          niveau: window.createdContact.niveau || "PROSPECT_POTENTIAL",
          tags: window.createdContact.tags || "",
          logo: window.createdContact.logo,
          adresse: window.createdContact.adresse,
          status_contact: window.createdContact.status_contact,
          sector: window.createdContact.sector,
          link: `/contacts/${window.createdContact.id}`,
        };

        setContacts((prevContacts) => [newContact, ...prevContacts]);
        window.createdContact = null;
        toast.success("Contact ajouté avec succès!");
      }
    };

    window.addEventListener("newContactAdded", handleNewContactAdded);
    return () => {
      window.removeEventListener("newContactAdded", handleNewContactAdded);
    };
  }, []);

  const deleteContact = async (contactId: string) => {
    try {
      setIsLoading(true);
      await DeleteContact(contactId);
      setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));
      toast.success("Le contact a été supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      toast.error("Erreur lors de la suppression du contact");
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueStages = () => {
    const stages = Array.isArray(contacts) ? contacts.map((contact) => contact.niveau) : [];
    return Array.from(new Set(stages)).filter(Boolean);
  };

  const getUniqueTags = () => {
    const allTags: string[] = [];

    if (Array.isArray(contacts)) {
      contacts.forEach((contact) => {
        const contactTags = Array.isArray(contact.tags)
          ? contact.tags
          : contact.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean);
        allTags.push(...contactTags);
      });
    }

    return Array.from(new Set(allTags)).filter(Boolean);
  };

  const columns = ContactsTableColumns({
    contactId: organisationId,
    onEdit: (contact) => {
      setSelectedContact(contact as Contact);
      setIsEditModalOpen(true);
    },
    onDelete: (id) => {
      setContactToDelete(id);
      setIsDeleteDialogOpen(true);
    },
    onBulkDelete: (ids) => {
      ids.forEach((id) => deleteContact(id));
      toast.success(`${ids.length} contacts ont été supprimés avec succès`);
    },
  });

  // Calcul des données paginées
  const paginatedContacts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return contacts.slice(startIndex, endIndex);
  }, [contacts, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  const table = useReactTable({
    data: paginatedContacts, // Utilisez les données paginées ici
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "name",
          desc: false,
        },
      ],
    },
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    if (table) {
      table.getColumn("name")?.setFilterValue(searchQuery);
    }

    if (stageFilter !== "all" && table) {
      table.getColumn("niveau")?.setFilterValue(stageFilter);
    } else if (table) {
      table.getColumn("niveau")?.setFilterValue("");
    }

    if (tagsFilter.length > 0 && table) {
      table.getColumn("tags")?.setFilterValue(tagsFilter);
    } else if (table) {
      table.getColumn("tags")?.setFilterValue("");
    }
  }, [searchQuery, stageFilter, tagsFilter, table]);

  return (
    <div className="w-full ">
      <ContactsTableFilters
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        tagsFilter={tagsFilter}
        setTagsFilter={setTagsFilter}
        uniqueStages={getUniqueStages()}
        uniqueTags={getUniqueTags()}
        table={table}
      />

      <div className="flex-1 overflow-auto border-t py-2 px-5 border-gray-200 ">
        <Table>
          <TableHeader className="bg-[#e6e7eb]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Chargement />
                </TableCell>
              </TableRow>
            ) : table.getRowModel() && table.getRowModel().rows && Array.isArray(table.getRowModel().rows) ? (
              table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucun contact trouvé. Utilisez le bouton "Ajouter un contact" pour créer un nouveau contact.
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Aucun contact trouvé. Utilisez le bouton "Ajouter un contact" pour créer un nouveau contact.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Ajoutez la pagination ici */}
        <PaginationGlobal
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
          totalItems={contacts.length}
        />
      </div>

      {selectedContact && (
        <EditContactModal
          contact={selectedContact}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updatedContact: UpdatedContact) => {
            const completeContact: Contact = {
              ...selectedContact,
              name: updatedContact.name,
              email: updatedContact.email,
              phone: updatedContact.phone,
              niveau: updatedContact.niveau,
              tags: updatedContact.tags,
              adresse: updatedContact.adresse || selectedContact.adresse,
              logo: updatedContact.logo || selectedContact.logo,
              status_contact: updatedContact.status_contact,
              sector: updatedContact.sector,
              link: updatedContact.link || selectedContact.link,
            };

            setContacts((prevContacts) =>
              prevContacts.map((contact) => (contact.id === completeContact.id ? completeContact : contact)),
            );

            toast.success("Contact mis à jour avec succès!");
            setIsEditModalOpen(false);
          }}
        />
      )}

      <DeleteContactDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          if (contactToDelete) {
            deleteContact(contactToDelete);
            setIsDeleteDialogOpen(false);
          }
        }}
      />
    </div>
  );
};

export default ContactsTables;