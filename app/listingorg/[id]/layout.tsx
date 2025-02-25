import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardHeader from "./components/DashboardHeader"
import { AppSidebar } from "./components/dashboardSidebar"

// Pass ownerId as a prop to children
export default async function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Directly render the children
  return (
    <SidebarProvider>
      <div className="grid   w-full lg:grid-cols-[259px_1fr]">
        <AppSidebar />
        <div className="flex flex-col">
        <DashboardHeader/>
          <main className="bg-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
