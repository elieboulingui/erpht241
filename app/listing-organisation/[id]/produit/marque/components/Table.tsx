"use client"
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteMarqueById } from '../action/deleteMarque'; // Assure-toi que cette fonction existe et est bien configurée
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Importer les composants nécessaires pour le Popover
import { Edit, Trash } from 'lucide-react'; // Importer les icônes pour l'édition et la suppression
import Chargement from '@/components/Chargement';

// Définir tes interfaces ici
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
  description?: string;
  organisationId: string;
  organisation: Organisation;
  logo?: string;
  Category: Category[]; // Relation Categories
}

export function TableBrandIa() {
  const [brands, setBrands] = useState<Brand[]>([]); // Utilise l'interface 'Brand' ici
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Utilisation d'une expression régulière pour extraire l'ID de l'organisation
    const url = window.location.pathname;
    const regex = /listing-organisation\/([a-zA-Z0-9]+)/; // Regex pour capturer l'ID de l'organisation
    const match = url.match(regex);

    if (match && match[1]) {
      const organisationId = match[1]; // L'ID de l'organisation extrait de l'URL

      const fetchBrands = async () => {
        try {
          const response = await fetch(`/api/getmarque?organisationId=${organisationId}`);
          const data = await response.json();
          setBrands(data); // Stocker les données récupérées dans l'état `brands`
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
  }, []);

  // Fonction pour supprimer la marque
  const handleDelete = async (brandId: string) => {
    try {
      await deleteMarqueById(brandId); // Appelle la fonction pour supprimer la marque via l'API
      // Mise à jour de l'état local après suppression
      setBrands(brands.filter(brand => brand.id !== brandId));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleEdit = (brandId: string) => {
    // Logique d'édition ici
    console.log("Editing brand with ID:", brandId);
  };

  if (loading) return <div><Chargement /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Marque</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Catégories</TableHead>
          <TableHead>Logo</TableHead>
          <TableHead>Organisation</TableHead>
          <TableHead>Action</TableHead> {/* Ajouter une colonne pour les actions */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.map((brand) => (
          <TableRow key={brand.id}>
            <TableCell className="font-medium">{brand.name}</TableCell>
            <TableCell>{brand.description || 'No description'}</TableCell>
            <TableCell>
              {brand.Category.map((category) => category.name).join(', ') || 'No categories'}
            </TableCell>
            <TableCell>
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="w-16 h-16 object-cover" />
              ) : (
                'No logo'
              )}
            </TableCell>
            <TableCell>{brand.organisation.name}</TableCell>
            <TableCell>
              <Popover>
                <PopoverTrigger>
                  <button className="text-gray-500 hover:text-black">
                    <span className="material-icons">...</span> {/* Trois petits points */}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48">
                  <button
                    onClick={() => handleEdit(brand.id)}
                    className="w-full text-left flex items-center space-x-2 p-2 text-black hover:bg-gray-100"
                  >
                    {/* <Edit className="h-5 w-5" /> */}
                    <span>Editer</span>
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="w-full text-left flex items-center space-x-2 p-2 text-black hover:bg-gray-100"
                  >
                    <span>Supprimer</span>
                  </button>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
