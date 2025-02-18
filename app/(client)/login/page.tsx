import Image from "next/image"
import Link from "next/link"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SignIn } from "@/app/components/signin-button"

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex justify-center">
          <Image
            src="/path/to/logo.png"  // Correct the path to your logo image
            alt="H241 HIGH TECH Logo"
            width={120}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <h1 className="text-2xl font-semibold">Connectez à votre compte</h1>
            <p className="text-sm text-muted-foreground">Bienvenue ! Veuillez vous connecter pour continuer.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input id="email" type="email" placeholder="Entrez votre email" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="password">
                  Mot de passe
                </label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input id="password" type="password" className="h-11 pr-10" placeholder="Entrez votre mot de passe" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 text-gray-400"
                  type="button"
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button className="w-full h-11 text-base font-medium bg-black hover:bg-black/90">Connexion</Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-muted-foreground">Ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Use SignIn separately without nesting inside a Button */}
              <SignIn />  {/* Make sure SignIn is not a button */}
              <Button variant="outline" className="h-11">
                <Image src="/microsoft.svg" alt="Microsoft" width={20} height={20} className="mr-2" />
                Microsoft
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Vous n&apos;avez pas de compte ? </span>
              <Link href="/signup" className="text-primary hover:underline">
                Créer un
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
