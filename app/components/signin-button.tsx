'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image"; // Importing Image for Next.js

export default function SignInButton() {
  const handleSignIn = () => {
    // Trigger Google sign-in and redirect to the dashboard on success
    signIn("google", { callbackUrl: "/listing-organisation" });
  };

  return (
    <Button onClick={handleSignIn} variant="outline" className="h-11">
      {/* Corrected to use Next.js Image component */}
      <Image
        src="/images/google.svg" // Path to your image
        alt="Google Logo"
        width={20} // Adjusted to the size you want
        height={20} // Adjusted to the size you want
        className="mr-2"
      />
      Google
    </Button>
  );
}
