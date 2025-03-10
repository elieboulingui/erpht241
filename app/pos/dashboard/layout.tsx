import {
    Search,
    Calendar,
    Bell,
    Plus,
    Home,
    ShoppingCart,
    Package,
    Settings,
    LogOut,

} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import SidebarPos from "./_components/sidebar"


// Layout pos pour l'application
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white border-b">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={200}
                                height={50}
                                className="object-contain"
                            />
                        </div>
                        <div className="ml-8 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input className="pl-10 w-80 bg-gray-100 border-0" placeholder="Rechercher" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2" />
                            <span>10 Mars 2025, 10:17</span>
                        </div>
                        <Bell className="h-5 w-5" />
                        <Button className="bg-red-900 hover:bg-red-800">
                            <Plus className="h-4 w-4 mr-2" />
                            Créer Facture
                        </Button>
                        <div className="ml-4 px-2 py-1 border rounded">
                            <span>FR</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex">
                {/* Sidebar */}
                <SidebarPos/>
                {children}
            </div>
        </div>
    );
}
