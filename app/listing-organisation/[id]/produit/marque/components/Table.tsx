import { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowDownUp, Bandage, MessageSquare, MoreHorizontal, SlidersHorizontal, Truck, UserCircle } from 'lucide-react';

// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Chargement from '@/components/Chargement';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PaginationGlobal from '@/components/paginationGlobal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

// Actions
import { deleteMarqueById } from '../../marque/action/deleteMarque';
import { updateMarqueByid } from '../../marque/action/upadatemarque';
import MarqueHeader from './MarqueHeader';
import { CustomTabs } from '@/components/CustomTabs';

// Types
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

interface Supplier {
  id: string;
  name: string;
  logo: string | null;
  productCount: number;
  isActive: boolean;
}

// Constants
const TABLE_HEADERS = {
  marque: [
    { id: 'name', label: 'Nom', width: 'w-[200px]' },
    { id: 'description', label: 'Description', width: '' },
    { id: 'categories', label: '', width: '' },
    { id: 'actions', label: '', width: '' }
  ],
  fournisseur: [
    { id: 'logo', label: 'Logo', width: '' },
    { id: 'name', label: 'Nom ', width: 'w-[200px]' },
    { id: 'productCount', label: 'Nombres Produits', width: '' },
    { id: 'isActive', label: 'Active', width: '' },
    { id: 'actions', label: '', width: '' }
  ]
};

// Fetcher function
const fetchBrands = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error fetching brands');
  }
  return response.json();
};

export function TableBrandIa({ filter }: { filter: { name: string; description: string } }) {
  // State
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'marque' | 'fournisseur'>('marque');
  const [localFilter, setLocalFilter] = useState(filter);
  
  // Router
  const router = useRouter();

  // Get organisationId from URL
  const url = window.location.pathname;
  const regex = /listing-organisation\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  const organisationId = match ? match[1] : null;

  // Data fetching
  const { data: brands, error, isLoading, mutate } = useSWR(
    organisationId ? `/api/getmarque?organisationId=${organisationId}` : null,
    fetchBrands
  );

  // Handlers
  const handleDelete = async (brandId: string) => {
    try {
      await deleteMarqueById(brandId);
      mutate();
      toast.success('Marque supprimée');
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Erreur lors de la suppression de la marque');
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
      const updatedBrands = brands.map((brand: Brand) =>
        brand.id === updatedBrand.id ? updatedBrand : brand
      );
      mutate(updatedBrands, false);
      setIsSheetOpen(false);
      setEditingBrand(null);
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  // Data processing
  const filteredBrands = brands?.filter((brand: Brand) => {
    const matchesName = brand.name.toLowerCase().includes(filter.name.toLowerCase());
    const matchesDescription = filter.description
      ? brand.description?.toLowerCase().includes(filter.description.toLowerCase())
      : true;
    return matchesName && matchesDescription;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedBrands = filteredBrands?.slice(startIndex, startIndex + rowsPerPage);
  const paginatedSuppliers: Supplier[] = []; // Explicitly typed as array of Supplier

  const handleFilterChange = (newFilter: { name: string; description: string }) => {
    setLocalFilter(newFilter);
  };

  const renderTableHeader = (headers: typeof TABLE_HEADERS.marque | typeof TABLE_HEADERS.fournisseur) => (
    <TableHeader className="bg-gray-300">
      <TableRow>
        {headers.map((header) => (
          <TableHead key={header.id} className={header.width}>
            {header.id === 'actions' ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            ) : (
              <Button variant="ghost" className="pl-0 font-bold">
                {header.label}
                <ArrowDownUp className="ml-2 h-4 w-4" />
              </Button>
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  const renderBrandRow = (brand: Brand) => (
    <TableRow key={brand.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {brand.logo && (
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              width={32}
              height={32}
              className="object-contain h-8 w-8 rounded"
            />
          )}
          {brand.name}
        </div>
      </TableCell>
      <TableCell>{brand.description || 'Pas de description'}</TableCell>
      <TableCell>
        {brand.Category.map((category) => category.name).join(', ') || ''}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEdit(brand)}>Editer</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(brand.id)}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  const renderSupplierRow = (supplier: Supplier) => (
    <TableRow key={supplier.id}>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        {supplier.logo ? (
          <img
            src={supplier.logo}
            alt={`${supplier.name} logo`}
            width={32}
            height={32}
            className="object-contain h-8 w-8 rounded"
          />
        ) : (
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        )}
      </TableCell>
      <TableCell className="font-medium">{supplier.name}</TableCell>
      <TableCell>{supplier.productCount}</TableCell>
      <TableCell>
        <MessageSquare
          className={`h-4 w-4 ${supplier.isActive ? 'text-green-500' : 'text-gray-400'}`}
        />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Editer</DropdownMenuItem>
            <DropdownMenuItem>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <div>
      <MarqueHeader onFilterChange={handleFilterChange} activeTab={activeTab} />

      <CustomTabs
        defaultValue="marque"
        onTabChange={(value) => setActiveTab(value as 'marque' | 'fournisseur')}
        className="w-full"
        tabs={[
          {
            value: "marque",
            label: "Marque",
            icon: <Bandage className="h-4 w-4 mr-2" />,
            content: (
              <>
                {isLoading ? (
                  <div>
                    <Chargement />
                  </div>
                ) : error ? (
                  <div>Error loading brands.</div>
                ) : (
                  <Table>
                    {renderTableHeader(TABLE_HEADERS.marque)}
                    <TableBody>{paginatedBrands?.map(renderBrandRow)}</TableBody>
                  </Table>
                )}
              </>
            )
          },
          {
            value: "fournisseur",
            label: "Fournisseur",
            icon: <UserCircle className="h-4 w-4 mr-2" />,
            content: (
              <Table>
                {renderTableHeader(TABLE_HEADERS.fournisseur)}
                <TableBody>{paginatedSuppliers.map(renderSupplierRow)}</TableBody>
              </Table>
            )
          }
        ]}
      />

      <PaginationGlobal
        currentPage={currentPage}
        totalPages={Math.ceil(filteredBrands?.length / rowsPerPage) || 1}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={filteredBrands?.length || 0}
      />

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
            <Button
              onClick={handleSaveEdit}
              className="mt-4 w-full bg-[#7f1d1c] hover:bg-[#7f1d1c]"
            >
              Sauvegarder
            </Button>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}