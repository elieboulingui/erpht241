import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenIcon, Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProductGeneratorModal } from "./product-generator-modal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { createProduct } from "./actions/createproduit";

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
  onProductCreated?: () => void;
}

export default function ProductHeader({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  category,
  setCategory,
  onProductCreated
}: ProductHeaderProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAI, setIsAI] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

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

    setIsCreating(true);

    try {
      const response = await createProduct({
        name: productName,
        description: productDescription,
        price: productPrice.toString(),
        images: uploadedImages,
        categories: [category],
        organisationId: organisationId || "",
      });

      if (response.ok) {
        toast.success("Produit créé avec succès !");
        setIsSheetOpen(false);
        setProductName("");
        setProductDescription("");
        setProductPrice(0);
        setUploadedImages([]);
        if (onProductCreated) {
          onProductCreated();
        }
      } else {
        toast.error("Erreur lors de la création du produit.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" />
          <div className="text-black font-bold">Produit</div>
        </div>

        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-bold px-4 py-2 rounded-lg"
              onClick={toggleDropdown}
            >
              <Plus className="h-2 w-2" /> Ajouter un produit
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[180px] bg-white cursor-pointer z-50">
            <DropdownMenuItem onClick={handleManualCreation} className="flex items-center gap-2 p-2">
              <PenIcon className="h-4 w-4" />
              <span>Manuellement</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAIOptionChange(true)} className="flex items-center gap-2 p-2">
              <Sparkles className="h-4 w-4" />
              <span>via IA</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isAI && <ProductGeneratorModal isAI={isAI} isOpen={isAI} setIsOpen={setIsAI} />}
      </div>

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
            <Button 
              className="w-full bg-[#7f1d1c] hover:bg-[#7f1d1c] flex items-center justify-center gap-2" 
              onClick={handleCreateProduct}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </>
              ) : (
                "Créer un produit"
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[200px]">
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

        <div className="relative w-full sm:w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un produit..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}