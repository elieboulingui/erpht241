import React from 'react';


export default function Chargement() {
   

    return (
        <div className="flex items-center justify-center bg-white py-20">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-2 text-sm text-gray-500">Chargement des informations...</p>
        </div>
      </div>
      )
}