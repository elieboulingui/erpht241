import { Button } from "@/components/ui/button";
import { FaDiscord } from "react-icons/fa";
import Link from "next/link"; // Importer Link de Next.js

export default function Hero() {
  return (
    <section className="py-16 md:py-24 text-center">
      <div className="flex justify-center mb-8">
        <Button
          variant={"outline"}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm hover:shadow-md transition-all"
        >
          <FaDiscord className="text-[#5865F2] text-xl" />
          <span className="text-gray-700 font-medium">
            Rejoins la communauté
          </span>
          <span className="ml-auto text-gray-500">{">"}</span>
        </Button>
      </div>
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Votre CRM
        <br />
        Assisté Par l'IA
      </h1>
      <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
        Plateforme moderne, puissante et abordable pour <br /> gérer vos
        relations clients
      </p>
      <div className="mt-8 flex flex-col gap-4 min-[400px]:flex-row justify-center">
        <Link href="/listingorg"> {/* Utilisation de Link pour la redirection */}
          <Button size="lg" className="min-[400px]:w-auto">
            Commencer
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="min-[400px]:w-auto">
          Contactez-nous
        </Button>
      </div>
    </section>
  );
}
