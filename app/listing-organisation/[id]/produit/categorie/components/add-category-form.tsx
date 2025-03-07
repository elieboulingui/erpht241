import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UploadButton } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { createCategory } from "../action/CreatCategories";
import { createSubCategory } from "../action/CreateSubCategories";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  logo?: string;
  subLogo?: string;
}

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organisationId, setOrganisationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [subCategoryData, setSubCategoryData] = useState({
    subName: "",
    subDescription: "",
    selectedCategoryId: null as string | null,
    subLogo: "",
  });

  const [categories, setCategories] = useState<any[]>([]); // Main categories
  const [isSubCategory, setIsSubCategory] = useState(false); // Toggle between main category and subcategory form

  const extractOrganisationId = () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/listing-organisation\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  useEffect(() => {
    const orgId = extractOrganisationId();
    if (orgId) {
      setOrganisationId(orgId); // Set organisationId
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (organisationId) {
        try {
          const response = await fetch(`/api/categories?organisationId=${organisationId}`);
          const data = await response.json();
          setCategories(data);  // Store fetched categories
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };
    if (organisationId) fetchCategories();
  }, [organisationId]);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Category name is required.");
      setLoading(false);
      return;
    }

    if (!organisationId) {
      toast.error("Organisation ID is required.");
      setLoading(false);
      return;
    }

    try {
      const mainCategory = await createCategory({
        name: trimmedName,
        description: description.trim(),
        organisationId,
        logo: formData.logo || "",
      });

      if (!mainCategory?.id) throw new Error("Failed to create main category");

      toast.success("Category created successfully");

      // Reset category form
      setName("");
      setDescription("");
      setFormData({});
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating category", {
        description: "Please check the data and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { subName, subDescription, selectedCategoryId } = subCategoryData;
    const trimmedSubName = subName.trim();

    if (!trimmedSubName) {
      toast.error("Subcategory name is required.");
      setLoading(false);
      return;
    }

    if (!selectedCategoryId) {
      toast.error("Parent category is required.");
      setLoading(false);
      return;
    }

    try {
      const subCategory = await createSubCategory({
        name: trimmedSubName,
        description: subDescription.trim(),
        logo: formData.subLogo || "",
        parentId: selectedCategoryId,
        organisationId,
      });

      if (subCategory.data?.id) {
        toast.success("Subcategory created successfully");
      } else {
        toast.error("Error creating subcategory");
      }

      // Reset subcategory form
      setSubCategoryData({
        subName: "",
        subDescription: "",
        selectedCategoryId: null,
        subLogo: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating subcategory", {
        description: "Please check the data and try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSubCategoryData((prev) => ({ ...prev, selectedCategoryId: categoryId }));
  };

  const handleRemoveImage = (type: 'main' | 'sub') => {
    setFormData(prev => ({
      ...prev,
      [type === 'main' ? 'logo' : 'subLogo']: undefined
    }));
  };

  return (
    <div className="w-full">
      <header className="w-full items-center gap-4 bg-background/95 mt-4">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="text-black font-bold">Categories</div>
          </div>

          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-black">Add Category</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>New Category</SheetTitle>
                </SheetHeader>

                {/* Toggle to display either the main category form or subcategory form */}
                <div className="mb-4">
                  <Label htmlFor="toggleCategory">Create a Category or Subcategory</Label>
                  <div className="flex gap-4">
                    <div>
                      <input
                        type="radio"
                        id="category"
                        name="formToggle"
                        checked={!isSubCategory}
                        onChange={() => setIsSubCategory(false)}
                      />
                      <Label htmlFor="category">Category</Label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="subcategory"
                        name="formToggle"
                        checked={isSubCategory}
                        onChange={() => setIsSubCategory(true)}
                      />
                      <Label htmlFor="subcategory">Subcategory</Label>
                    </div>
                  </div>
                </div>

                {/* Main Category Form */}
                {!isSubCategory && (
                  <form className="space-y-4 mt-4" onSubmit={handleCategorySubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Main Category Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Category Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Category Description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Main Category Logo</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setFormData(prev => ({ ...prev, logo: res[0].ufsUrl }));
                            toast.success("Main Category logo uploaded");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Upload error: ${error.message}`);
                        }}
                      />
                      {formData.logo && (
                        <div className="mt-2">
                          <img
                            src={formData.logo}
                            alt="Main Category Logo"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            className="mt-2 w-full"
                            onClick={() => handleRemoveImage('main')}
                          >
                            Remove Main Category Logo
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "In Progress..." : "Create Category"}
                    </Button>
                  </form>
                )}

                {/* Subcategory Form */}
                {isSubCategory && (
                  <form className="space-y-4 mt-4" onSubmit={handleSubCategorySubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="category">Select Parent Category *</Label>
                      <Select
                        value={subCategoryData.selectedCategoryId || ""}
                        onValueChange={handleCategorySelect}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a Parent Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subName">Subcategory Name *</Label>
                      <Input
                        id="subName"
                        value={subCategoryData.subName}
                        onChange={(e) => setSubCategoryData({ ...subCategoryData, subName: e.target.value })}
                        placeholder="Subcategory Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subDescription">Subcategory Description</Label>
                      <Input
                        id="subDescription"
                        value={subCategoryData.subDescription}
                        onChange={(e) => setSubCategoryData({ ...subCategoryData, subDescription: e.target.value })}
                        placeholder="Subcategory Description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subcategory Logo</Label>
                      <UploadButton
                        endpoint="imageUploader"
                        className="ut-button:bg-black text-white ut-button:ut-readying:bg-black"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setFormData(prev => ({ ...prev, subLogo: res[0].ufsUrl }));
                            toast.success("Subcategory logo uploaded");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Upload error: ${error.message}`);
                        }}
                      />
                      {formData.subLogo && (
                        <div className="mt-2">
                          <img
                            src={formData.subLogo}
                            alt="Subcategory Logo"
                            className="w-32 h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            className="mt-2 w-full"
                            onClick={() => handleRemoveImage('sub')}
                          >
                            Remove Subcategory Logo
                          </Button>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-black hover:bg-black" disabled={loading}>
                      {loading ? "In Progress..." : "Create Subcategory"}
                    </Button>
                  </form>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  );
}
