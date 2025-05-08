import DashboardSidebar from "@/components/DashboardSidebar"
import BodyCRM from "./components/BodyCRM"
import ListDeal from "./components/list-deal"
import { HeaderCRM } from "./components/HeaderCRM"

function Page() {
  return (
    <div className="flex w-full overflow-hidden">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full h-full overflow-hidden">
        {/* <BodyCRM /> */}

        <HeaderCRM />
        <ListDeal />
      </div>
    </div>
  )
}

export default Page