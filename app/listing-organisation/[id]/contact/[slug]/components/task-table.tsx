"use client";

import { useState, useRef } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Filter,
  SlidersHorizontal,

} from "lucide-react";
import PaginationGlobal from "@/components/paginationGlobal";
import TaskRow from "./task-row";

interface TaskTableProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  selectedTasks: string[];
  onSelectTask: (taskId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onToggleFavorite: (taskId: string) => void;
}

type SortField = "id" | "title" | "status" | "priority";
type SortDirection = "asc" | "desc";

export default function TaskTable({
  tasks,
  onStatusChange,
  selectedTasks,
  onSelectTask,
  onSelectAll,
  onEditTask,
  onToggleFavorite,
}: TaskTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 ml-1"
        onClick={(e) => {
          e.stopPropagation();
          toggleSort(field);
        }}
      >
        <Filter className="h-3 w-3 text-gray-500" />
      </Button>
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Filter and sort tasks
  let filteredTasks = tasks.filter((task) => {
    let matches = true;

    // Search term filter
    if (searchTerm) {
      matches =
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    }

    // Status filter
    if (statusFilter.length > 0 && !statusFilter.includes(task.status)) {
      matches = false;
    }

    // Priority filter
    if (priorityFilter.length > 0 && !priorityFilter.includes(task.priority)) {
      matches = false;
    }

    return matches;
  });

  // Sort tasks if needed
  if (sortField) {
    filteredTasks.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination logic
  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  const addFilter = (type: string, value: string) => {
    if (!activeFilters.includes(`${type}:${value}`)) {
      setActiveFilters([...activeFilters, `${type}:${value}`]);
    }
    setCurrentPage(1);
  };

  return (
    <div className="relative ">
      <Tabs defaultValue="tasks">
        <TabsContent value="tasks" className="p-0">
        
          {/* Task Table */}
          <div className="border border-gray-200 rounded-sm overflow-hidden">
            <Table className="">
              <TableHeader className="bg-[#e6e7eb]">
                <TableRow className="border-b border-gray-300 ">
                  <TableHead className=" text-gray-900 font-medium">
                    <Checkbox
                      checked={
                        paginatedTasks.length > 0 &&
                        paginatedTasks.every((task) =>
                          selectedTasks.includes(task.id)
                        )
                      }
                      onCheckedChange={(checked) => onSelectAll(!!checked)}
                      className="border-gray-400"
                    />
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      ID Tâche
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      Titre
                      {getSortIcon("title")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      Statut
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center">
                      Priorité
                      {getSortIcon("priority")}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-900 font-medium">
                    <div className="flex items-center justify-center">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTasks.length > 0 ? (
                  paginatedTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      isSelected={selectedTasks.includes(task.id)}
                      onSelect={(isSelected) =>
                        onSelectTask(task.id, isSelected)
                      }
                      onStatusChange={onStatusChange}
                      onEditTask={onEditTask}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-gray-500"
                    >
                      Aucune tâche ne correspond à vos critères de recherche
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination Component */}
      <PaginationGlobal
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
