import DashboardSidebar from "@/components/DashboardSidebar"
import FullTabs from "./components/FullTabs"

function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <FullTabs />
      </div>
    </div>
  )
}

export default Page
