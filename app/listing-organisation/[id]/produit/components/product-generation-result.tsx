"use client"
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProductData } from "./product-generator-modal";
import { DollarSign, FileText, Image, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Interface for the Product Generation Result component
interface ProductGenerationResultProps {
  product: ProductData;
  onUpdate: (updatedProduct: ProductData) => void; // Callback function to handle updated product data
  onSave: (updatedProduct: ProductData) => void; // Function to handle saving to the backend
}

export function ProductGenerationResult({ product, onUpdate, onSave }: ProductGenerationResultProps) {
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(product.price || '');
  const [description, setDescription] = useState(product.description || '');
  const [categories, setCategories] = useState(product.categories.join(", ") || '');
  const [images, setImages] = useState(product.images || []); // Initialize the images state
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // To track selected images

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Selected image state

  useEffect(() => {
    // Reset values if the product prop changes
    setName(product.name || '');
    setPrice(product.price || '');
    setDescription(product.description || '');
    setCategories(product.categories.join(", ") || '');
    setImages(product.images || []);
  }, [product]);

  // Function to handle product updates
  const handleUpdate = () => {
    const updatedProduct: ProductData = {
      ...product,
      name,
      price,
      description,
      categories: categories.split(", ").map((cat) => cat.trim()), // Convert string back to array of categories
      images: selectedImages, // Send only the selected images to the backend
    };

    onUpdate(updatedProduct); // Call the parent's callback function with the updated product
  };

  // Function to handle saving the product data to the backend
  const handleSave = async () => {
    if (!name || !price || !description) {
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
      images: selectedImages, // Only the selected images
    };

    try {
      await onSave(updatedProduct); // Call the onSave function to send data to the backend
      toast.success("Produit sauvegardé avec succès !");
    } catch (error) {
      toast.error("Une erreur est survenue lors de la sauvegarde.");
    }
  };

  // Function to handle image changes
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file)); // Convert files to image URLs
      setImages((prevImages) => [...prevImages, ...newImages]); // Update the image state
    }
  };

  // Open the modal to view the image
  const openImageModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Toggle image selection
  const toggleImageSelection = (image: string) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((img) => img !== image)); // Remove from selected images
    } else {
      setSelectedImages([...selectedImages, image]); // Add to selected images
    }
  };

  return (
    <div className="space-y-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      {/* Nom et Prix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="product-name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Nom du produit
          </label>
          <Input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)} // Update the state when the user types
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="product-price" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <DollarSign className="h-4 w-4 " />
            Prix
          </label>
          <Input
            id="product-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)} // Update the state when the user types
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Description et Catégories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="product-description" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Description
          </label>
          <Textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update the state when the user types
            rows={5}
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="product-categories" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4" />
            Catégories
          </label>
          <Input
            id="product-categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)} // Update the state when the user types
            className="bg-gray-50 border-gray-200 rounded-lg focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <label htmlFor="product-images" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Image className="h-4 w-4" />
          Images
        </label>
        <div className="flex flex-wrap gap-2">
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className={`h-24 w-24 object-cover rounded-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 ${
                    selectedImages.includes(image) ? "border-4 border-indigo-500" : ""
                  }`}
                  onClick={() => openImageModal(image)} // Open the modal on click
                />
                <span
                  className={`absolute top-0 right-0 text-white bg-black rounded-full text-xs p-1 ${selectedImages.includes(image) ? "visible" : "invisible"}`}
                >
                  ✔
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">Aucune image disponible</p>
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-black hover:bg-black text-white font-medium px-8 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Ajouter un produit
        </Button>
      </div>

      {/* Image Modal */}
      {isModalOpen && selectedImage && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="relative">
      {/* Image with zoom effect */}
      <img
        src={selectedImage}
        alt="Selected"
        className="max-w-[60%] max-h-[60%] object-contain transition-transform duration-300 ease-in-out transform hover:scale-110 cursor-pointer" 
        onClick={closeImageModal} // Close modal when clicking the image
      />
      {/* Close Button */}
  
    </div>
  </div>
)}




    </div>
  );
}
