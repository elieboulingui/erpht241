"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Chargement from "@/components/Chargement";

export default function CategoriesPage() {
  const searchParams = useSearchParams();
  const organisationId = searchParams.get("organisationId");

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organisationId) return;

    fetch(`/api/categoriesbyid?organisationId=${organisationId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, [organisationId]);

  if (loading) return <Chargement/>;
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
