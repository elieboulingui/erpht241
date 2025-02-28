"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function AddCategoryForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-end p-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-black">Ajouter une catégorie</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Ajouter une nouvelle catégorie</SheetTitle>
          </SheetHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" placeholder="Entrez le nom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Input id="category" placeholder="Entrez la catégorie" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Nombre en stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Entrez le nombre en stock"
              />
            </div>
            <Button type="submit" className="w-full">
              Enregistrer la catégorie
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
