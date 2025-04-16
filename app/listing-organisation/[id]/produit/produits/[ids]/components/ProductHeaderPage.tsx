"use client";

import { useState, useEffect } from "react";
import { Building2, Star, Ellipsis, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ProductDetails {
    name: string;
    category: string;
    description?: string;
    images?: string[];
    stock?: number;
}

export default function ProductHeader() {
    const [productId, setProductId] = useState<string | null>(null);
    const [organisationId, setOrganisationId] = useState<string | null>(null);
    const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = window.location.href;
        const productRegex = /\/produit\/produits\/([a-zA-Z0-9]+)/;
        const orgRegex = /\/listing-organisation\/([a-zA-Z0-9]+)/;
        
        const productMatch = url.match(productRegex);
        const orgMatch = url.match(orgRegex);

        if (productMatch) setProductId(productMatch[1]);
        if (orgMatch) setOrganisationId(orgMatch[1]);
    }, []);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            setError(null);

            fetch(`/api/productdetails/?id=${productId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération des détails du produit");
                    }
                    return response.json();
                })
                .then((data) => {
                    setProductDetails(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message || "Erreur lors de la récupération des détails du produit");
                    setLoading(false);
                });
        }
    }, [productId]);


    return (
        <header className="w-full items-center gap-4 bg-background/95 py-4">
            <div className="flex items-center justify-between px-5">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink 
                                    className="text-black font-bold" 
                                    href={`/listing-organisation/${organisationId}/produit`}
                                >
                                    Produits
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbItem className="font-bold text-black">
                                {productDetails?.name || "Nom non disponible"}
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Star fill="black" className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Ellipsis className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Separator className="mt-2" />
        </header>
    );
}