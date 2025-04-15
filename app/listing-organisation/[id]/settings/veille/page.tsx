import DashboardSidebar from "@/components/DashboardSidebar"
import { VeilleHeader } from "./components/VeilleHeader"
import VielleLogs from "./components/VielleLogs"

function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <VeilleHeader />
        <VielleLogs />
      </div>
    </div>
  )
}

export default Page
