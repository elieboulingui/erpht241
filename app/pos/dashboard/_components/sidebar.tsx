"use client";

import { Home, LogOut, Package, Settings, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarPos = () => {
  const pathname = usePathname();

  const links = [
    { href: "/pos/dashboard/stats", icon: Home, label : "Dashboard" },
    { href: "/pos/dashboard", icon: ShoppingCart, label: "PDV" },
    { href: "/pos/dashboard/orders", icon: Package , label: "Ventes"},
  ];

  return (
    <div className="w-24 bg-red-900 min-h-[calc(100vh-64px)] flex flex-col items-center text-white">
      {links.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={`p-6 relative ${
            pathname === href ? "bg-red-800" : ""
          } transition-colors duration-200`}
        >
          <Icon className="h-6 w-6" />
          {label && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
              {label}
            </div>
          )}
        </Link>
      ))}

      <div className="p-6">
        <Settings className="h-6 w-6" />
      </div>

      <div className="mt-auto p-6">
        <LogOut className="h-6 w-6" />
      </div>
    </div>
  );
};

export default SidebarPos;
