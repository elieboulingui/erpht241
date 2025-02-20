import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InviteTeam() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <Link
          href="#"
          className="mb-8 inline-flex items-center text-sm font-medium text-foreground hover:text-muted-foreground"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/images/ht241.png"
            alt="HIGH TECH Logo"
            width={100}
            height={60}
            className="h-auto w-auto"
          />
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="text-center text-sm text-muted-foreground">Step 1 sur 2</div>
          <div className="mt-2 h-1 w-full rounded-full bg-muted">
            <div className="h-full w-1/2 rounded-full bg-primary"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Inviter l&apos;equipe</h1>
            <p className="mt-2 text-muted-foreground">
              Ajoutez des membres à votre équipe pour commencer. Vous pourrez toujours inviter d&apos;autres personnes
              plus tard.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Adresse email</label>
              <button className="text-sm text-primary hover:text-primary/90">+ Ajouter un membre</button>
            </div>

            {/* Member inputs */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex gap-3">
                <Input type="email" placeholder="exemple@mail.com" className="flex-1" />
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Membre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Membre</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Propriétaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg">
            Terminer
          </Button>
        </div>
      </div>
    </div>
  )
}


