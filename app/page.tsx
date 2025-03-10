"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Database, BarChart3 } from "lucide-react"
import PricingSection from "@/components/pricing-section"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"
import FAQSection from "@/components/faq-section"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-white border-b backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={50}
                className="object-contain"
              />
            </div>

            <nav className="hidden md:flex items-center gap-6 ml-10">
              <Link href="/" className="text-sm font-medium text-black">
                Accueil
              </Link>
              <div className="relative group">
                <button className="text-sm text-black font-medium flex items-center gap-1">
                  Fonctionnalités
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* Mega Menu */}
                <div className="absolute left-0 top-full pt-2 w-[1000px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white rounded-lg shadow-xl border overflow-hidden">

                    <div className="grid grid-cols-3 gap-6 p-6">
                      {/* Feature 1 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Gestion du catalogue de produits</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Créez et gérez des produits avec des attributs et des catégories personnalisés
                          </p>
                        </div>
                      </div>

                      {/* Feature 2 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 3v18h18" />
                            <path d="m19 9-5 5-4-4-3 3" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Suivi des stocks en temps réel</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Surveillez les niveaux de stock sur plusieurs sites avec des alertes
                          </p>
                        </div>
                      </div>

                      {/* Feature 3 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
                            <path d="M2 8h2" />
                            <path d="M2 12h2" />
                            <path d="M2 16h2" />
                            <path d="M12 10h2" />
                            <path d="M12 14h2" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Prise en charge multi-sites</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Gérez de manière transparente les stocks dans différents entrepôts
                          </p>
                        </div>
                      </div>

                      {/* Feature 4 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Outils d'ajustement des stocks</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Enregistrez et suivez les changements d'inventaire avec IA
                          </p>
                        </div>
                      </div>

                      {/* Feature 5 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Gestion des commandes clients</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Traitez efficacement les commandes des clients/fournisseurs avec le suivi de leur statut
                          </p>
                        </div>
                      </div>

                      {/* Feature 6 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Gestion de la relation client</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Maintenir des profils clients complets avec historique
                          </p>
                        </div>
                      </div>

                      {/* Feature 7 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                            <path d="M16.5 9.4 7.55 4.24" />
                            <polyline points="3.29 7 12 12 20.71 7" />
                            <line x1="12" y1="22" x2="12" y2="12" />
                            <circle cx="18.5" cy="15.5" r="2.5" />
                            <path d="M20.27 17.27 22 19" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Point Of Sale (POS)</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Un système de point de vente de vos commerciaux
                          </p>
                        </div>
                      </div>

                      {/* Feature 8 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 2h-4a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8Z" />
                            <path d="M2 6h4a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H2Z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Gestion des fournisseurs</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Gérer les relations avec les fournisseurs, lier les produits aux fournisseurs
                          </p>
                        </div>
                      </div>

                      {/* Feature 9 */}
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <line x1="10" y1="9" x2="8" y2="9" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Rapports complets</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Générez des rapports détaillés sur les niveaux de stock, les ventes et plus encore
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-black">Commencer</h4>
                        <p className="text-sm text-gray-500">Je suis vraiment enthousiasmé par toutes ces fonctionnalités prêtes à l'emploi</p>
                      </div>
                      <Link
                        href="/signup"
                        className="bg-black hover:bg-gray-900 text-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Commencer maintenant
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link href="#pricing" className="text-sm font-medium text-black">
                Prix
              </Link>
            </nav>

          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-black">
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Inscription
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-br from-red-900 to-red-950 text-white">
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          {/* Decorative elements */}
          <div className="absolute left-10 top-40 opacity-20">
            <Database className="w-16 h-16 text-red-300" />
          </div>
          <div className="absolute right-20 top-60 opacity-20">
            <BarChart3 className="w-16 h-16 text-red-300" />
          </div>

          {/* Notification banner */}
          <div className="flex justify-center mb-8">
            <div className="bg-red-950/50 backdrop-blur-sm px-4 py-2 rounded-full inline-flex items-center">
              <span className="text-yellow-400 mr-2">✨</span>
              <span className="text-sm">Le suivi des stocks multi-sites basé sur intelligence artificielle</span>
            </div>
          </div>

          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-red-200">
              Simplifiez la gestion de vos stocks et ventes avec Safrimat IA
            </h1>

            <p className="text-lg mb-10 text-red-100/90">
              Safrimat IA offre aux entreprises une solution complète pour suivre les produits, gérer les niveaux de stock sur plusieurs sites, traiter les commandes des clients et gérer les relations avec les fournisseurs. Améliorez l'efficacité, réduisez les ruptures de stock et obtenez des informations précieuses grâce à notre système de gestion des stocks puissant mais facile à utiliser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/register"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Commencer l'essai gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-medium transition-colors"
              >
                Voir la demo
              </Link>
            </div>

            {/* Testimonials */}
            <div className="flex flex-col items-center">
              <div className="flex -space-x-2 mb-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-red-900 overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=40&width=40&text=${i}`}
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FFC107"
                    stroke="#FFC107"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-red-200">12 Entreprises nous font confiance.</p>
            </div>
          </div>
        </div>
        <FeaturesSection/>
        <PricingSection/>
        <FAQSection/>
        <Footer/>
      </main>
    </div>
  )
}

