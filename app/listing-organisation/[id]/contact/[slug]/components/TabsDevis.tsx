import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";

const TabsDevis = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

  const [devis, setDevis] = useState([
    { 
      id: 1, 
      numero: 'D-001', 
      client: 'John Doe', 
      dateFacturation: '2025-03-01', 
      dateEcheance: '2025-03-15', 
      montant: '300,000 FCFA', 
      taxes: '60,000 FCFA', 
      statut: 'En attente' 
    },
    { 
      id: 2, 
      numero: 'D-002', 
      client: 'Jane Smith', 
      dateFacturation: '2025-02-28', 
      dateEcheance: '2025-03-10', 
      montant: '720,000 FCFA', 
      taxes: '144,000 FCFA', 
      statut: 'Approuvé' 
    },
  ]);

  const handleSearch = (e : React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDevis = devis.filter(devis =>
    devis.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!statusFilter || devis.statut === statusFilter) &&
    (!clientFilter || devis.client.toLowerCase().includes(clientFilter.toLowerCase())) &&
    (!dueDateFilter || devis.dateEcheance === dueDateFilter)
  );

  const handleAddDevis = () => {
    console.log('Ajouter un nouveau devis');
  };

  return (
    <TabsContent value="devis" className="p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Filters and Add Button */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <Input
          type="text"
          placeholder="Rechercher un devis"
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
        />
        <Input
          type="text"
          placeholder="Filtrer par client"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
        />
        <Input
          type="date"
          placeholder="Filtrer par date d'échéance"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
        />
        <select
          className="border-gray-300 rounded p-2 shadow-sm focus:ring focus:ring-indigo-200"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Approuvé">Approuvé</option>
          <option value="Validé">Validé</option>
        </select>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleAddDevis}>Ajouter un devis</Button>
      </div>

      {/* Devis Table */}
      {filteredDevis.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date Facturation</TableHead>
                <TableHead>Date Échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Taxes</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {filteredDevis.map(devis => (
                <TableRow key={devis.id}>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.id}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.numero}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.client}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.dateFacturation}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.dateEcheance}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.montant}</TableCell>
                  <TableCell className="px-6 py-4 text-gray-700">{devis.taxes}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      devis.statut === 'Approuvé'
                        ? 'bg-green-100 text-green-800'
                        : devis.statut === 'En attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {devis.statut}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-indigo-600 border-indigo-600 hover:bg-indigo-50">Modifier</Button>
                      <Button variant="destructive" size="sm" className="bg-red-600 text-white hover:bg-red-700">Supprimer</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">Aucun devis pour l'instant</div>
      )}
    </TabsContent>
  );
};

export default TabsDevis;
