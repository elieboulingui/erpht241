"use client"
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { AttributsHeader } from "./components/AttributsHeader";
import TabsMenu from "./components/tabsMenu";

export default function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      <div className="w-full">
    
        <TabsMenu/>
      </div>
    </div>
  );
}
