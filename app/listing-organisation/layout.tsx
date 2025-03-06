'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Pass ownerId as a prop to children
export default function OrganisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession(); // Use session hook to get session info
  const router = useRouter();

  useEffect(() => {
    // Check if the session is still loading or user is unauthorized
    if (status === "loading") return; // Wait for the session to load

    if (!session || session.user.role !== "ADMIN") {
      router.push("/dashboard"); // Redirect if user is not an admin
    }
  }, [session, status, router]); // Dependency array ensures the effect is run when session or status changes

  // Check if session is not available or user is not authorized, render nothing to avoid layout flicker
  if (status === "loading" || !session || session.user.role !== "ADMIN") {
    return null; // Can show a loader or a placeholder here
  }

  const ownerId = session.user.id; // Get the ownerId from session

  // Render the children, passing the ownerId as a prop if needed
  return <>{children}</>;
}
