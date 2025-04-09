import DashboardSidebar from "@/components/DashboardSidebar"
import { EquipeHeader } from "./components/EquipeHeader"
import FullTabs from "./components/FullTabs"

function Page() {

 return (
           <div className="flex w-full">
              <div>
                <DashboardSidebar />
              </div>
        
              <div className="w-full">
                <EquipeHeader />
                <FullTabs />
            </div>
          </div>
    )
}

export default Page
