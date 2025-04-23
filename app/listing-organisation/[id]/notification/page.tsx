import DashboardSidebar from "@/components/DashboardSidebar"
import HeaderNotification from "./components/HeaderNotification"
import NotificationTable from "./components/NotificationTable"

function Page() {

  return (
    <div className="flex w-full bg-white">
      <div>
        <DashboardSidebar />
      </div>

      <div className="w-full">
        <HeaderNotification />
        <NotificationTable />
      </div>
    </div>
  )
}

export default Page
