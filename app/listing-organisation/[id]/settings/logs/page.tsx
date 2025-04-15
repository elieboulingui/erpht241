import DashboardSidebar from "@/components/DashboardSidebar"
import { LogsHeader } from "./components/LogsHeader"
import BodyLogs from "./components/BodyLogs"
function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <LogsHeader />
        <BodyLogs/>
      </div>
    </div>
  )
}

export default Page
