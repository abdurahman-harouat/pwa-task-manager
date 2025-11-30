import React from "react";
import { AlertCircle, CheckCircle2, Clock, Flame } from "lucide-react";
import { cn } from "../lib/utils";

export const StatsCards = ({ stats }) => {
  const statsList = [
    { label: "الإجمالي", value: stats.total, icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "المكتملة", value: stats.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "قيد التنفيذ", value: stats.inProgress, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "أولوية عالية", value: stats.high, icon: Flame, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="mb-6 flex w-full gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {statsList.map((stat, idx) => (
        <div 
          key={idx} 
          className="flex min-w-[140px] flex-1 items-center justify-between rounded-xl border border-border/50 bg-card/50 p-3 shadow-sm backdrop-blur-sm"
        >
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
            <span className="text-xl font-bold text-foreground">{stat.value}</span>
          </div>
          <div className={cn("rounded-full p-2", stat.bg)}>
            <stat.icon size={18} className={stat.color} />
          </div>
        </div>
      ))}
    </div>
  );
};