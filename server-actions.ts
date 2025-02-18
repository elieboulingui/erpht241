// app/server-actions.tsx (Composant Serveur)
import { signIn } from "@/auth"

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

export default function ServerActions() {
  return null; // Ce composant sert uniquement à gérer les actions serveur
}
