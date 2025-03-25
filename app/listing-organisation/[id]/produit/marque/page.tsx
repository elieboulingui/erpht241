"use client"
import React, { useState } from "react";
import { MarqueHeader } from "./components/MarqueHeader";
import { TableBrandIa } from "./components/Table";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function page() {
  const [filter, setFilter] = useState({ name: "", description: "" });

  const handleFilterChange = (newFilter: { name: string; description: string }) => {
    setFilter(newFilter);  // Met à jour le filtre
  };

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <MarqueHeader onFilterChange={handleFilterChange} />
        <TableBrandIa />
      </div>
    </div>
  );
}
