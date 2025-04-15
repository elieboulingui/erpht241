// components/ui/tabbed-interface.tsx
'use client'

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabbedInterfaceProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  tabListClassName?: string;
  tabTriggerClassName?: string;
  tabContentClassName?: string;
  onTabChange?: (value: string) => void;
}

export function TabbedInterface({
  tabs,
  defaultTab = tabs[0]?.value || '',
  className = '',
  tabListClassName = '',
  tabTriggerClassName = '',
  tabContentClassName = '',
  onTabChange,
}: TabbedInterfaceProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onTabChange?.(value);
  };

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={handleTabChange} 
      className={`w-full ${className}`}
      defaultValue={defaultTab}
    >
      <div className="border-b">
        <TabsList className={`bg-transparent h-12 ${tabListClassName}`}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={`
                data-[state=active]:border-b-2 
                data-[state=active]:border-black 
                data-[state=active]:shadow-none 
                rounded-none h-12 px-4
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${tabTriggerClassName}
              `}
            >
              <span className="flex items-center">
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent 
          key={tab.value} 
          value={tab.value} 
          className={`mt-4 ${tabContentClassName}`}
          forceMount={tab.value !== activeTab ? true : undefined}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}