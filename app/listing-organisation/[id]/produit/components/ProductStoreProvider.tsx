// "use client";

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import {
//   useState,
//   createContext,
//   useContext,
//   type ReactNode,
//   useEffect,
// } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Maximize2, X, SlidersHorizontal, MoreHorizontal } from "lucide-react";
// import { VisuallyHidden } from "@/components/ui/visuallyHidden";
// import { getitemsByOrganisationId } from "./actions/GetAllItems";
// import { deleteProductByOrganisationAndProductId } from "./actions/DeleteItems";
// import { updateProductByOrganisationAndProductId } from "./actions/ItemUpdate";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbPage,
// } from "@/components/ui/breadcrumb";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { IoMdInformationCircleOutline } from "react-icons/io";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { getCategoriesofOneOrganisation } from "./actions/GetAllcategories";
// import { toast } from "sonner";

// // Define your interfaces
// interface Product {
//   id?: string;
//   Nom: string;
//   Description: string;
//   Catégorie: string; // Type string pour le nom
//   Prix: string;
//   imageUrls?: string[];
//   generatedImages?: string[];
//   category?: { id: string; name: string };

// }


// type Category = {
//   id: string;
//   name: string;
// };



// interface ProductStoreContextType {
//   products: Product[];
//   addProduct: (product: Product) => Promise<void>;
//   updateProduct: (product: Product) => Promise<void>;
//   removeProduct: (productId: any) => Promise<void>;
//   fetchProducts: () => Promise<void>;
// }

// // Create the context
// const ProductStoreContext = createContext<ProductStoreContextType | undefined>(
//   undefined
// );

// // Helper function to extract organisation ID from the URL
// const extractOrganisationId = (url: string): string | null => {
//   const regex = /\/listingorg\/([a-zA-Z0-9]+)/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };

// function ProductStoreProvider({ children }: { children: ReactNode }) {
//   const [products, setProducts] = useState<Product[]>([]);

//   const [organisationId, setOrganisationId] = useState<string | null>(null);


//   const fetchProducts = async () => {
//     if (!organisationId) {
//       console.error("Organisation ID non trouvé");
//       return;
//     }

//     try {
//       const productsFromDB = await getitemsByOrganisationId(organisationId);

//       // Check if productsFromDB is valid
//       if (!Array.isArray(productsFromDB)) {
//         console.error("Expected an array of products but got:", productsFromDB);
//         return; // Don't proceed if productsFromDB is not an array
//       }

//       const transformedData: Product[] = productsFromDB.map((item) => ({
//         id: item.id,  // Make sure the 'id' field is set here
//         Nom: item.name,
//         Description: item.description,
//         Catégorie: item.category?.name || "Sans catégorie",
//         Prix: item.price.toString(),
//         imageUrls: item.images || [],
//         category: item.category ? { id: item.category.id, name: item.category.name } : undefined,
//       }));


//       setProducts(transformedData);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des produits:", error);
//     }
//   };

//   const addProduct = async (product: Product) => { };

//   const updateProduct = async (updatedProduct: Product) => {
//     if (!organisationId || !updatedProduct.id) {
//       toast.error("Identifiants manquants");
//       return;
//     }

//     try {
//       const updateData = {
//         name: updatedProduct.Nom,
//         description: updatedProduct.Description,
//         category: updatedProduct.Catégorie,
//         price: parseFloat(updatedProduct.Prix),
//         images: updatedProduct.imageUrls || [],
//       };

//       await updateProductByOrganisationAndProductId(
//         organisationId,
//         updatedProduct.id,
//         updateData
//       );

//       setProducts(prev =>
//         prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
//       );
//       toast.success("Produit mis à jour !");
//     } catch (error) {
//       console.error("Erreur de mise à jour:", error);
//       toast.error("Échec de la mise à jour");
//     }
//   };

//   // Helper function to map the product data to the format expected by the update function
 
//   // Remove product via API
//   const removeProduct = async (productId: string) => {
//     // alert(productId)
//     if (!organisationId) return;

//     try {
//       const response = await deleteProductByOrganisationAndProductId(
//         organisationId,
//         productId
//       );

//       // Assuming you now expect the response to just complete or contain data, you can simply log or process the response directly.
//       // If the response contains JSON data

//       // Assuming no errors were thrown, filter the product from the state
//       setProducts((prevProducts) =>
//         prevProducts.filter((product) => product.id !== productId)
//       );
//     } catch (error) {
//       console.error("Erreur lors de la suppression du produit:", error);
//     }
//   };

//   useEffect(() => {
//     const id = extractOrganisationId(window.location.href);
//     if (id) {
//       setOrganisationId(id);
//     } else {
//       console.error("ID de l'organisation non trouvé dans l'URL");
//     }
//   }, [extractOrganisationId]); // Added extractOrganisationId as a dependency

//   useEffect(() => {
//     if (organisationId) {
//       fetchProducts();
//     }
//   }, [organisationId, fetchProducts]); // Added fetchProducts as a dependency

//   return (
//     <ProductStoreContext.Provider
//       value={{
//         products,
//         addProduct,
//         updateProduct,
//         removeProduct,
//         fetchProducts,
//       }}
//     >
//       {children}
//     </ProductStoreContext.Provider>
//   );
// }

// // Hook pour utiliser le store
// function useProductStore() {
//   const context = useContext(ProductStoreContext);
//   if (context === undefined) {
//     throw new Error(
//       "useProductStore must be used within a ProductStoreProvider"
//     );
//   }
//   return context;
// }
// export default function Page() {
//   const [prompts, setPrompts] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [images, setImages] = useState<string[]>([]);

//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const [status, setStatus] = useState<string>("");
//   const [zoomedImage, setZoomedImage] = useState<string | null>(null);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);

//   const [formData, setFormData] = useState({
//     nom: "",
//     description: "",
//     categorie: "",
//     prix: "",
//   });


//   const Envoyer = async () => {
//     setLoading(true);
//     setStatus("");

//     const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
//     const cx = process.env.NEXT_PUBLIC_GOOGLE_CX;

//     if (!apiKey || !cx) {
//       console.error("Clé API Google manquante !");
//       setStatus("Erreur : Clé API Google manquante.");
//       return;
//     }

//     try {
//       const genAI = new GoogleGenerativeAI(apiKey);
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const structuredPrompt = `
//         Vous êtes un assistant IA expert en structuration de données produits.
//         Génère un objet JSON représentant un produit basé sur la description suivante :
//         "${prompts}"

//         Format attendu :
//         {
//           "Nom": "Nom du produit",
//           "Description": "Brève présentation du produit",
//           "Catégorie": "Type de produit",
//           "Prix": "Prix en FCFA"
//         }
//       `;

//       const response = await model.generateContent(structuredPrompt);
//       if (response?.response?.text) {
//         const text = await response.response.text();

//         const jsonMatch = text.match(/\{[\s\S]*\}/);
//         if (!jsonMatch) {
//           throw new Error("Aucun JSON valide trouvé dans la réponse.");
//         }

//         const jsonString = jsonMatch[0];

//         const cleanedJsonString = jsonString
//           .replace(/\n/g, "")
//           .replace(/\r/g, "")
//           .trim();

//         try {
//           const jsonResult: Product = JSON.parse(cleanedJsonString);

//           // Mettre à jour les champs du formulaire directement
//           setFormData({
//             nom: jsonResult.Nom,
//             description: jsonResult.Description,
//             categorie: jsonResult.Catégorie,
//             prix: jsonResult.Prix,
//           });

//           // Rechercher des images basées sur le nom du produit
//           fetchImages(jsonResult.Nom);
//         } catch (parseError) {
//           console.error("Erreur lors du parsing du JSON :", parseError);
//           setStatus("Erreur lors du parsing du JSON.");
//         }
//       } else {
//         setStatus("Réponse vide ou invalide.");
//       }
//     } catch (error) {
//       console.error("Erreur lors de la génération :", error);
//       setStatus("Erreur lors de la génération.");
//     }
//     setLoading(false);
//   };

//   const fetchImages = async (query: string): Promise<void> => {
//     setStatus("Recherche d'image en cours...");
//     const apiKey = process.env.NEXT_PUBLIC_IMAGE_API_KEY;
//     const cx = process.env.NEXT_PUBLIC_IMAGE_CX;
//     const imageSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}&searchType=image&num=10`;

//     try {
//       const response = await fetch(imageSearchUrl);
//       const data = await response.json();
//       if (data.items && data.items.length > 0) {
//         const imageUrls = data.items.map((item: any) => item.link);
//         setImages(imageUrls);
//         setStatus("Images récupérées avec succès!");
//       } else {
//         setStatus("Aucune image trouvée.");
//       }
//     } catch {
//       setStatus("Erreur lors de la recherche d'image");
//     }
//   };

//   const handleImageSelect = (imageUrl: string) => {
//     setSelectedImages((prevSelected) => {
//       // If image is already selected, remove it (deselect)
//       if (prevSelected.includes(imageUrl)) {
//         return prevSelected.filter((img) => img !== imageUrl);
//       }
//       // If image is not selected, add it
//       return [...prevSelected, imageUrl];
//     });
//   };

//   // Utilisation du store dans le composant principal
//   return (
//     <ProductStoreProvider>
//       <ProductContent
//         prompts={prompts}
//         setPrompts={setPrompts}
//         loading={loading}
//         images={images}
//         selectedImages={selectedImages}
//         status={status}
//         zoomedImage={zoomedImage}
//         editingProduct={editingProduct}
//         setSelectedImages={setSelectedImages}
//         setImages={setImages}
//         setZoomedImage={setZoomedImage}
//         setEditingProduct={setEditingProduct}
//         handleImageSelect={handleImageSelect}
//         Envoyer={Envoyer}
//         formData={formData}
//         setFormData={setFormData}
//       />
//     </ProductStoreProvider>
//   );
// }

// // Composant pour le contenu principal
// function ProductContent({
//   prompts,
//   setPrompts,
//   loading,
//   images,
//   selectedImages,
//   status,
//   zoomedImage,
//   editingProduct,
//   setSelectedImages,
//   setImages,
//   setZoomedImage,
//   setEditingProduct,
//   handleImageSelect,
//   Envoyer,
//   formData,
//   setFormData,
// }: {
//   prompts: string;
//   setPrompts: (value: string) => void;
//   loading: boolean;
//   images: string[];
//   selectedImages: string[];
//   status: string;
//   zoomedImage: string | null;
//   editingProduct: Product | null;
//   setSelectedImages: (value: string[]) => void;
//   setImages: (value: string[]) => void;
//   setZoomedImage: (value: string | null) => void;
//   setEditingProduct: (value: Product | null) => void;
//   handleImageSelect: (imageUrl: string) => void;
//   Envoyer: () => Promise<void>;
//   formData: {
//     nom: string;
//     description: string;
//     categorie: string;
//     prix: string;
//   };
//   setFormData: (value: {
//     nom: string;
//     description: string;
//     categorie: string;
//     prix: string;
//   }) => void;
// }) {
//   const { products, addProduct, updateProduct, removeProduct } =
//     useProductStore();

//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [categories, setCategories] = useState<Category[]>([]);// Remplacer catories par categories  // Typage explicite
//   const [formDatas, setFormDatas] = useState({ categorie: '' });
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
//   const [categoryFilter, setCategoryFilter] = useState<string>("");
//   const [priceRange, setPriceRange] = useState<{
//     min: number;
//     max: number | null;
//   }>({ min: 0, max: null });
//   const [sortOption, setSortOption] = useState<
//     "default" | "priceAsc" | "priceDesc"
//   >("default");
//   const [organisationId, setOrganisationId] = useState(null);
//   const [activeFilters, setActiveFilters] = useState<{
//     search: boolean;
//     category: boolean;
//     price: boolean;
//   }>({
//     search: false,
//     category: false,
//     price: false,
//   });

//   const filteredProducts = products.filter((product) => {
//     // Ensure `product.Nom` and `product.Description` are defined
//     const nom = product.Nom ? product.Nom.toLowerCase() : "";
//     const description = product.Description
//       ? product.Description.toLowerCase()
//       : "";
//     const price = Number.parseFloat(product.Prix);
//     const category = product.Catégorie || "";

//     const matchesSearch =
//       searchTerm === "" ||
//       nom.includes(searchTerm.toLowerCase()) ||
//       description.includes(searchTerm.toLowerCase());

//     // Filtre par catégorie - vérification stricte
//     const matchesCategory =
//       categoryFilter === "" || category === categoryFilter;

//     const matchesPrice =
//       priceRange.min === 0 ||
//       (price >= priceRange.min &&
//         (priceRange.max === null || price <= priceRange.max));

//     return matchesSearch && matchesCategory && matchesPrice;
//   });

//   const displayedProducts =
//     sortOption === "default"
//       ? filteredProducts
//       : [...filteredProducts].sort((a, b) => {
//         const priceA = Number.parseFloat(a.Prix);
//         const priceB = Number.parseFloat(b.Prix);
//         if (sortOption === "priceAsc") return priceA - priceB;
//         return priceB - priceA;
//       });

//   // Obtenir les catégories uniques pour le filtre
//   const uniqueCategories = Array.from(
//     new Set(products.map((product) => product.Catégorie))
//   );

//   // Fonction pour extraire l'ID de l'organisation
//   const extractOrganisationId = (url: any) => {
//     const regex = /\/listingorg\/([a-z0-9]+)/;
//     const match = url.match(regex);
//     if (match) {
//       return match[1];
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (!organisationId) return;

//     const fetchCategories = async () => {
//       try {
//         const info = await getCategoriesofOneOrganisation(organisationId);
//         setCategories(info)  // info doit être un tableau de catégories

//         // Si des catégories existent, initialiser formDatas.categorie avec l'ID de la première catégorie
//         if (info.length > 0) {
//           setFormDatas({ categorie: info[0].id });
//         }
//       } catch (error) {
//         console.error("Erreur lors du fetching des catégories:", error);
//       }
//     };

//     fetchCategories();
//   }, [organisationId]); // Add organisationId as dependency

//   // Cette fonction est appelée dès que la page est chargée
//   useEffect(() => {
//     const id = extractOrganisationId(window.location.href);
//     if (id) {
//       setOrganisationId(id);
//     } else {
//       toast.error("ID de l'organisation non trouvé dans l'URL.");
//     }
//   }, [extractOrganisationId]); // Added extractOrganisationId as a dependency

//   useEffect(() => {
//     setActiveFilters({
//       search: searchTerm !== "",
//       category: categoryFilter !== "",
//       price: priceRange.min > 0 || priceRange.max !== null,
//     });
//   }, [searchTerm, categoryFilter, priceRange]);

//   const AjouterAuTableau = async () => {
//     if (selectedImages.length === 0) {
//       toast.error("Veuillez sélectionner au moins une image !");
//       return;
//     }

//     try {
//       const productToAdd = {
//         name: formData.nom.trim(),
//         description: formData.description.trim(),
//         price: Number.parseFloat(formData.prix),
//         images: selectedImages,
//         organisationId,
//         category:  selectedCategoryId 
//         ? { id: selectedCategoryId }
//         : { name: formData.categorie }
//       };

//       // Validation des données
//       if (!productToAdd.name || !productToAdd.description) {
//         throw new Error("Le nom et la description sont obligatoires");
//       }

//       if (isNaN(productToAdd.price) || productToAdd.price <= 0) {
//         throw new Error("Le prix doit être un nombre valide supérieur à 0");
//       }

//       const response = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(productToAdd),
//       });

//       if (!response.ok) {
//         let errorMessage = "Erreur serveur";
//         const contentType = response.headers.get("content-type");

//         // Création d'un clone pour la lecture d'erreur
//         const errorResponse = response.clone();

//         try {
//           // Essayer de lire en JSON si le content-type est approprié
//           if (contentType?.includes("application/json")) {
//             const errorData = await errorResponse.json();
//             errorMessage = errorData.error || errorMessage;
//           } else {
//             errorMessage = await errorResponse.text();
//           }
//         } catch (error) {
//           console.error("Erreur de lecture de la réponse:", error);
//           errorMessage = "Impossible d'interpréter la réponse du serveur";
//         }

//         throw new Error(errorMessage);
//       }

//       // Lecture de la réponse réussie
//       const addedProduct = await response.json();

//       // Mise à jour de l'état
//       addProduct({
//         ...addedProduct,
//         Nom: addedProduct.name,
//         Description: addedProduct.description,
//         Catégorie: addedProduct.category?.name || "Non classé",
//         Prix: addedProduct.price.toString(),
//         imageUrls: addedProduct.images
//       });

//       // Réinitialisation du formulaire
//       setFormData({ nom: "", description: "", categorie: "", prix: "" });
//       setSelectedImages([]);
//       setImages([]);
//       setSelectedCategoryId("");
//       toast.success("Produit ajouté avec succès !");
//     } catch (error) {
//       console.error("Erreur lors de l'ajout du produit:", error);

//       let message = "Erreur lors de l'ajout du produit";
//       if (error instanceof Error) {
//         message = error.message;

//         // Gestion des erreurs spécifiques
//         if (message.includes("unique constraint")) {
//           message = "Ce produit existe déjà";
//         } else if (message.includes("invalid input")) {
//           message = "Données invalides";
//         }
//       }

//       toast.error(message);
//     }
//   };

//   return (
//     <div className="w-full p-4 gap-4">
//       <div className="flex justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem className="hidden md:block">
//                 <BreadcrumbLink className="text-black font-bold" href="#">
//                   Produits
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbItem>
//                 <BreadcrumbPage>
//                   {" "}
//                   <IoMdInformationCircleOutline
//                     className="h-4 w-4"
//                     color="gray"
//                   />
//                 </BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>

//         <Dialog>
//           <DialogTrigger className="bg-black hover:bg-back transition-colors text-white px-4 py-2 rounded-lg">
//             Ajouter un produit
//           </DialogTrigger>
//           <DialogContent className="max-w-lg w-full p-6">
//             <DialogTitle className="text-xl font-bold mb-4">
//               Génération de produit
//             </DialogTitle>

//             <form className="space-y-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   className="block w-full p-4 text-sm border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
//                   onChange={(e) => setPrompts(e.target.value)}
//                   value={prompts}
//                   placeholder="Décrivez le produit à générer..."
//                   required
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="absolute end-2.5 bottom-2.5 text-white  hover:bg-back px-4 bg-black hover:bg-black py-2 rounded-md hover:text-white"
//                   onClick={Envoyer}
//                 >
//                   Générer
//                 </Button>
//               </div>
//             </form>
//             <div className="space-y-4 p-3">
//               <h2 className="font-semibold text-lg">Résultat</h2>
//               <div className="min-h-[200px] p-4 rounded-lg border bg-gray-50 overflow-auto">
//                 <form className="space-y-4">
//                   <div>
//                     <label
//                       htmlFor="nom"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Nom du produit
//                     </label>
//                     <Input
//                       id="nom"
//                       name="nom"
//                       type="text"
//                       value={formData.nom}
//                       onChange={(e) =>
//                         setFormData({ ...formData, nom: e.target.value })
//                       }
//                       className="mt-2"
//                       placeholder="Entrez le nom du produit"
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="description"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Description
//                     </label>
//                     <Input
//                       id="description"
//                       name="description"
//                       type="text"
//                       value={formData.description}
//                       onChange={(e) =>
//                         setFormData({ ...formData, description: e.target.value })
//                       }
//                       className="mt-2"
//                       placeholder="Entrez la description du produit"
//                     />
//                   </div>


//                   <div className="grid gap-2">
//   <label className="block text-sm font-medium text-gray-700">
//     Catégorie générée par l'IA
//   </label>
//   <Input
//     id="ai-category"
//     name="ai-category"
//     type="text"
//     value={formData.categorie}
//     onChange={(e) => {
//       setFormData({ ...formData, categorie: e.target.value });
//       // setCategorySource('ai');
//     }}
//     className="mt-1"
//     placeholder="Catégorie générée automatiquement"
//   />
// </div>

//                   <select
//                     id="existing-category"
//                     value={selectedCategoryId}
//                     onChange={(e) => {
//                       setSelectedCategoryId(e.target.value);
                    
//                       // setFormData(prev => ({ ...prev, categorie: "" }));
//                     }}
//                     className="mt-2 w-full p-2 border rounded-lg"
//                   >
//                     <option value="" disabled>Sélectionnez une catégorie</option>
//                     {categories.map(category => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>

//                   <div>
//                     <label
//                       htmlFor="prix"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Prix
//                     </label>
//                     <Input
//                       id="prix"
//                       name="prix"
//                       type="number"
//                       value={formData.prix}
//                       onChange={(e) =>
//                         setFormData({ ...formData, prix: e.target.value })
//                       }
//                       className="mt-2"
//                       placeholder="Entrez le prix"
//                     />
//                   </div>
//                 </form>
//               </div>
//               {status && <p className="text-sm text-gray-600">{status}</p>}
//               {images.length > 0 && (
//                 <div>
//                   <h3 className="font-medium mb-2">Sélectionnez des images:</h3>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {images.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img || "/placeholder.svg?height=64&width=64"}
//                           alt={`Produit ${index + 1}`}
//                           width={64}
//                           height={64}
//                           className={`w-16 h-16 object-cover cursor-pointer rounded border ${selectedImages.includes(img)
//                             ? "ring-2 ring-blue-500"
//                             : ""
//                             }`}
//                           onClick={() => handleImageSelect(img)}
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src =
//                               "/placeholder.svg?height=64&width=64";
//                           }}
//                         />
//                         <button
//                           className="absolute top-1 left-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setZoomedImage(img);
//                           }}
//                         >
//                           <Maximize2 className="w-3 h-3 text-gray-700" />
//                         </button>
//                         {selectedImages.includes(img) && (
//                           <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-3 w-3 text-white"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {formData.nom && (
//                 <button
//                   className={`w-full bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg p-3 ${selectedImages.length === 0
//                     ? "opacity-50 cursor-not-allowed"
//                     : ""
//                     }`}
//                   onClick={AjouterAuTableau}
//                   disabled={selectedImages.length === 0}
//                 >
//                   Ajouter au tableau
//                 </button>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>


//       <Separator className="mt-2" />


//       <div className="w-full mt-5">
//         <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
//           {/* Filtrer par catégorie */}
//           <div className="flex flex-col gap-2 w-full md:w-auto">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-medium">Catégorie:</span>
//               <select
//                 className="p-2 border rounded-lg flex-grow"
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//               >
//                 <option value="">Toutes les catégories</option>
//                 {uniqueCategories.map((category, index) => (
//                   <option key={index} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {categoryFilter && (
//               <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs self-start">
//                 Catégorie: {categoryFilter}
//                 <button
//                   onClick={() => setCategoryFilter("")}
//                   className="ml-1 hover:text-green-900"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Trier par prix */}
//           <div className="flex items-center gap-2">
//             <label htmlFor="sort-price" className="text-sm font-medium">
//               Trier par prix:
//             </label>
//             <select
//               id="sort-price"
//               className="p-2 border rounded-lg"
//               value={sortOption}
//               onChange={(e) =>
//                 setSortOption(
//                   e.target.value as "default" | "priceAsc" | "priceDesc"
//                 )
//               }
//             >
//               <option value="default">Par défaut</option>
//               <option value="priceAsc">Croissant</option>
//               <option value="priceDesc">Décroissant</option>
//             </select>
//           </div>

//           {/* Rechercher */}
//           <div className="relative flex-grow md:w-64 md:flex-grow-0">
//             <input
//               type="text"
//               className="w-full p-3 pl-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//               placeholder="Rechercher un produit..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <svg
//                 className="w-4 h-4 text-gray-500"
//                 aria-hidden="true"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {(activeFilters.search ||
//           activeFilters.category ||
//           activeFilters.price) && (
//             <div className="mt-4 p-3 bg-gray-50 rounded-lg flex flex-wrap items-center gap-2">
//               <span className="text-sm font-medium">Filtres actifs:</span>

//               {activeFilters.search && (
//                 <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                   Recherche: {searchTerm}
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="ml-1 hover:text-blue-900"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               )}

