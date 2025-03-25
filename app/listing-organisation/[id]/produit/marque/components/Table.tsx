"use client";
import { useState } from 'react';
import useSWR from 'swr'; // Import useSWR
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Edit, Trash } from 'lucide-react';
import Chargement from '@/components/Chargement';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';  // Utilisez 'next/navigation' ici
import PaginationGlobal from '@/components/paginationGlobal'; // Import the Pagination component
import { deleteMarqueById } from '../../marque/action/deleteMarque';
import { updateMarqueByid } from '../../marque/action/upadatemarque';

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

const fetchBrands = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching brands');
  }
  return response.json();
};

export function TableBrandIa({ filters }: { filters: { name: string; description: string } }) {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // Track the current page
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Default 5 rows per page
  const router = useRouter();

  const url = window.location.pathname;
  const regex = /listing-organisation\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  const organisationId = match ? match[1] : null;

  const { data: brands, error, isLoading, mutate } = useSWR(
    organisationId ? `/api/getmarque?organisationId=${organisationId}` : null,
    fetchBrands
  );

  const handleDelete = async (brandId: string) => {
    try {
      await deleteMarqueById(brandId);
      mutate(); // Re-fetch data after deletion
      toast.success("supprimé");
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsSheetOpen(true);
  };

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

  // Apply the filters to the brands
  const filteredBrands = brands?.filter((brand: Brand) => {
    const matchesName = brand.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesDescription = brand.description?.toLowerCase().includes(filters.description.toLowerCase()) || false;
    return matchesName && matchesDescription;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedBrands = filteredBrands?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-3">
      <Table>
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead className="w-[200px]">Marque </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Catégories</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBrands?.map((brand: Brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell>{brand.description || 'No description'}</TableCell>
              <TableCell>{brand.Category.map((category) => category.name).join(', ') || 'No categories'}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <button className="text-gray-500 hover:text-black">
                      <span className="material-icons">...</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-24">
                    <button onClick={() => handleEdit(brand)} className=" text-left flex items-center  text-black hover:bg-gray-100">
                      <span>Editer</span>
                    </button>
                    <button onClick={() => handleDelete(brand.id)} className=" text-left flex items-center  text-black hover:bg-gray-100">
                      <span>Supprimer</span>
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(filteredBrands?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={filteredBrands?.length || 0}
      />
    </div>
  );
}
