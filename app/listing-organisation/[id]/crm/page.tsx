import DashboardSidebar from "@/components/DashboardSidebar"
import BodyCRM from "./components/BodyCRM"

function Page() {
  return (
    <div className="flex w-full overflow-hidden">
      <div>
        <DashboardSidebar />
      </div>
      
      <div className="w-full h-full overflow-hidden">
        <BodyCRM />
      </div>
    </div>
  )
}

export default Page