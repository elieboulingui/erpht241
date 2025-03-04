"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ProductHeaderProps {
  prompts: string;
  setPrompts: (value: string) => void;
  formData: {
    nom: string;
    description: string;
    categorie: string;
    prix: string;
  };
  setFormData: (value: {
    nom: string;
    description: string;
    categorie: string;
    prix: string;
  }) => void;
  status: string;
  images: string[];
  selectedImages: string[];
  handleImageSelect: (imageUrl: string) => void;
  setZoomedImage: (value: string | null) => void;
  Envoyer: () => Promise<void>;
  AjouterAuTableau: () => Promise<void>;
}

export default function ProductHeader({
  prompts,
  setPrompts,
  formData,
  setFormData,
  status,
  images,
  selectedImages,
  handleImageSelect,
  setZoomedImage,
  Envoyer,
  AjouterAuTableau,
}: ProductHeaderProps) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink className="text-black font-bold" href="#">
                  Produits
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {" "}
                  <IoMdInformationCircleOutline
                    className="h-4 w-4"
                    color="gray"
                  />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Dialog>
          <DialogTrigger className="bg-black hover:bg-black/80 transition-colors text-white px-4 py-2 rounded-lg">
            Ajouter un produit
          </DialogTrigger>
          <DialogContent className="max-w-lg w-full p-6">
            <DialogTitle className="text-xl font-bold mb-4">
              Génération de produit
            </DialogTitle>

            <form className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full p-4 text-sm border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                  onChange={(e) => setPrompts(e.target.value)}
                  value={prompts}
                  placeholder="Décrivez le produit à générer..."
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  className="absolute end-2.5 bottom-2.5 text-white bg-black hover:bg-black/80 px-4 py-2 rounded-md hover:text-white"
                  onClick={Envoyer}
                >
                  Générer
                </Button>
              </div>
            </form>
            <div className="space-y-4 p-3">
              <h2 className="font-semibold text-lg">Résultat</h2>
              <div className="min-h-[200px] p-4 rounded-lg border bg-gray-50 overflow-auto">
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="nom"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom du produit
                    </label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      className="mt-2"
                      placeholder="Entrez le nom du produit"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Input
                      id="description"
                      name="description"
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="mt-2"
                      placeholder="Entrez la description du produit"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="categorie"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Catégorie
                    </label>
                    <Input
                      id="categorie"
                      name="categorie"
                      type="text"
                      value={formData.categorie}
                      onChange={(e) =>
                        setFormData({ ...formData, categorie: e.target.value })
                      }
                      className="mt-2"
                      placeholder="Entrez la catégorie"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="prix"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Prix
                    </label>
                    <Input
                      id="prix"
                      name="prix"
                      type="number"
                      value={formData.prix}
                      onChange={(e) =>
                        setFormData({ ...formData, prix: e.target.value })
                      }
                      className="mt-2"
                      placeholder="Entrez le prix"
                    />
                  </div>
                </form>
              </div>
              {status && <p className="text-sm text-gray-600">{status}</p>}
              {images.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Sélectionnez des images:</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img || "/placeholder.svg?height=64&width=64"}
                          alt={`Produit ${index + 1}`}
                          width={64}
                          height={64}
                          className={`w-16 h-16 object-cover cursor-pointer rounded border ${
                            selectedImages.includes(img)
                              ? "ring-2 ring-blue-500"
                              : ""
                          }`}
                          onClick={() => handleImageSelect(img)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg?height=64&width=64";
                          }}
                        />
                        <button
                          className="absolute top-1 left-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage(img);
                          }}
                        >
                          <Maximize2 className="w-3 h-3 text-gray-700" />
                        </button>
                        {selectedImages.includes(img) && (
                          <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {formData.nom && (
                <button
                  className={`w-full bg-green-600 hover:bg-green-700 transition-colors text-white rounded-lg p-3 ${
                    selectedImages.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={AjouterAuTableau}
                  disabled={selectedImages.length === 0}
                >
                  Ajouter au tableau
                </button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="mt-2" />
    </div>
  );
}
