import { DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-blue-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Besoin d'une solution entreprise personnalisée ?
              </h3>
              <p className="text-gray-600 mt-1">
                Contactez notre équipe commerciale pour une solution de gestion d'inventaire adaptée à vos besoins spécifiques.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex-shrink-0"
          >
            Contactez-nous
          </Link>
        </div>
      </div>
    </section>
  )
}
