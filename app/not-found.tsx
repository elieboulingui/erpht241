"use client";  // This makes the file a client-side component

import React from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";

const home = () => {
  // Handle the button click here (e.g., navigate to the homepage)
  window.location.href = '/login'; // Redirect to the homepage
};

const Page404 = () => (
  <div className="nc-Page404">
    <div className="container relative pt-12 pb-16 lg:pb-20 lg:pt-5 flex justify-center items-center h-screen">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex justify-center">
          <Image src="/images/ht241.png" height={100} width={100} alt="not-found" className="w-44 h-44 mb-4" />  
        </div>
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          {`LA PAGE QUE VOUS CHERCHEZ N EXISTE PAS.`}{" "}
        </span>
        <div className="pt-8">
          <Button onClick={home}>RETOUR A LA PAGE D ACCUEIL</Button>
        </div>
      </header>
    </div>
  </div>
);

export default Page404;
