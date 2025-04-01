import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  categories: { name: string }[];
}

interface ProductSearchProps {
  onAddProduct: (product: Product) => void;
}

export default function ProductSearch({ onAddProduct }: ProductSearchProps) {
  const [searchProduct, setSearchProduct] = useState("");
  const [searchQuantity, setSearchQuantity] = useState("1");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]); // Stocke les résultats filtrés
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const extractOrganizationId = (url: string) => {
    const regex = /\/listing-organisation\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const id = extractOrganizationId(window.location.href);
    if (id) {
      setOrganizationId(id);
      console.log("Organisation ID: ", id);
    }
  }, []);

  useEffect(() => {
    if (!organizationId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?organisationId=${organizationId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const data: Product[] = await response.json();
        console.log("Produits récupérés:", data); // Vérifiez ce qui est retourné
        setSearchResults(data); // Mettre à jour avec les produits récupérés
        setFilteredResults(data); // Initialement, les produits filtrés sont les mêmes
        setShowResults(true);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    fetchProducts();
  }, [organizationId]);

  // Filtrage basé sur la recherche de produit
  useEffect(() => {
    if (searchProduct.trim() === "") {
      setFilteredResults(searchResults); // Si rien n'est tapé, montrer tous les résultats
      setShowResults(false);
      setSelectedProduct(null);
      return;
    }

    const filteredProducts = searchResults.filter((product) =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase())
    );
    setFilteredResults(filteredProducts);
    setShowResults(true);
  }, [searchProduct, searchResults]);

  const selectProduct = (product: Product) => {
    setSearchProduct(product.name);
    setSelectedProduct(product);
    setShowResults(false);
  };

  const addProduct = () => {
    const productToAdd = selectedProduct || (filteredResults.length > 0 ? filteredResults[0] : null);
    if (productToAdd) {
      const quantity = Number.parseInt(searchQuantity) || 1;
      onAddProduct({
        ...productToAdd,
        quantity,
      });
      setSearchProduct("");
      setSearchQuantity("1");
      setSelectedProduct(null);
    }
  };

  return (
    <div className="mb-6 relative" ref={searchRef}>
      <Label className="text-sm font-medium">Rechercher un produit</Label>
      <div className="flex gap-2 mt-1">
        <div className="relative flex-1">
          <Input
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            placeholder="Rechercher"
            className="flex-1 focus:ring-2 focus:ring-red-500/50 transition-all pl-10"
            onFocus={() => searchProduct.trim() !== "" && setShowResults(true)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />

          {showResults && filteredResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredResults.map((product) => (
                <div
                  key={product.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectProduct(product)}
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.price.toLocaleString("fr-FR")} FCFA</div>
                </div>
              ))}
            </div>
          )}

          {showResults && filteredResults.length === 0 && searchProduct.trim() !== "" && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500">
              Aucun produit trouvé
            </div>
          )}
        </div>
        <Input
          type="number"
          value={searchQuantity}
          onChange={(e) => setSearchQuantity(e.target.value)}
          placeholder="Quantité"
          className="w-32 focus:ring-2 focus:ring-red-500/50 transition-all"
          min="1"
        />
        <Button
          onClick={addProduct}
          className="bg-red-800 hover:bg-red-700 text-white transition-colors"
          disabled={!selectedProduct && filteredResults.length === 0}
        >
          Ajouter produit
        </Button>
      </div>
    </div>
  );
}
