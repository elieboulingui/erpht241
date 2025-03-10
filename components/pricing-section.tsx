import { Check, X, Users, ShoppingCart, LinkIcon, MapPin, Shield, Boxes, Store, Barcode } from 'lucide-react'
import { cn } from "@/lib/utils"
import CTASection from './cta-section'

const plans = [
  {
    name: "Entrepreneur",
    price: "120.000",
    billing: "facturé annuellement",
    description: "Commence à",
    button: {
      text: "Commencer",
      variant: "outline" as const,
    },
    features: [
      {
        name: "Membres de l'équipe",
        value: "2 membres",
        icon: Users,
        included: true,
      },
      {
        name: "Commandes client/an",
        value: "1.200/an",
        icon: ShoppingCart,
        included: true,
      },
      {
        name: "Integrations",
        value: "1 integration",
        icon: LinkIcon,
        included: true,
      },
      {
        name: "Emplacements des stocks",
        value: "1",
        icon: MapPin,
        included: true,
      },
      {
        name: "Droits d'accès des utilisateurs",
        value: "Non inclus",
        icon: Shield,
        included: false,
      },
      {
        name: "Accès à l'API inFlow",
        value: "Non inclus",
        icon: Boxes,
        included: false,
      },
      {
        name: "Showroom",
        value: "Non inclus",
        icon: Store,
        included: false,
      },
      {
        name: "Serial numbers",
        value: "Add-on",
        icon: Barcode,
        addon: true,
      },
    ],
  },
  {
    name: "Moyenne entreprise",
    price: "165.900",
    billing: "facturé annuellement",
    description: "Commence à",
    popular: true,
    button: {
      text: "Contacter commercial",
      variant: "default" as const,
    },
    features: [
      {
        name: "Team",
        value: "5 membres",
        icon: Users,
        included: true,
      },
      {
        name: "Commandes client/an",
        value: "12.000/an",
        icon: ShoppingCart,
        included: true,
      },
      {
        name: "Integrations",
        value: "2 integrations",
        icon: LinkIcon,
        included: true,
      },
      {
        name: "Emplacements des stocks",
        value: "Illimité",
        icon: MapPin,
        included: true,
      },
      {
        name: "User access rights",
        value: "Compris",
        icon: Shield,
        included: true,
      },
      {
        name: "Accès à l'API inFlow",
        value: "Add-on",
        icon: Boxes,
        addon: true,
      },
      {
        name: "Showroom",
        value: "Compris",
        icon: Store,
        included: true,
      },
      {
        name: "Serial numbers",
        value: "Add-on",
        icon: Barcode,
        addon: true,
      },
    ],
  },
  {
    name: "Mid-Size",
    price: "299.900",
    billing: "facturé annuellement",
    description: "Commence à",
    button: {
      text: "Commencer",
      variant: "outline" as const,
    },
    features: [
      {
        name: "Team members",
        value: "10 members",
        icon: Users,
        included: true,
      },
      {
        name: "Commandes client/an",
        value: "60,000/an",
        icon: ShoppingCart,
        included: true,
      },
      {
        name: "Integrations",
        value: "3 integrations",
        icon: LinkIcon,
        included: true,
      },
      {
        name: "Emplacements des stocks",
        value: "Illimité",
        icon: MapPin,
        included: true,
      },
      {
        name: "User access rights",
        value: "Advanced",
        icon: Shield,
        included: true,
      },
      {
        name: "Accès à l'API inFlow",
        value: "Add-on",
        icon: Boxes,
        addon: true,
      },
      {
        name: "Showroom",
        value: "Showroom Pro",
        icon: Store,
        included: true,
      },
      {
        name: "Serial numbers",
        value: "Add-on",
        icon: Barcode,
        addon: true,
      },
    ],
  },
]

export default function PricingSection() {
  return (
    <section className="py-24 bg-white" id='pricing'>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-black">
            Choisissez le plan parfait pour votre{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
            Besoins en gestion
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          Faites évoluer votre solution de gestion des stocks à mesure que votre entreprise se développe. Tous les plans incluent des fonctionnalités de suivi des stocks de base.
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {plans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10",
                plan.popular && "relative bg-gray-50 lg:z-10"
              )}
            >
              <div>
                {plan.popular && (
                  <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-red-400 px-3 py-1 text-center text-sm font-semibold text-white">
                    POPULAIRE
                  </div>
                )}
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">{plan.name}</h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{plan.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">FCFA/mo.</span>
                </p>
                <div className="mt-1">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{plan.billing}</span>
                </div>
                <button
                  className={cn(
                    "mt-6 w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    plan.button.variant === "default"
                      ? "bg-red-400 text-white hover:bg-red-500 focus-visible:outline-red-400"
                      : "ring-1 ring-inset text-black ring-gray-200 hover:ring-gray-300 focus-visible:outline-gray-200"
                  )}
                >
                  {plan.button.text}
                </button>
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-900">Inclus:</h4>
                  <ul role="list" className="mt-2 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex gap-x-3">
                        <div className="flex-shrink-0 w-5">
                          {feature.included && <Check className="h-5 w-5 text-green-600" aria-hidden="true" />}
                          {!feature.included && !feature.addon && (
                            <X className="h-5 w-5 text-red-300" aria-hidden="true" />
                          )}
                          {feature.addon && (
                            <div className="h-5 w-5 text-yellow-500">
                              <feature.icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between w-full">
                          <span>{feature.name}</span>
                          <span className={cn(
                            "text-sm",
                            feature.included ? "text-gray-900" : "text-gray-500",
                            feature.addon && "text-yellow-600"
                          )}>
                            {feature.value}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <CTASection/>
      </div>
    </section>
  )
}
