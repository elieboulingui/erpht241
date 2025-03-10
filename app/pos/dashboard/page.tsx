"use client"

import { useState } from "react"
import {

    Plus,
    Printer,

    ChevronLeft,
    ChevronRight,
    Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Données des produits
const categories = [
    { id: 1, name: "Ordinateurs", icon: "💻" },
    { id: 2, name: "Casques", icon: "🎧" },
    { id: 3, name: "Imprimantes", icon: "🖨️" },
    { id: 4, name: "Téléphones", icon: "📱" },
    { id: 5, name: "Accessoires", icon: "🔌" },
]

const products = [
    {
        id: 1,
        name: "HP Pavilion",
        category: 1,
        price: 450000,
        image: "/placeholder.svg?height=200&width=200",
        description: "Ordinateur portable avec processeur i5",
        weight: "1.8kg",
        brand: "HP",
        selected: false,
    },
    {
        id: 2,
        name: "MacBook Air",
        category: 1,
        price: 750000,
        image: "/placeholder.svg?height=200&width=200",
        description: "Ordinateur portable avec puce M2",
        weight: "1.2kg",
        brand: "Apple",
        selected: false,
    },
    {
        id: 3,
        name: "Sony WH-1000XM4",
        category: 2,
        price: 220000,
        image: "/placeholder.svg?height=200&width=200",
        description: "Casque à réduction de bruit",
        weight: "250g",
        brand: "Sony",
        selected: true,
    },
    {
        id: 4,
        name: "Canon PIXMA",
        category: 3,
        price: 85000,
        image: "/placeholder.svg?height=200&width=200",
        description: "Imprimante multifonction couleur",
        weight: "5.4kg",
        brand: "Canon",
        selected: true,
    },
    {
        id: 5,
        name: "Bose QuietComfort",
        category: 2,
        price: 195000,
        image: "/placeholder.svg?height=200&width=200",
        description: "Casque sans fil à réduction de bruit",
        weight: "240g",
        brand: "Bose",
        selected: false,
    },
    {
        id: 6,
        name: "Dell XPS 13",
        category: 1,
        price: 890000,
        image: "/placeholder.svg?height=200&width=200",
        description: "Ordinateur portable premium",
        weight: "1.3kg",
        brand: "Dell",
        selected: false,
    },
]

const brands = ["Toutes", "HP", "Apple", "Sony", "Canon", "Bose", "Dell"]

export default function Dashboard() {

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
    const [selectedBrand, setSelectedBrand] = useState("Toutes")
    const [cart, setCart] = useState([
        { id: 3, name: "Sony WH-1000XM4", price: 220000, quantity: 1 },
        { id: 4, name: "Canon PIXMA", price: 85000, quantity: 2 },
    ])
    const [localProducts, setLocalProducts] = useState(products)

    // Filtrer les produits par catégorie et marque
    const filteredProducts = localProducts.filter(
        (product) =>
            (selectedCategory === null || product.category === selectedCategory) &&
            (selectedBrand === "Toutes" || product.brand === selectedBrand),
    )

    // Ajouter au panier
    const addToCart = (product: { id: any; name: any; category?: number; price: any; image?: string; description?: string; weight?: string; brand?: string; selected?: boolean }) => {
        const existingItem = cart.find((item) => item.id === product.id)
        if (existingItem) {
            setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
        } else {
            setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }])
        }

        // Mettre à jour le statut sélectionné
        setLocalProducts(localProducts.map((p) => (p.id === product.id ? { ...p, selected: true } : p)))
    }

    // Modifier la quantité
    const updateQuantity = (id: number, change: number) => {
        setCart(
            cart.map((item) => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + change)
                    return { ...item, quantity: newQuantity }
                }
                return item
            }),
        )
    }

    // Calculer le total
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = 5000
    const total = subtotal - discount

    // Formater le prix en FCFA
    const formatPrice = (price: any) => {
        return new Intl.NumberFormat("fr-FR").format(price) + " FCFA"
    }

    return (


                <div className="flex-1 p-6">
                    <div className="flex gap-6">
                        {/* Products Section */}
                        <div className="flex-1 bg-white rounded-lg shadow p-6">
                            {/* Categories */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Catégorie de Produits</h2>
                                    <div className="flex">
                                        <Button variant="outline" size="icon" className="mr-2">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-4">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                                            className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-colors ${selectedCategory === category.id ? "border-orange-500 bg-orange-50" : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">{category.icon}</div>
                                            <div className="text-sm">{category.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Products */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold">Choisir Produit(s)</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Marque:</span>
                                        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Toutes les marques" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand} value={brand}>
                                                        {brand}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    {filteredProducts.map((product) => (
                                        <div key={product.id} className="border rounded-md relative">
                                            {product.selected && (
                                                <div className="absolute top-0 left-0 bg-orange-500 text-white px-3 py-1 rounded-br-md">
                                                    Sélectionné
                                                </div>
                                            )}
                                            <div className="p-4 flex justify-center">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="h-40 object-contain"
                                                />
                                            </div>
                                            <div className="p-4 border-t">
                                                <h3 className="font-semibold">{product.name}</h3>
                                                <p className="text-sm text-gray-600">{product.description}</p>
                                                <p className="text-sm text-gray-600">Marque: {product.brand}</p>
                                                <p className="text-sm text-gray-600">Poids: {product.weight}</p>
                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="font-bold">{formatPrice(product.price)}</div>
                                                    <div className="flex items-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="px-2"
                                                            onClick={() => {
                                                                const item = cart.find((i) => i.id === product.id)
                                                                if (item && item.quantity > 1) {
                                                                    updateQuantity(product.id, -1)
                                                                }
                                                            }}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="mx-2">{cart.find((item) => item.id === product.id)?.quantity || 0}</span>
                                                        <Button variant="outline" size="sm" className="px-2" onClick={() => addToCart(product)}>
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cart Section */}
                        <div className="w-96 bg-white rounded-lg shadow">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Facture #24617</h2>
                                <div className="flex items-center">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                {cart.map((item) => {
                                    const product = products.find((p) => p.id === item.id)
                                    return (
                                        <div key={item.id} className="flex items-center mb-6">
                                            <img
                                                src={product?.image || "/placeholder.svg?height=60&width=60"}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain mr-4"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold">{item.name}</h3>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold">{formatPrice(item.price)}</div>
                                                <div className="flex items-center justify-end mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                <div className="mt-8 pt-4 border-t border-dashed">
                                    <div className="flex justify-between mb-2">
                                        <span>Sous-total</span>
                                        <span className="font-bold">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2 text-green-600">
                                        <span>Remise membre</span>
                                        <span>- {formatPrice(discount)}</span>
                                    </div>
                                    <div className="flex justify-between mt-4 pt-4 border-t text-lg font-bold">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="font-semibold mb-4">Méthode de Paiement</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                                            <div className="bg-orange-100 rounded-full p-2 mb-2">
                                                <span className="text-xl">💵</span>
                                            </div>
                                            <span className="text-sm">Espèces</span>
                                        </div>
                                        <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                                            <div className="bg-orange-100 rounded-full p-2 mb-2">
                                                <span className="text-xl">💳</span>
                                            </div>
                                            <span className="text-sm">Carte</span>
                                        </div>
                                        <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer hover:bg-gray-50">
                                            <div className="bg-orange-100 rounded-full p-2 mb-2">
                                                <span className="text-xl">📱</span>
                                            </div>
                                            <span className="text-sm">Mobile</span>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full mt-8 bg-orange-500 hover:bg-orange-600">Procéder au paiement</Button>
                            </div>
                        </div>
                    </div>
                </div>
         
    )
}

