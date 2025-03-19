import React from "react";
import ContactInfo from "./components/ContactInfo";
import ContactDetailsHeader from "./components/ContactDetailsHeader";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function page() {
  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <ContactDetailsHeader />
        <ContactInfo />
      </div>
    </div>
  );
}
