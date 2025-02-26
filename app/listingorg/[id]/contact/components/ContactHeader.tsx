"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

import { FiSidebar } from "react-icons/fi";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

export default function ContactdHeader() {
  return (
    <header className="w-full  items-center gap-4 bg-background/95 py-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Button variant={"ghost"} size={"icon"}>
            <FiSidebar className="h-4 w-4" color="gray" />
          </Button>

          <div className="h-3 w-0.5 bg-gray-200" />
          <h1 className="font-semibold">Contacts</h1>

          <Button variant={"ghost"} size={"icon"}>
            <IoMdInformationCircleOutline className="h-4 w-4" color="gray" />
          </Button>
        </div>

        <div className="flex items-center justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-black text-white">Ajouter un contact</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Ajouter un nouveau contact</SheetTitle>
              </SheetHeader>
              <form className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Input id="stage" placeholder="Enter stage" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Enter tags" />
                </div>
                <Button type="submit" className="w-full">
                  Save Contact
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Separator className="mt-2" />
    </header>
  );
}