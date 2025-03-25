"use client"
import { useState } from 'react';
import useSWR from 'swr'; // Import useSWR
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteMarqueById } from '../action/deleteMarque';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, Trash } from 'lucide-react';
import Chargement from '@/components/Chargement';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateMarqueByid } from '../action/upadatemarque';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';  // Utilisez 'next/navigation' ici

interface Category {
  id: string;
  name: string;
}

interface Organisation {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
  description: string | null;
  organisationId: string;
  organisation: Organisation;
  logo: string | null;
  Category: Category[];
}

// Custom fetcher function for SWR
const fetchBrands = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching brands');
  }
  return response.json();
};

export function TableBrandIa() {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();  // Utilisation de useRouter depuis 'next/navigation'

  // Get the organisationId from the URL
  const url = window.location.pathname;
  const regex = /listing-organisation\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  const organisationId = match ? match[1] : null;

  // Fetch brands using SWR
  const { data: brands, error, isLoading, mutate } = useSWR(
    organisationId ? `/api/getmarque?organisationId=${organisationId}` : null,
    fetchBrands
  );

  // Handle deletion
  const handleDelete = async (brandId: string) => {
    try {
      await deleteMarqueById(brandId);
      mutate(); // Re-fetch data after deletion
      toast.success("supprimé");
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  // Handle edit
  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsSheetOpen(true);
  };

  // Save edited brand
  const handleSaveEdit = async () => {
    if (!editingBrand) return;

    try {
      const updatedCategory = {
        name: editingBrand.name,
        description: editingBrand.description || '',
        logo: editingBrand.logo || '',
      };

      const updatedBrand = await updateMarqueByid(editingBrand.id, updatedCategory);
      const updatedBrands = brands.map((brand: Brand) => (brand.id === updatedBrand.id ? updatedBrand : brand));
      mutate(updatedBrands, false); // Update the local data without re-fetching
      setIsSheetOpen(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  if (isLoading) return <div><Chargement /></div>;
  if (error) return <div>Error loading brands.</div>;

  return (
    <div className="p-3">
      <Table>
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead className="w-[200px]">Marque</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Catégories</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands?.map((brand: Brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell>{brand.description || 'No description'}</TableCell>
              <TableCell>{brand.Category.map((category: { name: any; }) => category.name).join(', ') || 'No categories'}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <button className="text-gray-500 hover:text-black">
                      <span className="material-icons">...</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <button onClick={() => handleEdit(brand)} className="w-full text-left flex items-center space-x-2 p-2 text-black hover:bg-gray-100">
                      <span>Editer</span>
                    </button>
                    <button onClick={() => handleDelete(brand.id)} className="w-full text-left flex items-center space-x-2 p-2 text-black hover:bg-gray-100">
                      <span>Supprimer</span>
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isSheetOpen && (
        <Sheet open={isSheetOpen}>
          <SheetContent>
            <div className="p-4">
              <h3>Edit Brand</h3>
              <Input
                value={editingBrand?.name || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand!, name: e.target.value })}
                placeholder="Brand Name"
              />
              <Input
                value={editingBrand?.description || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand!, description: e.target.value })}
                placeholder="Description"
                className="mt-2"
              />
              <Button onClick={handleSaveEdit} className="mt-4 bg-black hover:bg-black">
                Sauvegarder
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
