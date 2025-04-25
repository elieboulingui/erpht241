import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductGeneratorModal } from "./product-generator-modal";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";
import { createProduct } from "../actions/createproduit";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";

function getOrganisationIdFromUrl(url: string): string | null {
  const regex = /\/listing-organisation\/([a-z0-9]{20,})\//;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Add onProductAdded to the interface
interface ProductHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  onProductAdded: (added: boolean) => void; // Add this line to handle product added status
}

export default function ProductHeader({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  category,
  setCategory,
  onProductAdded // Destructure the onProductAdded function from props
}: ProductHeaderProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [organisationId, setOrganisationId] = useState<string | null>(null);
  const [isAI, setIsAI] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState(0);

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
        categories: [category],
        organisationId: organisationId || "",
        brandName: "",
      });

      if (response.ok) {
        toast.success("Produit créé avec succès !");
        setIsSheetOpen(false);
        onProductAdded(true); // Call the onProductAdded callback when product is added
      } else {
        toast.error("Erreur lors de la création du produit.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Produits"
        searchPlaceholder="Rechercher un produit"
        showAddButton
        addButtonText="Ajouter un produit"
        onAddManual={() => setIsSheetOpen(true)}
        onAddAI={() => setIsAI(true)}
      />
      {/* Pass the handler to ProductGeneratorModal */}
      {isAI && (
        <ProductGeneratorModal
          isAI={isAI}
          isOpen={isAI}
          setIsOpen={setIsAI}
          onProductAdded={onProductAdded} // Pass handler function here
        />
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Créer un produit</SheetTitle>
            <SheetDescription>Entrez les informations du produit.</SheetDescription>
          </SheetHeader>

          {/* Product creation form */}
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

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
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
