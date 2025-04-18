"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProductData } from "./product-generator-modal";  // Assurez-vous que ProductData inclut brandName
import { DollarSign, FileText, Image, Tag, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductGenerationResultProps {
  product: ProductData;
  onUpdate: (updatedProduct: ProductData) => void;
  onSave: (updatedProduct: ProductData) => void;
}

export function ProductGenerationResult({
  product,
  onUpdate,
  onSave,
}: ProductGenerationResultProps) {
  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || "");
  const [description, setDescription] = useState(product.description || "");
  const [categories, setCategories] = useState(
    product.categories.join(", ") || ""
  );
  const [images, setImages] = useState(product.images || []);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [brand, setBrand] = useState(product.brand || "");
  const [brandName, setBrandName] = useState(product.brandName || ""); // brandName est maintenant pris en compte
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setName(product.name || "");
    setPrice(product.price || "");
    setDescription(product.description || "");
    setCategories(product.categories.join(", ") || "");
    setImages(product.images || []);
    setBrand(product.brand || "");
    setBrandName(product.brandName || "");  // Initialisation de brandName
  }, [product]);

  const handleImageSelection = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleSave = async () => {
    if (!name || !price || !description || !brand || !brandName) {
      toast.error("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast.success("Veuillez entrer un prix valide.");
      return;
    }

    const updatedProduct: ProductData = {
      ...product,
      name,
      price,
      description,
      categories: categories.split(", ").map((cat) => cat.trim()),
      images: selectedImages,
      brand,
      brandName,  // Mise à jour avec brandName
    };

    try {
      await onSave(updatedProduct);
      toast.success("Produit sauvegardé avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div className="max-h-[500px] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label
              htmlFor="product-name"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="h-4 w-4" />
              Nom du produit
            </label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="product-price"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <DollarSign className="h-4 w-4 " />
              Prix
            </label>
            <Input
              id="product-price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label
              htmlFor="product-description"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <FileText className="h-4 w-4" />
              Description
            </label>
            <Textarea
              id="product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="product-categories"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <Tag className="h-4 w-4" />
              Catégories
            </label>
            <Input
              id="product-categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="product-brand"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Tag className="h-4 w-4" />
            Marque
          </label>
          <Input
            id="product-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="product-images"
            className="flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Image className="h-4 w-4" />
            Images
          </label>
          <div className="flex pt-5 flex-wrap gap-2">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Image ${index + 1}`}
                    className={`h-16 w-16 object-cover rounded-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 ${
                      selectedImages.includes(image)
                        ? "border-4 border-indigo-500"
                        : ""
                    }`}
                    onClick={() => handleImageSelection(image)}
                  />
                  <button
                    className="absolute top-0 right-0  text-white text-sm p-1 rounded-full opacity-75 bg-[#7f1d1c] hover:bg-[#7f1d1c]"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(image);
                    }}
                  >
                    <ZoomIn color="black" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm  text-gray-400">Aucune image disponible</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#7f1d1c] hover:bg-[#7f1d1c] text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Ajouter un produit
        </Button>
      </div>

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-5 rounded-lg">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-md max-h-[80vh] object-contain"
            />
            <button
              className="absolute top-0 right-0 text-white text-lg p-2"
              onClick={closeImageModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
