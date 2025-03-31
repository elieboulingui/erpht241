// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";  // Importer les composants de ShadCN

// interface GoogleCSESearchProps {
//   searchQuery: string;
//   setSearchQuery: (value: string) => void;
//   setCompanyData: React.Dispatch<React.SetStateAction<any>>;
//   setSearchResults: React.Dispatch<React.SetStateAction<any>>;
// }

// const GoogleCSESearch: React.FC<GoogleCSESearchProps> = ({
//   searchQuery,
//   setSearchQuery,
//   setCompanyData,
//   setSearchResults
// }) => {
//   const [isDialogOpen, setDialogOpen] = useState(false);  // État pour gérer l'ouverture du Dialog

//   // Charger le script Google CSE seulement une fois lors du premier rendu
//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://cse.google.com/cse.js?cx=76c1b920a90f44860';  // ID de ton moteur de recherche personnalisé (Google CSE)
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script); // Nettoyage du script lors du démontage du composant
//     };
//   }, []);

//   // Récupérer les données de Google CSE API lorsque la requête de recherche change
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `https://www.googleapis.com/customsearch/v1?q=${searchQuery}&key=AIzaSyBYKRNNDZo0SwQck0LSkAeo9j8xtd-7j24&cx=76c1b920a90f44860`  // Remplace `YOUR_GOOGLE_API_KEY` par ta clé API Google
//         );
//         const data = await response.json();
        
//         // Mettre à jour les données de l'entreprise avec les résultats
//         setCompanyData(data.items || []);  // Assurez-vous que les données sont sous la clé 'items'

//         console.log("Search Results:", data.items);
//         setSearchResults(data.items);  // Enregistrez les résultats dans l'état

//         if (data.items && data.items.length > 0) {
//           setDialogOpen(true);  // Ouvrir le Dialog si des résultats sont trouvés
//         }
//       } catch (error) {
//         console.error("Error loading data:", error);
//         toast.error("Error loading data");
//       }
//     };

//     if (searchQuery) {
//       fetchData();  // Exécute la recherche uniquement si `searchQuery` n'est pas vide
//     }
//   }, [searchQuery, setCompanyData, setSearchResults]);  // Lancer la recherche chaque fois que searchQuery change

//   return (
//     <div>
//       <div className="gcse-search"></div> {/* Affiche la div de recherche Google CSE */}

//       {/* Intégration du dialog de ShadCN */}
//       <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
//         <DialogTrigger asChild>
//           {/* Un bouton ou autre déclencheur qui pourrait ouvrir le Dialog */}
//           <button className="hidden">Open Dialog</button> {/* Le trigger est caché */}
//         </DialogTrigger>
//         <DialogContent>
//           <DialogTitle>Résultats de Recherche</DialogTitle>
//           <div>
//             {searchResults && searchResults.length > 0 ? (
//               <ul>
//                 {searchResults.map((result, index) => (
//                   <li key={index}>
//                     <a href={result.link} target="_blank" rel="noopener noreferrer">
//                       {result.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Aucun résultat trouvé.</p>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default GoogleCSESearch;
