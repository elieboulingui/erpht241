"use client";
import React, { useState } from "react";
import Dashboard from "./_components/Dashboard";
import Header from "./_components/creatfacture";

// Nouveau type des éléments sélectionnés
interface SelectedItem {
  id: string;
  quantity: number;
  totalPrice: number;
}

export default function Page() {
  // Utiliser le bon type ici :
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  return (
    <div>
      {/* Passe les items sélectionnés à Header */}
      <Header selectedItems={selectedItems} />

      {/* Passe la fonction pour mettre à jour les items sélectionnés */}
      <Dashboard onProductsSelected={setSelectedItems} />
    </div>
  );
}
