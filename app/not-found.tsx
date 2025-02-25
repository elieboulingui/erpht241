"use client";  // This makes the file a client-side component

import React from "react";
import I404Png from "@/public/images/ht241.jpg";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const home = () => {
  // Handle the button click here (e.g., navigate to the homepage)
  window.location.href = '/'; // Redirect to the homepage
};

const Page404 = () => (
  <div className="nc-Page404">
    <div className="container relative pt-12 pb-16 lg:pb-20 lg:pt-5 flex justify-center items-center min-h-screen">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <div className="flex justify-center">
          <Image src={I404Png} alt="not-found" />
        </div>
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          {`THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.`}{" "}
        </span>
        <div className="pt-8">
          <Button onClick={home}>Return Home Page</Button>
        </div>
      </header>
    </div>
  </div>
);

export default Page404;
