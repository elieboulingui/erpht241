"use client";

import * as React from "react";
import { FaGithub } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

import { FiSidebar } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

export default function DashboardHeader() {
 

  return (
    <header className="w-full items-center gap-4 bg-white  py-4">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-3">

          <Button variant={"ghost"} size={"icon"}>
            <FiSidebar className="h-4 w-4" color="gray" />
          </Button>
          
          <div className="h-3 w-0.5 bg-gray-200" />
          <h1 className="font-semibold">Overview</h1>

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

    </header>
  );
}

