"use client"
import Image from "next/image" // Correct import
import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/server-actions"

export function SignIn() {
  // Handle sign-in click
  const handleSignIn = async () => {
    await signInWithGoogle() // Call the server-side sign-in function
  }

  return (
    <Button
      variant="outline"
      className="h-11"
      onClick={handleSignIn} // Trigger sign-in on button click
    >
      <Image src="/microsoft.svg" alt="Microsoft" width={20} height={20} className="mr-2" />
      Microsoft
    </Button>
  )
}

export default SignIn
