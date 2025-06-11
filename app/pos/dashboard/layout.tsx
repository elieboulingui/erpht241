import { Search, Calendar, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import SidebarPos from "./_components/sidebar";
import Header from "./_components/creatfacture";

// Format the date to display it as "DD MMMM YYYY, HH:mm"
const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
    return date.toLocaleDateString("fr-FR", options);
};
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content */}
           
            <div className="flex">
                {/* Sidebar */}
                <SidebarPos />
                {children}
            </div>
        </div>
    );
}
