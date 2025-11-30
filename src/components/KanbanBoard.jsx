import React from "react";
import { Circle, Plus } from "lucide-react";
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
  onAddClick // New prop to trigger add dialog from column
}) => {
  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-2 w-full px-4 scrollbar-hide">
      {COLUMNS.map((column) => {
        const ColumnIcon = column.icon;
        const tasksInColumn = getTasksByStatus(tasks, column.id, filterStatus, filterPriority, sortBy);

        return (
          <div
            key={column.id}
            onDragOver={onDragOver}
            onDrop={() => onDrop(column.id)}
            // Changed: Fixed width but flexible height, removed heavy borders/bg
            className="flex h-full min-w-[280px] w-80 flex-col rounded-xl bg-muted/20" 
          >
            {/* Column Header - More compact */}
            <div className="flex items-center justify-between p-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className={cn("rounded-md p-1.5", column.color, "bg-opacity-20 text-foreground")}>
                  {/* Assuming column.color sends a text color, if it sends bg, adjust accordingly */}
                  <ColumnIcon size={16} />
                </div>
                <h2 className="font-semibold text-sm text-foreground">{column.title}</h2>
                <Badge variant="secondary" className="px-1.5 h-5 text-[10px]">
                  {tasksInColumn.length}
                </Badge>
              </div>
            </div>

            {/* Scrollable Task Area - Independent scrolling per column */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
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
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/50">
                   <div className="border-2 border-dashed border-muted-foreground/20 rounded-full p-3 mb-2">
                      <ColumnIcon size={20} />
                   </div>
                  <p className="text-xs">لا توجد مهام</p>
                </div>
              )}
            </div>
            
            {/* Quick Add Button at bottom of column (Optional but useful) */}
            <button 
                onClick={() => onAddClick(column.id)}
                className="m-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-border p-2 text-xs text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
            >
                <Plus size={14} />
                <span>إضافة مهمة سريعة</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};