import React from "react";
import { Trash2, Edit2, GripVertical, Calendar, Tag } from "lucide-react";
import { Badge } from "./ui/Badge";
import { cn } from "../lib/utils";
import { getPriorityBadgeVariant, getPriorityLabel, formatDate } from "../lib/taskUtils";

export const TaskCard = ({
  task,
  isDragging,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(task)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-all hover:border-primary/50 hover:shadow-md",
        task.completed && "bg-muted/30 opacity-75",
        isDragging && "shadow-xl opacity-90 z-50 cursor-grabbing"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            task.completed
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 hover:border-primary"
          )}
        >
          {task.completed && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </button>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <h3 className={cn("text-sm font-semibold leading-tight break-words", task.completed && "line-through text-muted-foreground")}>
            {task.title}
          </h3>
          
          {/* Tags & Priority Row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={getPriorityBadgeVariant(task.priority)} className="h-5 px-1.5 text-[10px] font-normal">
              {getPriorityLabel(task.priority)}
            </Badge>
            
            {task.tag && (
              <div className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Tag size={10} />
                <span>{task.tag}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-Friendly Actions (Always visible or visible on active state) */}
        <div className="flex flex-col gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
           {/* Drag Handle */}
          <div className="cursor-grab text-muted-foreground/30 hover:text-foreground active:cursor-grabbing">
            <GripVertical size={16} />
          </div>
        </div>
      </div>

      {/* Footer Row: Date & Actions */}
      <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-1">
         <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar size={12} />
            <span>{task.dueDate ? formatDate(task.dueDate).split(",")[0] : "لا يوجد تاريخ"}</span>
         </div>
         
         <div className="flex gap-2">
            <button 
                onClick={() => onEdit(task)} 
                className="rounded p-1 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
                <Edit2 size={14} />
            </button>
            <button 
                onClick={() => onDelete(task.id)} 
                className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
                <Trash2 size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};