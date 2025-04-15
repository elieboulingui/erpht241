// components/ui/CustomTabs.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReactNode, useState } from "react"

interface TabItem {
  value: string
  label: string
  icon: ReactNode
  content: ReactNode
}

interface CustomTabsProps {
  defaultValue: string
  tabs: TabItem[]
  className?: string
  onTabChange?: (value: string) => void
  withBorder?: boolean
}

export function CustomTabs({ 
  defaultValue, 
  tabs, 
  className, 
  onTabChange,
  withBorder = true 
}: CustomTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleValueChange = (value: string) => {
    setActiveTab(value)
    if (onTabChange) {
      onTabChange(value)
    }
  }

  return (
    <Tabs 
      defaultValue={defaultValue} 
      onValueChange={handleValueChange} 
      className={`w-full ${className}`}
    >
      {withBorder && (
        <div className="border-b">
          <TabsList className="bg-transparent h-12">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      )}

      {!withBorder && (
        <TabsList className="bg-transparent h-12">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none h-12 px-4"
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="pt-6 px-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}