import React from "react";

import { MarqueHeader } from "./components/MarqueHeader";
import { TableBrandIa } from "./components/Table";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function page() {
  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      <div className="w-full">
        <MarqueHeader />
        <TableBrandIa />
      </div>
    </div>
  );
}
