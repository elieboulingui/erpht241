"use client"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import Chargement from "@/components/Chargement"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

// Définition de l'interface pour les catégories
interface Category {
  id: string
  name: string
  children?: Category[]
}

interface ProductCategoriesSelectorProps {
  selectedCategories: string[]  // Utilisation de 'string[]' pour les noms des catégories
  setSelectedCategories: (categories: string[]) => void
}

const getOrganisationIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/listing-organisation\/([a-zA-Z0-9_-]+)\/produit/)
  return match ? match[1] : null
}

export function ProductCategoriesSelector({
  selectedCategories,
  setSelectedCategories,
}: ProductCategoriesSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState("Toutes les catégories")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [organisationId, setOrganisationId] = useState<string | null>(null)

  useEffect(() => {
    const url = window.location.href
    const id = getOrganisationIdFromUrl(url)
    if (id) {
      setOrganisationId(id)
    } else {
      console.error("ID de l'organisation non trouvé dans l'URL")
    }
  }, [])

  useEffect(() => {
    if (!organisationId) return;
  
    const fetchCategories = async () => {
      setLoading(true); // Démarrage du chargement
      try {
        const response = await fetch(`/api/categorieofia?organisationId=${organisationId}`);
        const data = await response.json();
  
        // Vérifier si l'API retourne une erreur
        if (data.error) {
          console.error("Erreur de l'API:", data.error);
          setError(`Erreur de l'API: ${data.error}`); // Définir l'erreur dans l'état
          setLoading(false);
          return;
        }
  
        // Si les données sont valides, les définir dans l'état
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors de l'appel API:", error);
        // Gérer les erreurs de l'appel API
        setError(`Erreur lors de la récupération des catégories: ${error instanceof Error ? error.message : error}`);
      } finally {
        setLoading(false); // Fin du chargement, que l'appel API soit réussi ou non
      }
    };
  
    fetchCategories();
  }, [organisationId]);

  // Mettre à jour la fonction toggleCategory pour utiliser le nom de la catégorie
  const toggleCategory = (categoryName: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((name) => name !== categoryName)
      : [...selectedCategories, categoryName];
  
    toast.success(`Catégorie sélectionnée: ${categoryName}`);
    setSelectedCategories(newSelectedCategories);
  };
  

  // Fonction pour afficher les catégories de manière récursive
  const renderCategory = (category: Category, depth = 0) => (
    <div key={category.id} className={cn("transition-all duration-200 hover:bg-gray-50 rounded-lg", depth > 0 && "ml-4")}>
      <div className="flex items-center space-x-2 py-2 px-2">
        <Checkbox
          id={category.id}
          checked={selectedCategories.includes(category.name)}  // Vérifier si le nom est dans les catégories sélectionnées
          onCheckedChange={() => toggleCategory(category.name)}  // Passer le nom de la catégorie
          className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
        <label htmlFor={category.id} className="text-sm font-medium leading-none cursor-pointer">
          {category.name}
        </label>
      </div>
      {category.children?.map((child) => renderCategory(child, depth + 1))}
    </div>
  )

  // Afficher les noms des catégories sélectionnées
  const selectedCategoryNames = categories
    .filter((category) => selectedCategories.includes(category.name))  // Utiliser le nom de la catégorie
    .map((category) => category.name);

  // Afficher un message de chargement si les catégories sont en train d'être récupérées
  if (loading) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
          <h3 className="font-medium flex items-center gap-2 text-gray-700">
            <Filter className="h-4 w-4" />
            Catégories de produits
          </h3>
        </div>
        <div className="p-3">
          <Chargement />
        </div>
      </div>
    )
  }

  // Afficher un message d'erreur si l'appel API échoue
  if (error) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
          <h3 className="font-medium flex items-center gap-2 text-gray-700">
            <Filter className="h-4 w-4" />
            Catégories de produits
          </h3>
        </div>
        <div className="p-3">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  // Retourner le rendu des catégories avec la liste des catégories sélectionnées
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
        <h3 className="font-medium flex items-center gap-2 text-gray-700">
          <Filter className="h-4 w-4" />
          Catégories de produits
        </h3>
      </div>
      <div className="p-3">
       
        <ScrollArea className="h-[280px] mt-3 pr-4">
          <div className="space-y-1 p-1">
            {categories.map((category) => renderCategory(category))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
