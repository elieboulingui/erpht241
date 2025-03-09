import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Chargement from "@/components/Chargement";
import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
import { toast } from "sonner";

// Définir l'interface Product
interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
  images?: string[];
  categories?: { id: string; name: string; parentId?: string }[]; // Ajouter parentId pour les sous-catégories
}

// Fonction pour extraire l'ID de l'organisation depuis l'URL
function extractOrganisationId(url: string): string | null {
  const regex = /\/listing-organisation\/([a-zA-Z0-9\-]+)/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : null;
}

interface ProductsTableProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  category: string; // Catégorie sélectionnée
  categories: { id: string; name: string, parentId?: string }[]; // Liste des catégories disponibles
}

export default function ProductsTable({
  searchQuery,
  setSearchQuery,
  sortBy,
  category,
  categories, // Liste des catégories
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // État pour la gestion du produit sélectionné
  const [menuOpen, setMenuOpen] = useState(false); // État pour ouvrir/fermer le menu des options

  const organisationId = extractOrganisationId(window.location.href);

  useEffect(() => {
    if (!organisationId) {
      setError("L'ID de l'organisation est introuvable dans l'URL.");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true); // Réinitialiser le statut de chargement
      try {
        let url: string;

        // Vérification de la catégorie sélectionnée
        if (category && category !== "all") {
          // Si une catégorie est sélectionnée, appeler l'API selectcategory
          url = `/api/selectcategory?organisationId=${organisationId}&categoryName=${category}`;
        } else {
          // Sinon, appeler l'API produit
          url = `/api/produict?organisationId=${organisationId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des produits. Status: ${response.status}`);
        }

        const data = await response.json();

        // Assurer que categories est toujours un tableau
        setProducts(data.map((product: Product) => ({
          ...product,
          categories: Array.isArray(product.categories) ? product.categories : [], // Toujours un tableau pour categories
        })));
      } catch (error) {
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, organisationId]);

  // Filtrer les produits en fonction du searchQuery
  const filteredProducts = products.filter((product) => {
    const lowercasedQuery = searchQuery.toLowerCase();

    // Vérification de la recherche sur le nom, la description ou la catégorie
    const searchMatch =
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.description.toLowerCase().includes(lowercasedQuery) ||
      product.categories?.some((categoryObj) =>
        categoryObj.name.toLowerCase().includes(lowercasedQuery)
      );

    return searchMatch;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "asc") {
      return parseFloat(a.price) - parseFloat(b.price); // Prix croissant
    } else if (sortBy === "desc") {
      return parseFloat(b.price) - parseFloat(a.price); // Prix décroissant
    }
    return 0; // Aucun tri par défaut
  });

  const handleDeleteProduct = async (productId: string, organisationId: string) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
    if (confirmDelete) {
      try {
        await deleteProductByOrganisationAndProductId(organisationId, productId);
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
        toast.success("Produit supprimé avec succès.");
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit.");
      }
    }
  };

  const handleMenuAction = (action: "edit" | "delete", productId: string) => {
    if (action === "edit") {
      toast.success("Éditer le produit avec ID:");
    } else if (action === "delete") {
      handleDeleteProduct(productId, organisationId!);
    }
    setMenuOpen(false);
  };

  // Extraction des catégories uniques
  const uniqueCategories = Array.isArray(categories)
    ? categories.filter((category, index, self) =>
        index === self.findIndex((t) => t.id === category.id)
      )
    : [];

  if (loading) {
    return <Chargement />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border rounded-lg z-10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nom du Produit</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Images</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead> {/* Colonne Actions */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{product.description}</TableCell>
                  <TableCell>
                    {/* Affichage des catégories parent et enfant */}
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((category, index) => (
                        <div key={index} className="block">
                          <span>{category.name}</span>
                          {/* Affichage des sous-catégories si elles existent */}
                          {category.parentId && (
                            <div className="ml-4 text-sm text-muted-foreground">Sous-catégorie</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Aucune catégorie</span>
                    )}
                  </TableCell>
                  <TableCell>{parseFloat(product.price).toFixed(2)} XFA</TableCell>
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <div className="flex gap-2 overflow-x-auto w-[100px] h-[100px] scrollbar-hide">
                        {(product.images || []).map((image, index) => (
                          <div key={index} className="flex-shrink-0 w-50 h-50 rounded overflow-hidden">
                            <img
                              src={image}
                              alt={`Image de ${product.name}`}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSelectedProduct(product);
                        setMenuOpen(!menuOpen);
                      }}
                    >
                      •••
                    </button>
                    {menuOpen && selectedProduct?.id === product.id && (
                      <div className="absolute right-0 mb-6 bg-white shadow-md rounded-md p-2 z-50">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          onClick={() => handleMenuAction("edit", product.id!)}
                        >
                          Éditer
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-200"
                          onClick={() => handleMenuAction("delete", product.id!)}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
