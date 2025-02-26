"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardHeader from "./components/DashboardHeader"
import { AppSidebar } from "./components/dashboardSidebar"
import { usePathname } from 'next/navigation'

export default function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()

  // Use regex to extract the id from the pathname
  const match = pathname?.match(/\/listingorg\/([a-zA-Z0-9]+)/)
  const id = match ? match[1] : null

  // Check if the current route is one where you don't want the sidebar
  const hideSidebar = pathname?.includes(`/listingorg/${id}/`)  // Adjust this condition to fit your needs

  return (
    <SidebarProvider>
      <div className={`grid w-full ${hideSidebar ? '' : 'lg:grid-cols-[259px_1fr]'}`}>
       <AppSidebar />
        <div className="flex flex-col">
        {!hideSidebar &&   <DashboardHeader />}
        
          <main className="bg-white">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