//               {activeFilters.category && (
//                 <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                   Catégorie: {categoryFilter}
//                   <button
//                     onClick={() => setCategoryFilter("")}
//                     className="ml-1 hover:text-green-900"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               )}

//               {activeFilters.price && (
//                 <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
//                   Prix: {priceRange.min} - {priceRange.max || "∞"} FCFA
//                   <button
//                     onClick={() => setPriceRange({ min: 0, max: null })}
//                     className="ml-1 hover:text-purple-900"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               )}

//               <button
//                 onClick={() => {
//                   setSearchTerm("");
//                   setCategoryFilter("");
//                   setPriceRange({ min: 0, max: null });
//                   setSortOption("default");
//                 }}
//                 className="ml-auto text-xs text-gray-600 hover:text-gray-900 underline"
//               >
//                 Réinitialiser tous les filtres
//               </button>
//             </div>
//           )}

//         <div className="overflow-x-auto rounded-lg shadow">
//           <table className="w-full table-auto border-collapse bg-white">
//             <thead>
//               <tr className="bg-gray-50 text-left">
//                 <th className="p-3 border-b text-sm text-gray-500 font-light">
//                   Nom du Produit
//                 </th>
//                 <th className="p-3 border-b text-sm text-gray-500 font-light w-1/3">
//                   Description
//                 </th>
//                 <th className="p-3 border-b text-sm text-gray-500 font-light">
//                   Catégorie
//                 </th>
//                 <th className="p-3 border-b text-sm text-gray-500 font-light">
//                   Prix
//                 </th>
//                 <th className="p-3 border-b text-sm text-gray-500 font-light">
//                   Images
//                 </th>
//                 <th className="p-3 border-b text-sm text-gray-500 font-light">
//                   <SlidersHorizontal className="h-4 w-4" />
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.length === 0 ? (
//                 <div className="flex items-center justify-center">
//                      {/* <Chargement /> */}
//                 </div>
//               ) : displayedProducts.length === 0 ? (
//                 <tr>
//                   <td className="p-4 text-center text-gray-500" colSpan={6}>
//                     Aucun produit ne correspond à votre recherche.
//                   </td>
//                 </tr>
//               ) : (
//                 displayedProducts.map((product, index) => (
//                   <tr
//                     key={index}
//                     className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                       }`}
//                   >
//                     <td className="p-3 font-medium">{product.Nom}</td>
//                     <td className="p-3">{product.Description}</td>
//                     <td className="p-3">{product.Catégorie}</td>
//                     <td className="p-3">{product.Prix} FCFA</td>
//                     <td className="p-3">
//                       <div className="flex gap-2 overflow-x-auto max-w-[200px] pb-2">
//                         {Array.isArray(product.imageUrls) &&
//                           product.imageUrls.map((img: string, idx: number) => (
//                             <div key={idx} className="relative group">
//                               <img
//                                 src={
//                                   img || "/placeholder.svg?height=64&width=64"
//                                 }
//                                 alt={product.Nom}
//                                 width={64}
//                                 height={64}
//                                 className="w-16 h-16 object-cover flex-shrink-0 rounded border"
//                                 onError={(e) => {
//                                   (e.target as HTMLImageElement).src =
//                                     "/placeholder.svg?height=64&width=64";
//                                 }}
//                               />
//                               <button
//                                 className="absolute top-1 left-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                 onClick={() => setZoomedImage(img)}
//                               >
//                                 <Maximize2 className="w-3 h-3 text-gray-700" />
//                               </button>
//                             </div>
//                           ))}
//                       </div>
//                     </td>
//                     <td className="p-3">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-200">
//                             <MoreHorizontal className="h-4 w-4" />
//                             <span className="sr-only">Ouvrir le menu</span>
//                           </button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem
//                             onClick={() => setEditingProduct(product)}
//                             className="cursor-pointer"
//                           >
//                             Modifier
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => removeProduct(product.id)}
//                             className="cursor-pointer text-red-500"
//                           >
//                             Supprimer
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//         {categoryFilter && (
//           <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//             <h3 className="font-medium text-sm mb-2">
//               Statistiques de la catégorie: {categoryFilter}
//             </h3>
//             <p className="text-sm text-gray-600">
//               {displayedProducts.length
//                 ? displayedProducts.filter(
//                   (p) => p.Catégorie === categoryFilter
//                 ).length
//                 : 0}{" "}
//               produit{displayedProducts.length !== 1 ? "s" : ""} dans cette
//               catégorie
//             </p>
//             <p className="text-sm text-gray-600">
//               Prix moyen:{" "}
//               {displayedProducts.length > 0
//                 ? (
//                   displayedProducts.reduce(
//                     (sum, p) => sum + Number.parseFloat(p.Prix),
//                     0
//                   ) / displayedProducts.length
//                 ).toFixed(2)
//                 : 0}{" "}
//               FCFA
//             </p>
//           </div>
//         )}
//       </div>
//       <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
//         <DialogContent className="max-w-3xl">
//           <VisuallyHidden>
//             <DialogTitle>Image zoomée</DialogTitle>
//           </VisuallyHidden>
//           {zoomedImage && (
//             <img
//               src={zoomedImage || "/placeholder.svg"}
//               alt="Image zoomée"
//               className="w-full h-auto object-contain max-h-[80vh]"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src =
//                   "/placeholder.svg?height=400&width=400";
//               }}
//             />
//           )}
//           <button
//             onClick={() => setZoomedImage(null)}
//             className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white/100 transition-colors"
//             aria-label="Fermer"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </DialogContent>
//       </Dialog>
//       <Dialog
//         open={!!editingProduct}
//         onOpenChange={(open) => !open && setEditingProduct(null)}
//       >
//         <DialogContent className="max-w-lg">
//           <DialogTitle>Modifier le produit</DialogTitle>
//           {editingProduct && (
//             <div className="space-y-4">
//               <div className="grid gap-2">
//                 <label htmlFor="edit-name" className="text-sm font-medium">
//                   Nom
//                 </label>
//                 <input
//                   id="edit-name"
//                   type="text"
//                   className="w-full p-2 border rounded-lg"
//                   value={editingProduct.Nom}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       Nom: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <label
//                   htmlFor="edit-description"
//                   className="text-sm font-medium"
//                 >
//                   Description
//                 </label>
//                 <textarea
//                   id="edit-description"
//                   className="w-full p-2 border rounded-lg min-h-[100px]"
//                   value={editingProduct.Description}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       Description: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <label htmlFor="edit-category" className="text-sm font-medium">
//                   Catégorie
//                 </label>
//                 <input
//                   id="edit-category"
//                   type="text"
//                   className="w-full p-2 border rounded-lg"
//                   value={editingProduct.Catégorie}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       Catégorie: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <label htmlFor="edit-price" className="text-sm font-medium">
//                   Prix (FCFA)
//                 </label>
//                 <input
//                   id="edit-price"
//                   type="text"
//                   className="w-full p-2 border rounded-lg"
//                   value={editingProduct.Prix}
//                   onChange={(e) =>
//                     setEditingProduct({
//                       ...editingProduct,
//                       Prix: e.target.value,
//                     })
//                   }
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <label className="text-sm font-medium">
//                   Images sélectionnées
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {editingProduct.imageUrls &&
//                     editingProduct.imageUrls.map((img, idx) => (
//                       <div key={idx} className="relative">
//                         <img
//                           src={img || "/placeholder.svg?height=64&width=64"}
//                           alt={`Image ${idx + 1}`}
//                           className="w-16 h-16 object-cover rounded border"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src =
//                               "/placeholder.svg?height=64&width=64";
//                           }}
//                         />
//                         <button
//                           className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
//                           onClick={() => {
//                             const newUrls = [
//                               ...editingProduct.imageUrls!,
//                             ].filter((_, i) => i !== idx);
//                             setEditingProduct({
//                               ...editingProduct,
//                               imageUrls: newUrls,
//                             });
//                           }}
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//               <div className="grid gap-2">
//                 <label className="text-sm font-medium">Images générées</label>
//                 <div className="flex flex-wrap gap-2">
//                   {editingProduct.generatedImages &&
//                     editingProduct.generatedImages.map((img, idx) => (
//                       <div key={idx} className="relative group">
//                         <img
//                           src={img || "/placeholder.svg?height=64&width=64"}
//                           alt={`Image générée ${idx + 1}`}
//                           className={`w-16 h-16 object-cover cursor-pointer rounded border ${editingProduct.imageUrls?.includes(img)
//                             ? "ring-2 ring-blue-500"
//                             : ""
//                             }`}
//                           onClick={() => {
//                             const newUrls = editingProduct.imageUrls?.includes(
//                               img
//                             )
//                               ? editingProduct.imageUrls.filter(
//                                 (url) => url !== img
//                               )
//                               : [...(editingProduct.imageUrls || []), img];
//                             setEditingProduct({
//                               ...editingProduct,
//                               imageUrls: newUrls,
//                             });
//                           }}
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src =
//                               "/placeholder.svg?height=64&width=64";
//                           }}
//                         />
//                         {editingProduct.imageUrls?.includes(img) && (
//                           <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-3 w-3 text-white"
//                               viewBox="0 0 20 20"
//                               fill="currentColor"
//                             >
//                               <path
//                                 fillRule="evenodd"
//                                 d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                 clipRule="evenodd"
//                               />
//                             </svg>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2 pt-4">
//                 <button
//                   className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
//                   onClick={() => setEditingProduct(null)}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   onClick={() => {
//                     if (editingProduct) {
//                       updateProduct(editingProduct);
//                       setEditingProduct(null);
//                     }
//                   }}
//                 >
//                   Enregistrer
//                 </button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }