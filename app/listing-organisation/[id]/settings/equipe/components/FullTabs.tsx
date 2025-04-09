"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, User, UserCircle, ShieldCheck } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from 'lucide-react';

// Types
type Employee = {
  id: number
  nom: string
  prenom: string
  email: string
  profil: string
  active: boolean
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b ml-5">
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
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      nom: "Steeve",
      prenom: "Aymard",
      email: "aymard008@gmail.com",
      profil: "SuperAdmin",
      active: true,
    },
  ])

  const toggleActive = (id: number) => {
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, active: !emp.active } : emp)))
  }

  return (
    <div className="w-full px-5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="w-10 p-2 text-left">
              <Checkbox />
            </th>
            <th className="p-2 text-left font-medium">Nom</th>
            <th className="p-2 text-left font-medium">Prénom</th>
            <th className="p-2 text-left font-medium">Email</th>
            <th className="p-2 text-left font-medium">Profil</th>
            <th className="p-2 text-left font-medium">Activé</th>
            <th className="w-10 p-2"></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b">
              <td className="p-2">
                <Checkbox />
              </td>
              <td className="p-2">{employee.nom}</td>
              <td className="p-2">{employee.prenom}</td>
              <td className="p-2">{employee.email}</td>
              <td className="p-2">{employee.profil}</td>
              <td className="p-2">
                <Switch checked={employee.active} onCheckedChange={() => toggleActive(employee.id)} />
              </td>
              <td className="p-2">
                <MoreHorizontal className="h-5 w-5 text-gray-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProfilTab() {
  return (
    <div className="w-full px-5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="w-10 p-2 text-left">
              <Checkbox />
            </th>
            <th className="p-2 text-left font-medium">ID</th>
            <th className="p-2 text-left font-medium">Nom</th>
            <th className="w-10 p-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">1</td>
            <td className="p-2">SuperAdmin</td>
            <td className="p-2">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </td>
          </tr>
          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">2</td>
            <td className="p-2">Caisse</td>
            <td className="p-2">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </td>
          </tr>
          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">3</td>
            <td className="p-2">Vente</td>
            <td className="p-2">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </td>
          </tr>
          <tr className="border-b">
            <td className="p-2">
              <Checkbox />
            </td>
            <td className="p-2">4</td>
            <td className="p-2">Stock</td>
            <td className="p-2">
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </td>
          </tr>
        </tbody>
      </table>
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
      <div className="w-1/4  border rounded-lg">
        <ul className="space-y-1 ">
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
            className={`p-2 cursor-pointer ${selectedRole === "commercial" ? "bg-[#8B0000] rounded-t-lg  text-white" : "hover:bg-gray-100"}`}
            onClick={() => handleRoleClick("commercial")}
          >
            Commercial
          </li>
        </ul>
      </div>
      <div className="w-3/4 ">
        {selectedRole === "superadmin" && (
          <Alert className="bg-[#FFEBEE] border-[#FFCDD2] text-black ">
            <AlertDescription className="flex items-center ">
              <Info className="h-8 w-8 mr-2 " fill="#B71C1C" color="white" />
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
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left font-medium w-1/4">Menu</th>
            <th className="p-2 text-center font-medium">Afficher</th>
            <th className="p-2 text-center font-medium">Ajouter</th>
            <th className="p-2 text-center font-medium">Modifier</th>
            <th className="p-2 text-center font-medium">Supprimer</th>
            <th className="p-2 text-center font-medium">Tout</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>
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
    <tr className="border-b bg-gray-100">
      <td className={`p-2 ${indent ? "pl-8" : ""}`}>
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
      </td>
      <td className="p-2 text-center">
        <Checkbox className="mx-auto" checked={permissions.afficher} onCheckedChange={() => onToggle("afficher")} />
      </td>
      <td className="p-2 text-center">
        <Checkbox className="mx-auto" checked={permissions.ajouter} onCheckedChange={() => onToggle("ajouter")} />
      </td>
      <td className="p-2 text-center">
        <Checkbox className="mx-auto" checked={permissions.modifier} onCheckedChange={() => onToggle("modifier")} />
      </td>
      <td className="p-2 text-center">
        <Checkbox className="mx-auto" checked={permissions.supprimer} onCheckedChange={() => onToggle("supprimer")} />
      </td>
      <td className="p-2 text-center">
        <Checkbox className="mx-auto" checked={permissions.tout} onCheckedChange={() => onToggle("tout")} />
      </td>
    </tr>
  )
}
