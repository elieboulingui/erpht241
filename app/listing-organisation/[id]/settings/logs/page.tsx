"use client"

import DashboardSidebar from "@/components/DashboardSidebar"
import { LogsHeader } from "./components/LogsHeader"
import BodyLogs from "./components/BodyLogs"
import { useState } from "react";

function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <LogsHeader onSearch={setSearchQuery} />
        <BodyLogs searchQuery={searchQuery} />
      </div>
    </div>
  )
}

export default Page