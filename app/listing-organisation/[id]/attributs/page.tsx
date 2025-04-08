"use client"
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AttributsHeader } from "./components/AttributsHeader";

export default function Page() {
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
        <AttributsHeader/>
      </div>
    </div>
  );
}
