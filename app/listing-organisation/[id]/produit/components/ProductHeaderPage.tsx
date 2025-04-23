import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenIcon, Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ProductGeneratorModal } from "./product-generator-modal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing"; // Import UploadButton
import { toast } from "sonner"; // Assuming you're using a toast notification library
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/PageHeader";
import { createProduct } from "../actions/createproduit";

function getOrganisationIdFromUrl(url: string): string | null {
  const regex = /\/listing-organisation\/([a-z0-9]{20,})\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}

interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductHeader({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  category,
  setCategory
}: ProductHeaderProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAI, setIsAI] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Added state for uploaded images
  const [productName, setProductName] = useState(""); // State for product name
  const [productDescription, setProductDescription] = useState(""); // State for product description
  const [productPrice, setProductPrice] = useState(0); // State for product price

  useEffect(() => {
    const url = window.location.href;
    const id = getOrganisationIdFromUrl(url);
    setOrganisationId(id);

    if (id) {
      fetch(`/api/category?organisationId=${id}`)
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => console.error("Error fetching categories:", error));
    }
  }, []);

  const handleAIOptionChange = (isAI: boolean) => {
    setIsAI(isAI);
    if (isAI) {
      setSearchQuery('');
      setCategory('all');
      setSortBy('default');
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleManualCreation = () => {
    setIsSheetOpen(true);
    setIsDropdownOpen(false);
  };

  const handleCreateProduct = async () => {
    if (!productName || !productDescription || !productPrice || !category) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await createProduct({
        name: productName,
        description: productDescription,
        price: productPrice.toString(),
        images: uploadedImages,
        categories: [category], // Wrap category in an array
        organisationId: organisationId || "", // Ensure organisationId is a string
        brandName: "", // Add required brandName field
      });

      if (response.ok) {
        toast.success("Produit créé avec succès !");
        setIsSheetOpen(false);
      } else {
        toast.error("Erreur lors de la création du produit.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div className="">
      <PageHeader
        title="Produits"
        searchPlaceholder="Rechercher un produit"
        showAddButton
        addButtonText="Ajouter un produit"
        onAddManual={() => setIsSheetOpen(true)}
        onAddAI={() => setIsAI(true)}
      />
      {isAI && <ProductGeneratorModal isAI={isAI} isOpen={isAI} setIsOpen={setIsAI} />}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Créer un produit</SheetTitle>
            <SheetDescription>Entrez les informations du produit.</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 p-4">
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Nom du produit"
              className="w-full"
            />
            <Input
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Description du produit"
              className="w-full"
            />
            <Input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              placeholder="Prix"
              className="w-full"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories">Aucune catégorie disponible</SelectItem>
                )}
              </SelectContent>
            </Select>

            <UploadButton
              endpoint="imageUploader"
              className="relative h-full w-full ut-button:bg-black text-white ut-button:ut-readying:bg-black"
              onClientUploadComplete={(res: any) => {
                console.log("Fichiers uploadés: ", res);
                if (res && res[0]) {
                  setUploadedImages(res.map((file: any) => file.ufsUrl));
                  toast.success("Upload du logo terminé !");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Erreur lors de l'upload: ${error.message}`);
              }}
            />
          </div>

          <div className="flex justify-between p-4">
            <Button className="w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]" onClick={handleCreateProduct}>
              Créer un produit
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-categories">Aucune catégorie disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Par défaut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Par défaut</SelectItem>
                <SelectItem value="asc">Prix croissant</SelectItem>
                <SelectItem value="desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
