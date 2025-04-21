'use client';

import { useRouter } from 'next/navigation';

export default function ErrorPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search);
  const error = searchParams.get("error");

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Erreur</h1>
      <p className="text-lg text-red-500">{error || "Une erreur est survenue."}</p>
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
