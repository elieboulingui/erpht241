import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenIcon, Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ProductGeneratorModal } from "./product-generator-modal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing"; // Import UploadButton
import { toast } from "sonner"; // Assuming you're using a toast notification library
import { createProduct } from "./actions/createproduit"; // Your product creation action

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

  const handleLogoUpdate = (files: File[]) => {
    // Assume you're uploading the images to a server here
    console.log(files);
    const imageUrls = files.map(file => URL.createObjectURL(file)); // Mock image URLs
    setUploadedImages(imageUrls); // Store the image URLs in state
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
              className="ut-button:bg-[#7f1d1c] text-white ut-button:ut-readying:bg-[#7f1d1c]"
              // onClientUploadComplete={handleLogoUpdate}
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
            <div className="flex items-center gap-2">
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
