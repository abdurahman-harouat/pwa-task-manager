import React from "react";
import { Filter } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Select } from "./ui/Select";
import { PRIORITY_OPTIONS } from "../constants/taskConstants";

export const TaskFilters = ({
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
  completionRate,
  showProgress,
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Filter size={20} className="text-muted-foreground" />
            <Select
              value={filterPriority}
              onChange={setFilterPriority}
              options={[
                { value: "all", label: "كل الأولويات" },
                ...PRIORITY_OPTIONS,
              ]}
              className="w-48"
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "created", label: "الأحدث أولاً" },
                { value: "priority", label: "حسب الأولوية" },
              ]}
              className="w-48"
            />
          </div>
          {showProgress && (
            <div className="flex items-center gap-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/50" style={{ width: `${completionRate}%` }} />
              <span className="text-sm font-medium text-muted-foreground">{completionRate}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
