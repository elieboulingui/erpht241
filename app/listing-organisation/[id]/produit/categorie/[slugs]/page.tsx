"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Chargement from "@/components/Chargement";

export default function CategoriesPage() {
  const pathname = usePathname();
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
  if (categories.length === 0) return <p>No categories found</p>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <h2>{category.name}</h2>
            <p>{category.description}</p>
            {category.logo && <img src={category.logo} alt={category.name} width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
