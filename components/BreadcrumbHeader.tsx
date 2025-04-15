// components/BreadcrumbHeader.tsx
"use client"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { IoMdInformationCircleOutline } from "react-icons/io"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"
import { Input } from "./ui/input"

interface BreadcrumbHeaderProps {
  title: string
  withSearch?: boolean
  searchPlaceholder?: string
  onSearchChange?: (value: string) => void
  searchValue?: string
  children?: React.ReactNode
}

export function BreadcrumbHeader({
  title,
  withSearch = false,
  searchPlaceholder = "Rechercher...",
  onSearchChange,
  searchValue,
  children
}: BreadcrumbHeaderProps) {
  return (
    <div className="w-full mt-4">
      <header>
        <div className="w-full flex items-center justify-between gap-4 bg-background/95">
          <div className="flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink className="text-black font-bold" href="#">
                      {title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          <div className="flex items-center gap-4 px-5">
            {withSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="w-full pl-8"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                />
              </div>
            )}
            {children}
          </div>
        </div>
        <Separator className="mt-3" />
      </header>
    </div>
  )
}