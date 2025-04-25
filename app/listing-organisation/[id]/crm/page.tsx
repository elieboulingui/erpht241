import DashboardSidebar from "@/components/DashboardSidebar"
import { HeaderCRM } from "./components/HeaderCRM"
import BodyCRM from "./components/BodyCRM"

function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      
      <div className="w-full">
        {/* <HeaderCRM /> */}
        <BodyCRM />
      </div>
    </div>
  )
}

export default Page
