import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-t-xl">
      {/* Questions Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-red-600"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <span className="text-gray-900 font-medium">Vous avez encore des questions sur Safrimat IA ?</span>
          </div>
          <Link
            href="/contact"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Contactez notre équipe
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-16">
          {/* Top Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-red-400 mb-4">Gérez votre Entreprise avec Safrimat IA</h2>
              <p className="text-gray-400">
                Safrimat IA offre une solution complète pour les entreprises pour suivre les produits, gérer les
                niveaux de stock sur plusieurs sites, traiter les commandes et gérer les relations fournisseurs.
              </p>
            </div>
            <div className="flex justify-start md:justify-end gap-4">
              <Link
                href="/support"
                className="inline-flex items-center px-6 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Obtenir de l'aide
              </Link>
              <Link
                href="/purchase"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Acheter maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid md:grid-cols-4 gap-12 pt-8 border-t border-gray-800">
            {/* Logo and Social Links */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Safrimat IA Logo"
                  width={200}
                  height={100}
                />
                
              </Link>
              <div className="space-y-4">
                <h3 className="text-white font-medium">Réseaux Sociaux</h3>
                <div className="flex gap-4">
                  {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                    <Link
                      key={social}
                      href={`https://${social}.com`}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <Image
                        src={`/placeholder.svg?height=16&width=16&text=${social}`}
                        alt={social}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-medium mb-6">Liens Rapides</h3>
              <ul className="space-y-4">
                {[
                  { label: "Accueil", href: "/" },
                  { label: "Tarification", href: "/" },
                  { label: "Documentation", href: "/" },
                  { label: "Support", href: "/" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-medium mb-6">Services</h3>
              <ul className="space-y-4">
                {[
                  { label: "Développement personnalisé", href: "/" },
                  { label: "Support de déploiement", href: "/" },
                  { label: "Personnalisation UI", href: "/" },
                ].map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className="text-gray-400 hover:text-white transition-colors">
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-white font-medium mb-6">Informations de Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-red-400" />
                  <span>Tél: +241 77808864</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-red-400" />
                  <span>Email: contact@safrimat-ia.com</span>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>
                    Adresse:
                    <br />
                    Gabon, Libreville, Rue Ange Mba
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Samba Tech Pro |{" "}
              <Link href="/privacy" className="hover:text-white">
                Politique de confidentialité
              </Link>{" "}
              |{" "}
              <Link href="/terms" className="hover:text-white">
                Conditions d'utilisation
              </Link>{" "}
              |{" "}
              <Link href="/accessibility" className="hover:text-white">
                Accessibilité
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

