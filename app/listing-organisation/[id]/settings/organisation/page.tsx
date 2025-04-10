import DashboardSidebar from "@/components/DashboardSidebar"
import { OrganisationHeader } from "./components/OrganisationHeader"
import SettingsPanel from "./components/settings-panel"

function Page() {

 return (
           <div className="flex w-full">
              <div>
                <DashboardSidebar />
              </div>
        
              <div className="w-full">
              <OrganisationHeader/>
              <SettingsPanel/>
            </div>
          </div>
    )
}

export default Page
