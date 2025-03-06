export default function FooterActions() {
  return (
    <>
      <div>
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">Annuler</button>
      </div>
      <div className="flex items-center gap-4">
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">
          prévisualiser et Imprimer
        </button>
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">Rendre récurrent</button>
        <button className="border border-gray-300 bg-white px-6 py-2 rounded-full text-sm">Enregistrer</button>
        <div className="relative">
          <button className="bg-green-600 text-white px-6 py-2 rounded-full text-sm flex items-center">
            Enregistrer et envoyer
            <svg
              className="h-4 w-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

