import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

export const TaskHeader = ({ isOnline }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-lg">
              <CheckCircle2 className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">إدارة المهام</h1>
              <p className="text-xs text-muted-foreground">تنظيم مهامك بكفاءة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium",
                isOnline
                  ? "border-green-200 bg-green-500/10 text-green-600 dark:border-green-800 dark:text-green-400"
                  : "border-destructive/20 bg-destructive/10 text-destructive"
              )}
            >
              <span className="mr-1">●</span>
              {isOnline ? "متصل" : "غير متصل"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
