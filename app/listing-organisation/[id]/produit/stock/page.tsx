"use client"
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import StockTabsMenu from "./components/stockTabsMenu";

export default function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      <div className="w-full">
    
        <StockTabsMenu/>
      </div>
    </div>
  );
}
