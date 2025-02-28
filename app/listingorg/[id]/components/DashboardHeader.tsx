"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

import { format } from "date-fns";
import { FiSidebar } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { Separator } from "@/components/ui/separator";

export function DashboardHeader() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2025, 0, 22),
    to: new Date(2025, 1, 21),
  });

  return (
    <header className="w-full items-center gap-4 bg-background/95 py-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-3">

          <Button variant={"ghost"} size={"icon"}>
            <FiSidebar className="h-4 w-4" color="gray" />
          </Button>
          
          <div className="h-3 w-0.5 bg-gray-200" />
          <h1 className="font-semibold">aperçu</h1>

          <Button variant={"ghost"} size={"icon"}>
            <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
          </Button>

        </div>

        <div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FaGithub className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BsTwitterX className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="mt-2" />

      <div className="ml-auto flex items-center gap-4 py-1">
        <Tabs defaultValue="1d" className="">
          <TabsList className="bg-transparent">
            <TabsTrigger value="1d">1d</TabsTrigger>
            <TabsTrigger value="3d">3d</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from && date?.to
                ? `${format(date.from, "LLL dd, y")} - ${format(
                    date.to,
                    "LLL dd, y"
                  )}`
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}