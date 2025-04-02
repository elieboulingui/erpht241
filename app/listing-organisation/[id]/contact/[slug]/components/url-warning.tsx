"use client"

interface UrlWarningProps {
  organisationId: string
  contactSlug: string
  pathname: string
}

export default function UrlWarning({ organisationId, contactSlug, pathname }: UrlWarningProps) {
  if (organisationId && contactSlug) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 animate-fade-in">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Attention: Problème de détection des paramètres dans l'URL
            <br />
            Format attendu: /listing-organisation/[id]/contact/[slug]
            <br />
            URL actuelle: {pathname}
          </p>
        </div>
      </div>
    </div>
  )
}

