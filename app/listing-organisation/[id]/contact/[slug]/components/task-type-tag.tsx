import { Badge } from "@/components/ui/badge"
import type { TaskType } from "@/types/task"

interface TaskTypeTagProps {
  type: TaskType
}

export default function TaskTypeTag({ type }: TaskTypeTagProps) {
  switch (type) {
    case "Bug":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
          {type}
        </Badge>
      )
    case "Fonctionnalité":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
          {type}
        </Badge>
      )
    case "Documentation":
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
          {type}
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100">
          {type}
        </Badge>
      )
  }
}

