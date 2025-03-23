"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Chargement from "@/components/Chargement";

export default function CategoriesPage() {
  const pathname = usePathname();
  const router = useRouter(); // Pour la navigation

  console.log("Full pathname:", pathname); // Debugging

  // Extraire le dernier ID de l'URL
  const lastSegment = pathname.split("/").pop();
  console.log("Last ID (categorieId):", lastSegment); // Debugging

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lastSegment) return;

    fetch(`/api/categoriesbyid?categorieId=${lastSegment}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched categories:", data); // Debugging

        // Vérifie si `data` est un tableau
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("API returned unexpected format:", data);
          setCategories([]); // Évite l'erreur
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, [lastSegment]);

  if (loading) return <Chargement />;
  if (categories.length === 0) return <p className="text-center text-black">No categories found</p>;

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold text-center text-black mb-6">Categories</h1>

      {/* Bouton Retour */}
      <button
        onClick={() => router.push('/categories')} // Redirige vers la page des catégories
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Retour
      </button>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow mb-6">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-black">{category.name}</h2>
              <p className="text-black mt-2">{category.description}</p>
              {category.logo && (
                <img
                  src={category.logo}
                  alt={category.name}
                  className="mt-4 rounded-lg w-32 h-32 object-cover"
                />
              )}
            </div>

            {/* Affichage des produits associés à la catégorie */}
            {category.Product && category.Product.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800">Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                  {category.Product.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                    >
                      <h4 className="text-lg font-semibold text-black">{product.name}</h4>
                      <p className="text-gray-600 mt-2">{product.description}</p>

                      {/* Affichage des images du produit */}
                      {product.images && product.images.length > 0 && (
                        <div className="mt-4">
                          <div className="overflow-x-auto">
                            <div className="flex space-x-4">
                              {product.images.map((image: string, index: number) => (
                                <div key={index} className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
                                  <img
                                    src={image}
                                    alt={`Product Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
