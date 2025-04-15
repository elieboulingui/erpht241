"use client"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Plus, PenIcon, Sparkles, Search } from "lucide-react"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";

interface EquipeHeaderProps {
  activeTab: "employes" | "profil" | "permission";
}

export function EquipeHeader({ activeTab }: EquipeHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Déterminer les textes en fonction de l'onglet actif
  const getTexts = () => {
    switch (activeTab) {
      case "employes":
        return {
          searchPlaceholder: "Rechercher un employé",
          buttonText: "Ajouter un employé",
          buttonLabel: "employé"
        };
      case "profil":
        return {
          searchPlaceholder: "Rechercher un profil",
          buttonText: "Ajouter un profil",
          buttonLabel: "profil"
        };
      case "permission":
        return {
          searchPlaceholder: "Rechercher une permission",
          buttonText: "Ajouter une permission",
          buttonLabel: "permission"
        };
      default:
        return {
          searchPlaceholder: "Rechercher",
          buttonText: "Ajouter",
          buttonLabel: "élément"
        };
    }
  };

  const { searchPlaceholder, buttonText, buttonLabel } = getTexts();

  return (
    <div className="">
     <PageHeader
  title="Equipe"
  searchPlaceholder={searchPlaceholder}
  showAddButton
  addButtonText={buttonText}
/>
    </div>
  );
}