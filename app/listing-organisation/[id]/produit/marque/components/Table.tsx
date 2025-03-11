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
import Chargement from '@/components/Chargement';

// Define your interfaces here
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
  Category: Category[]; // Categories relation
}

export function TableBrandIa() {
  const [brands, setBrands] = useState<Brand[]>([]); // Use the 'Brand' interface here
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

  if (loading) return <div><Chargement/></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">marque</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Categories</TableHead>
          <TableHead>Logo</TableHead>
          <TableHead>Organisation</TableHead>
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
