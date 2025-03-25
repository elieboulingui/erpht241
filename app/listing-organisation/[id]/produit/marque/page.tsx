"use client"
import React, { useState } from "react";
import { MarqueHeader } from "./components/MarqueHeader";
import { TableBrandIa } from "./components/Table";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function Page() {
  const [filters, setFilters] = useState({ name: "", description: "" });

  const handleFilterChange = (filter: { name: string; description: string }) => {
    setFilters(filter);
  };

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <MarqueHeader onFilterChange={handleFilterChange} />
        <TableBrandIa filters={filters} />
      </div>
    </div>
  );
}
