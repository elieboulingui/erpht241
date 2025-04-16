import DashboardSidebar from "@/components/DashboardSidebar"
import { VeilleHeader } from "./components/VeilleHeader"
import VeilleConcurentielle from "./components/VeilleConcurentielle"

function Page() {

  return (
    <div className="flex w-full">
      <div>
        <DashboardSidebar />
      </div>
      
      <div className="w-full">
        <VeilleHeader />
        <VeilleConcurentielle />
      </div>
    </div>
  )
}

export default Page
