import { useState } from 'react';
import useSWR from 'swr';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowDownUp, Edit, Trash } from 'lucide-react';  // Importer les icônes nécessaires
import Chargement from '@/components/Chargement';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import PaginationGlobal from '@/components/paginationGlobal';
import { deleteMarqueById } from '../../marque/action/deleteMarque';
import { updateMarqueByid } from '../../marque/action/upadatemarque';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

export function TableBrandIa({ filter }: { filter: { name: string; description: string } }) {
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
      mutate(); // Recharger les marques après suppression
      toast.success("Marque supprimée");
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error("Erreur lors de la suppression de la marque");
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
      mutate(updatedBrands, false);
      setIsSheetOpen(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  if (isLoading) return <div><Chargement /></div>;
  if (error) return <div>Error loading brands.</div>;

  const filteredBrands = brands?.filter((brand: Brand) => {
    const matchesName = brand.name.toLowerCase().includes(filter.name.toLowerCase());
    const matchesDescription = filter.description ? brand.description?.toLowerCase().includes(filter.description.toLowerCase()) : true;
    return matchesName && matchesDescription;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedBrands = filteredBrands?.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="p-3">
      <Table>
        <TableHeader className="bg-gray-300">
          <TableRow>
            <TableHead className="w-[200px]">
              <div className="flex items-center">
                <span>Marque</span>
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <span>Description</span>
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <span>Catégories</span>
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                <span>Action</span>
                <ArrowDownUp className="ml-1 text-gray-500" size={16} />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBrands?.map((brand: Brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell>{brand.description || 'Pas de description'}</TableCell>
              <TableCell>{brand.Category.map((category: { name: string }) => category.name).join(', ') || 'Aucune catégorie'}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger>
                    <button className="text-gray-500 hover:text-black">
                      <span className="material-icons">...</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <button onClick={() => handleEdit(brand)} className=" text-left flex items-center  text-black hover:bg-gray-100">
                      <span>Editer</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(brand.id)} 
                      className="text-left flex items-center text-black hover:bg-gray-100"
                    >
                      <span>Supprimer</span>
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Component */}
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(filteredBrands?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={filteredBrands?.length || 0}
      />

      {/* Sheet to Edit Brand */}
      {editingBrand && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button className="hidden">Open</button>
          </SheetTrigger>
          <SheetContent>
            <h2>Editer la marque</h2>
            <Input
              value={editingBrand.name}
              onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
            />
            <Input
              value={editingBrand.description || ''}
              onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })}
              className="mt-2"
            />
            
            <Button onClick={handleSaveEdit} className="mt-4 w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]">
              Sauvegarder
            </Button>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
