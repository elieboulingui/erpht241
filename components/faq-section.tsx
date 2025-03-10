import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqs = [
    {
      question: "Comment Safrimat IA aide à prévenir les ruptures de stock ?",
      answer: "Safrimat IA utilise un système avancé de surveillance en temps réel et d'alertes automatiques pour prévenir les ruptures de stock. Il suit les niveaux de stock, définit des seuils d'alerte personnalisables, et vous avertit lorsqu'il est temps de réapprovisionner. De plus, nos algorithmes de prévision analysent les tendances historiques pour anticiper les besoins futurs."
    },
    {
      question: "Puis-je gérer l'inventaire sur plusieurs sites ?",
      answer: "Oui, Safrimat IA est conçu pour gérer plusieurs emplacements de manière transparente. Vous pouvez suivre les stocks dans différents entrepôts, magasins ou sites, transférer des produits entre les emplacements, et maintenir des niveaux de stock optimaux partout. Chaque emplacement peut avoir ses propres paramètres et seuils d'alerte."
    },
    {
      question: "Comment fonctionne le système de commandes ?",
      answer: "Notre système de commandes est intuitif et automatisé. Il gère le cycle complet : création de bons de commande, suivi des livraisons, réception des marchandises et mise à jour automatique des niveaux de stock. Vous pouvez définir des commandes récurrentes, suivre l'historique des commandes et gérer les relations fournisseurs dans une interface unique."
    },
    {
      question: "Quels rapports puis-je générer avec Safrimat IA ?",
      answer: "Safrimat IA offre une suite complète d'outils de reporting : analyses des niveaux de stock, rapports de mouvements, prévisions de vente, performance des fournisseurs, et bien plus. Les rapports sont personnalisables et peuvent être programmés pour une génération automatique. Exportez facilement vos données aux formats Excel, PDF ou CSV."
    },
    {
      question: "Safrimat IA convient-il aux petites entreprises ?",
      answer: "Absolument ! Safrimat IA s'adapte à toutes les tailles d'entreprise. Notre forfait Entrepreneur est spécialement conçu pour les petites entreprises, offrant toutes les fonctionnalités essentielles à un prix abordable. Le système évolue avec votre entreprise, vous permettant d'ajouter des fonctionnalités au fur et à mesure de votre croissance."
    },
    {
      question: "Quelle est la sécurité de mes données avec Safrimat IA ?",
      answer: "La sécurité est notre priorité. Nous utilisons le chiffrement de bout en bout, des sauvegardes automatiques quotidiennes, et des serveurs sécurisés conformes aux normes industrielles. Les accès sont strictement contrôlés avec authentification multi-facteurs, et vous pouvez définir des permissions détaillées pour chaque utilisateur."
    },
    {
      question: "Peut-il s'intégrer à ma plateforme e-commerce ?",
      answer: "Oui, Safrimat IA s'intègre facilement avec les principales plateformes e-commerce (Shopify, WooCommerce, Magento, etc.) via des API robustes. La synchronisation en temps réel assure que vos niveaux de stock sont toujours à jour sur tous vos canaux de vente."
    },
    {
      question: "Est-ce difficile de migrer depuis des feuilles de calcul ?",
      answer: "Non, nous avons simplifié le processus de migration. Notre outil d'importation accepte les fichiers Excel et CSV, et notre équipe d'assistance vous guide à chaque étape. Nous fournissons des modèles et une documentation détaillée pour assurer une transition en douceur sans perte de données."
    }
  ]
  
  export default function FAQSection() {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-medium text-emerald-600 mb-2">
              FOIRE AUX QUESTIONS
            </p>
            <h2 className="text-4xl text-black font-bold tracking-tight mb-4">
              Questions Fréquentes sur{" "}
              <span className="text-emerald-600">Safrimat IA</span>
            </h2>
            <p className="text-gray-600">
              Obtenez les réponses aux questions les plus fréquentes sur notre solution de gestion d'inventaire.
            </p>
          </div>
  
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <span className="text-left font-medium text-black">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    )
  }
  