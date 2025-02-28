import { Card, CardContent } from "@/components/ui/card"

export default function LeadGeneration() {
  return (
    <div className="px-36 bg-white mt-5">
     
      <Card>

      <div className="flex justify-between items-center px-6">
        <div>
          <h1 className="text-xl font-semibold">Lead generation</h1>
          <p className="text-sm text-muted-foreground">nouveau contact ajouter dans la base de donnée</p>
        </div>
        <div className="flex">
          <div className="px-6 py-4 bg-gray-50">
            <p className="text-sm text-muted-foreground">personnes</p>
            <p className="text-2xl font-semibold">3</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-muted-foreground">Companies</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
        </div>
      </div>
        <CardContent className="border-t border-gray-200">
          <div className="h-[200px] grid grid-cols-3">
            {[21, 22, 29].map((day) => (
              <div key={day} className="relative h-full mt-2 flex items-center justify-center">
                <div className="bottom-0 w-[60%] h-[75%] bg-[#E76F51] rounded" />
                <div className="absolute bottom-[0px] w-full text-center text-sm">
                  Jan {day}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}