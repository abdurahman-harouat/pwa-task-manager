import React from "react";
import { AlertCircle, Check, Zap, ArrowUp } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { cn } from "../lib/utils";

export const StatsCards = ({ stats }) => {
  const statsList = [
    { label: "الإجمالي", value: stats.total, icon: AlertCircle, color: "from-blue-500 to-blue-600" },
    { label: "المكتملة", value: stats.completed, icon: Check, color: "from-green-500 to-green-600" },
    { label: "قيد التنفيذ", value: stats.inProgress, icon: Zap, color: "from-amber-500 to-amber-600" },
    { label: "الأولوية العالية", value: stats.high, icon: ArrowUp, color: "from-red-500 to-red-600" },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 flex-1">
      {statsList.map((stat, idx) => (
        <Card key={idx} className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={cn("rounded-lg bg-gradient-to-br p-2.5", stat.color)}>
                <stat.icon size={20} className="text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
