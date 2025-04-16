"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, User, UserCircle, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react'
import { EquipeHeader } from "./EquipeHeader"
import PaginationGlobal from "@/components/paginationGlobal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Employee = {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  prenom: string
}

type PermissionType = "afficher" | "ajouter" | "modifier" | "supprimer" | "tout"

type PermissionSet = {
  afficher: boolean
  ajouter: boolean
  modifier: boolean
  supprimer: boolean
  tout: boolean
}

type PermissionSectionKey =
  | "tableauDeBord"
  | "contact"
  | "catalogue"
  | "categories"
  | "produit"
  | "attributs"
  | "magasinFournisseur"
  | "parametre"
  | "organisation"
  | "equipe"
  | "venteCommercial"
  | "logs"

type PermissionsState = {
  [key in PermissionSectionKey]: PermissionSet
}

type ExpandedSectionsState = {
  catalogue: boolean
  parametre: boolean
}

type ExpandableSectionKey = keyof ExpandedSectionsState

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("employes")

  return (
    <div className="">
      <EquipeHeader activeTab={activeTab as "employes" | "profil" | "permission"} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger
              value="employes"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
            >
              <User className="h-4 w-4 mr-2" />
              Employés
            </TabsTrigger>
            <TabsTrigger
              value="profil"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
            >
              <UserCircle className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger
              value="permission"
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Permission
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="employes" className="mt-4">
          <EmployesTab />
        </TabsContent>

        <TabsContent value="profil" className="mt-4">
          <ProfilTab />
        </TabsContent>

        <TabsContent value="permission" className="mt-4">
          <PermissionTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmployesTab() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const pathname = usePathname()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(0)

  const organisationId = pathname.split('/')[2]

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/auth/getorgmember?id=${organisationId}`)
        const data = await res.json()

        const formatted = data.map((user: any) => ({
          id: user.id,
          name: user.name?.split(' ')[0] || '',
          prenom: user.name?.split(' ')[1] || '',
          email: user.email,
          role: user.role,
          active: true,
        }))

        setEmployees(formatted)
        setTotalItems(formatted.length)
      } catch (error) {
        console.error('Erreur lors du chargement des membres', error)
      }
    }

    if (organisationId) fetchMembers()
  }, [organisationId])

  const toggleActive = (id: string) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, active: !emp.active } : emp)))
  }

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="w-full px-5 pb-16">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Profil</TableHead>
            <TableHead>Activé</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.prenom}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>
                <Switch
                  checked={employee.active}
                  onCheckedChange={() => toggleActive(employee.id)}
                  id="afficher-fiche"
                  className="data-[state=checked]:bg-[#7f1d1c] data-[state=checked]:border-[#7f1d1c]"
                />
              </TableCell>
              <TableCell>
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / rowsPerPage)}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />
    </div>
  )
}

function ProfilTab() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [totalItems, setTotalItems] = useState(4) // Nous avons 4 profils fixes

  const profiles = [
    { id: 1, name: "SuperAdmin" },
    { id: 2, name: "Caisse" },
    { id: 3, name: "Vente" },
    { id: 4, name: "Stock" }
  ]

  const paginatedProfiles = profiles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="w-full px-5 pb-16">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProfiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{profile.id}</TableCell>
              <TableCell>{profile.name}</TableCell>
              <TableCell>
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / rowsPerPage)}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />
    </div>
  )
}

function PermissionTab() {
  const [selectedRole, setSelectedRole] = useState("superadmin")
  const [showMatrix, setShowMatrix] = useState(false)

  const handleRoleClick = (role: string) => {
    setSelectedRole(role)
    setShowMatrix(role === "caisse")
  }

  return (
    <div className="flex mt-4 px-5 gap-5">
      <div className="w-1/4 border rounded-lg">
        <ul className="space-y-1">
          <li
            className={`p-2 cursor-pointer ${selectedRole === "superadmin" ? "bg-[#8B0000] rounded-t-lg text-white" : "hover:bg-gray-100"}`}
            onClick={() => handleRoleClick("superadmin")}
          >
            SuperAdmin
          </li>
          <li
            className={`p-2 cursor-pointer ${selectedRole === "caisse" ? "bg-[#8B0000] rounded-t-lg text-white" : "hover:bg-gray-100"}`}
            onClick={() => handleRoleClick("caisse")}
          >
            Caisse
          </li>
          <li
            className={`p-2 cursor-pointer ${selectedRole === "vente" ? "bg-[#8B0000] rounded-t-lg text-white" : "hover:bg-gray-100"}`}
            onClick={() => handleRoleClick("vente")}
          >
            Vente
          </li>
          <li
            className={`p-2 cursor-pointer ${selectedRole === "stock" ? "bg-[#8B0000] rounded-t-lg text-white" : "hover:bg-gray-100"}`}
            onClick={() => handleRoleClick("stock")}
          >
            Stock
          </li>
          <li
            className={`p-2 cursor-pointer ${selectedRole === "commercial" ? "bg-[#8B0000] rounded-t-lg text-white" : "hover:bg-gray-100"}`}
            onClick={() => handleRoleClick("commercial")}
          >
            Commercial
          </li>
        </ul>
      </div>
      <div className="w-3/4">
        {selectedRole === "superadmin" && (
          <Alert className="bg-[#FFEBEE] border-[#FFCDD2] text-black">
            <AlertDescription className="flex items-center">
              <Info className="h-8 w-8 mr-2" fill="#B71C1C" color="white" />
              Les permissions de l&apos;administrateur ne peuvent être modifiées
            </AlertDescription>
          </Alert>
        )}

        {showMatrix && <PermissionMatrix />}
      </div>
    </div>
  )
}

function PermissionMatrix() {
  const [expandedSections, setExpandedSections] = useState<ExpandedSectionsState>({
    catalogue: false,
    parametre: false,
  })

  const [permissions, setPermissions] = useState<PermissionsState>({
    tableauDeBord: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    contact: { afficher: true, ajouter: true, modifier: true, supprimer: true, tout: true },
    catalogue: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    categories: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    produit: { afficher: true, ajouter: true, modifier: true, supprimer: true, tout: true },
    attributs: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    magasinFournisseur: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    parametre: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    organisation: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    equipe: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    venteCommercial: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
    logs: { afficher: false, ajouter: false, modifier: false, supprimer: false, tout: false },
  })

  const togglePermission = (section: PermissionSectionKey, permission: PermissionType) => {
    setPermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [permission]: !prev[section][permission],
      },
    }))
  }

  const toggleSection = (section: ExpandableSectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Menu</TableHead>
            <TableHead className="text-center">Afficher</TableHead>
            <TableHead className="text-center">Ajouter</TableHead>
            <TableHead className="text-center">Modifier</TableHead>
            <TableHead className="text-center">Supprimer</TableHead>
            <TableHead className="text-center">Tout</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <PermissionRow
            name="Tableau de bord"
            isHeader={true}
            permissions={permissions.tableauDeBord}
            onToggle={(permission) => togglePermission("tableauDeBord", permission as PermissionType)}
          />
          <PermissionRow
            name="Contact"
            isHeader={true}
            permissions={permissions.contact}
            onToggle={(permission) => togglePermission("contact", permission as PermissionType)}
          />

          {/* Catalogue section with collapsible children */}
          <PermissionRow
            name="Catalogue"
            isHeader={true}
            isExpanded={expandedSections.catalogue}
            onExpandToggle={() => toggleSection("catalogue")}
            permissions={permissions.catalogue}
            onToggle={(permission) => togglePermission("catalogue", permission as PermissionType)}
          />

          {expandedSections.catalogue && (
            <>
              <PermissionRow
                name="Catégories"
                indent={true}
                permissions={permissions.categories}
                onToggle={(permission) => togglePermission("categories", permission as PermissionType)}
              />
              <PermissionRow
                name="Produit"
                indent={true}
                permissions={permissions.produit}
                onToggle={(permission) => togglePermission("produit", permission as PermissionType)}
              />
              <PermissionRow
                name="Attributs"
                indent={true}
                permissions={permissions.attributs}
                onToggle={(permission) => togglePermission("attributs", permission as PermissionType)}
              />
              <PermissionRow
                name="Magasin/Fournisseur"
                indent={true}
                permissions={permissions.magasinFournisseur}
                onToggle={(permission) => togglePermission("magasinFournisseur", permission as PermissionType)}
              />
            </>
          )}

          {/* Paramètre section with collapsible children */}
          <PermissionRow
            name="Paramètre"
            isHeader={true}
            isExpanded={expandedSections.parametre}
            onExpandToggle={() => toggleSection("parametre")}
            permissions={permissions.parametre}
            onToggle={(permission) => togglePermission("parametre", permission as PermissionType)}
          />

          {expandedSections.parametre && (
            <>
              <PermissionRow
                name="Organisation"
                indent={true}
                permissions={permissions.organisation}
                onToggle={(permission) => togglePermission("organisation", permission as PermissionType)}
              />
              <PermissionRow
                name="Équipe"
                indent={true}
                permissions={permissions.equipe}
                onToggle={(permission) => togglePermission("equipe", permission as PermissionType)}
              />
              <PermissionRow
                name="Vente/Commercial"
                indent={true}
                permissions={permissions.venteCommercial}
                onToggle={(permission) => togglePermission("venteCommercial", permission as PermissionType)}
              />
              <PermissionRow
                name="Logs"
                indent={true}
                permissions={permissions.logs}
                onToggle={(permission) => togglePermission("logs", permission as PermissionType)}
              />
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

type PermissionRowProps = {
  name: string
  isHeader?: boolean
  indent?: boolean
  isExpanded?: boolean
  onExpandToggle?: () => void
  permissions: PermissionSet
  onToggle: (permission: string) => void
}

function PermissionRow({
  name,
  isHeader = false,
  indent = false,
  isExpanded = false,
  onExpandToggle = () => { },
  permissions,
  onToggle,
}: PermissionRowProps) {
  return (
    <TableRow className="bg-gray-100">
      <TableCell className={`${indent ? "pl-8" : ""}`}>
        {isHeader ? (
          <div className="flex items-center cursor-pointer" onClick={onExpandToggle}>
            <span
              className="mr-2 inline-block transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ►
            </span>
            {name}
          </div>
        ) : (
          name
        )}
      </TableCell>
      <TableCell className="text-center">
        <Checkbox className="mx-auto" checked={permissions.afficher} onCheckedChange={() => onToggle("afficher")} />
      </TableCell>
      <TableCell className="text-center">
        <Checkbox className="mx-auto" checked={permissions.ajouter} onCheckedChange={() => onToggle("ajouter")} />
      </TableCell>
      <TableCell className="text-center">
        <Checkbox className="mx-auto" checked={permissions.modifier} onCheckedChange={() => onToggle("modifier")} />
      </TableCell>
      <TableCell className="text-center">
        <Checkbox className="mx-auto" checked={permissions.supprimer} onCheckedChange={() => onToggle("supprimer")} />
      </TableCell>
      <TableCell className="text-center">
        <Checkbox className="mx-auto" checked={permissions.tout} onCheckedChange={() => onToggle("tout")} />
      </TableCell>
    </TableRow>
  )
}