"use client";

import { BreadcrumbHeader } from "@/components/BreadcrumbHeader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function LogsHeader({ onSearch }: { onSearch: (query: string) => void }) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div className="flex justify-between">
            <BreadcrumbHeader
                title="Logs"
            />
            <div className="px-3 mt-4 relative items-center">
                <div className="absolute inset-y-0 left-0 pl-5 mb-1 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500" />
                </div>
                <Input
                    placeholder="Rechercher un log..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
}