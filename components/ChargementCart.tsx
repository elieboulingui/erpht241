// components/ui/Loader.tsx

import { Loader2 } from "lucide-react"

export function Loader() {
  return (
    <div className="flex items-center justify-center w-full py-6 bg-transparent">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  )
}
