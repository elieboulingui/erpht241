"use client"
import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { SettingsHeader } from "./components/SettingsHeader";

export default function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <SettingsHeader/>
      </div>
    </div>
  );
}
