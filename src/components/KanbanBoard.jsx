import React from "react";
import { Circle } from "lucide-react";
import { Badge } from "./ui/Badge";
import { TaskCard } from "./TaskCard";
import { cn } from "../lib/utils";
import { COLUMNS } from "../constants/taskConstants";

export const KanbanBoard = ({
  tasks,
  filterStatus,
  filterPriority,
  sortBy,
  draggedTask,
  getTasksByStatus,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <div className="mx-auto mt-6 flex gap-6 overflow-x-auto pb-4 w-full">
      {COLUMNS.map((column) => {
        const ColumnIcon = column.icon;
        const tasksInColumn = getTasksByStatus(tasks, column.id, filterStatus, filterPriority, sortBy);

        return (
          <div
            key={column.id}
            onDragOver={onDragOver}
            onDrop={() => onDrop(column.id)}
            className="min-w-[300px] w-72 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
          >
            {/* Column Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg bg-gradient-to-br p-2", column.color)}>
                  <ColumnIcon size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{column.title}</h2>
                  <p className="text-xs text-muted-foreground">{tasksInColumn.length} مهام</p>
                </div>
              </div>
              <Badge variant="outline" className="ml-auto">
                {tasksInColumn.length}
              </Badge>
            </div>

            {/* Tasks */}
            <div className="space-y-3 min-h-96">
              {tasksInColumn.length > 0 ? (
                tasksInColumn.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isDragging={draggedTask?.id === task.id}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDragStart={onDragStart}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <Circle size={32} className="mb-2 opacity-20" />
                  <p className="text-sm">لا توجد مهام بعد</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
