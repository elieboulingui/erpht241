"use client"
import { useEffect, useState } from 'react';
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

export function TableBrandIa() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();  // Utilisation de useRouter depuis 'next/navigation'

  useEffect(() => {
    const url = window.location.pathname;
    const regex = /listing-organisation\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      const organisationId = match[1];

      const fetchBrands = async () => {
        try {
          const response = await fetch(`/api/getmarque?organisationId=${organisationId}`);
          const data = await response.json();
          setBrands(data);
        } catch (error) {
          console.error('Error fetching brands:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchBrands();
    } else {
      console.error("Organisation ID not found in URL");
    }

    // Vérification de la base de données après 1 minute
    const timeoutId = setTimeout(() => {
      if (match && match[1]) {
        const organisationId = match[1];
        fetch(`/api/getmarque?organisationId=${organisationId}`).then((res) => res.json()).then((data) => setBrands(data));
      }
    }, 60000); // Attendre 60 secondes (1 minute) avant de relancer la récupération des marques.

    return () => clearTimeout(timeoutId); // Nettoyer le timeout si le composant est démonté avant
  }, []);

  const handleDelete = async (brandId: string) => {
    try {
      await deleteMarqueById(brandId);
      setBrands(brands.filter(brand => brand.id !== brandId));
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
      const completeUpdatedBrand = { ...updatedBrand, organisation: editingBrand.organisation, Category: editingBrand.Category };
      setBrands(brands.map((brand) => (brand.id === editingBrand.id ? completeUpdatedBrand : brand)));

      setIsSheetOpen(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  if (loading) return <div><Chargement /></div>;

  return (
    <div className="p-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Marque</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Catégories</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Organisation</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell>{brand.description || 'No description'}</TableCell>
              <TableCell>{brand.Category.map((category) => category.name).join(', ') || 'No categories'}</TableCell>
              <TableCell>{brand.logo ? <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-cover" /> : 'No logo'}</TableCell>
              <TableCell>{brand.organisation.name}</TableCell>
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
