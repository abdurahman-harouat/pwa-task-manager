import React from "react";
import { Trash2, Plus, GripVertical, Check, Circle, Edit2 } from "lucide-react";
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
      key={task.id}
      draggable
      onDragStart={() => onDragStart(task)}
      className={cn(
        "group rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30",
        task.completed && "opacity-75",
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-0.5 flex-shrink-0 text-muted-foreground transition-colors hover:text-primary"
        >
          {task.completed ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <Check size={14} className="text-primary-foreground" />
            </div>
          ) : (
            <Circle size={20} className="text-muted-foreground" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium text-foreground",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {task.tag && (
                <Badge variant="outline" className="text-xs">
                  {task.tag}
                </Badge>
              )}
              <Badge variant={getPriorityBadgeVariant(task.priority)} className="text-xs">
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">{formatDate(task.createdAt).split(",")[0]}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <GripVertical size={16} className="text-muted-foreground/50" />
          <button
            onClick={() => onEdit(task)}
            className="text-primary/70 transition-colors hover:text-primary"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-destructive/70 transition-colors hover:text-destructive"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
