"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useSession } from "next-auth/react"; // Import useSession hook from next-auth

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: session, status } = useSession(); // Get session data and status
  const router = useRouter(); // Initialize the router

  const navItems = [
    { href: "#", label: "Application" },
    { href: "#", label: "Resources" },
    { href: "#", label: "Prix" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Story" },
  ];

  const connexion = () => {
    router.push("/login"); // Use router.push() for navigation
  };

  const subcribe = () => {
    router.push("/register");
  };

  const handleProfileClick = () => {
    // router.push("/profile"); // Redirect to profile page when clicked
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between ">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <img src="/images/ht241.png" alt="Logo" className="h-14 w-14" />
          </Link>


          {/* Navigation pour desktop */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-sm font-medium hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="mr-2"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Show user image if logged in, otherwise show login and register buttons */}
          {status === "authenticated" ? (
            <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
              <img
                src={session.user?.image || "/default-avatar.png"} // Use session user image or a default image
                alt="User"
                className="h-8 w-8 rounded-full"
              />
            </div>
          ) : (
            <div className="hidden md:flex gap-4">
              <Button onClick={connexion} variant="ghost">
                Connexion
              </Button>
              <Button onClick={subcribe}>S'inscrire</Button>
            </div>
          )}

          {/* Menu hamburger for mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                {navItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block px-2 py-1 text-lg font-medium hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-4 border-t" />

                <div className="">
                  <Button onClick={connexion} className="w-full" variant="ghost">
                    Connexion
                  </Button>
                  <Button onClick={subcribe} className="w-full">S'inscrire</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
