"use client"

import { useState, useEffect } from "react"
import type { Task, TaskStatus, TaskPriority } from "@/types/task"
import TaskFilter from "./task-filter"
import TaskTable from "./task-table"
import TaskPagination from "./task-pagination"
import { initialTasks } from "@/data/tasks"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(initialTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let result = tasks

    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (task) => task.id.toLowerCase().includes(query) || task.title.toLowerCase().includes(query),
      )
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter) {
      result = result.filter((task) => task.priority === priorityFilter)
    }

    setFilteredTasks(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredTasks.length / rowsPerPage)
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  // Handle task status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  // Handle task selection
  const handleSelectTask = (taskId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTasks([...selectedTasks, taskId])
    } else {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId))
    }
  }

  // Handle select all tasks
  const handleSelectAllTasks = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedTasks(paginatedTasks.map((task) => task.id))
    } else {
      setSelectedTasks([])
    }
  }

  // Handle delete tasks
  const handleDeleteTasks = () => {
    setTasks(tasks.filter((task) => !selectedTasks.includes(task.id)))
    setSelectedTasks([])
  }

  // Handle task edit
  const handleEditTask = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)))
  }

  // Handle task favorite toggle
  const handleToggleFavorite = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, favorite: !task.favorite }
        }
        return task
      }),
    )
  }

  return (
    <div className="mt-2">

      <TaskFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {selectedTasks.length > 0 && (
        <div className="flex justify-between items-center mb-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <span className="text-black">{selectedTasks.length} tâche(s) sélectionnée(s)</span>
          <button onClick={handleDeleteTasks} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
            Supprimer
          </button>
        </div>
      )}

      <TaskTable
        tasks={paginatedTasks}
        onStatusChange={handleStatusChange}
        selectedTasks={selectedTasks}
        onSelectTask={handleSelectTask}
        onSelectAll={handleSelectAllTasks}
        onEditTask={handleEditTask}
        onToggleFavorite={handleToggleFavorite}
      />

      <TaskPagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={filteredTasks.length}
      />
    </div>
  )
}

