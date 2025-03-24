import { IoMdInformationCircleOutline } from "react-icons/io"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb"

export default function ContactHeaderBreadcrumb() {
  return (
    <div className="flex items-center gap-2">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block text-black font-bold">Contacts</BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

