import { Circle, Clock, CheckCircle2 } from "lucide-react";

export const STATUS_OPTIONS = [
  { value: "todo", label: "قائمة المهام" },
  { value: "in-progress", label: "قيد التنفيذ" },
  { value: "done", label: "مكتمل" },
];

export const PRIORITY_OPTIONS = [
  { value: "low", label: "منخفضة" },
  { value: "medium", label: "متوسطة" },
  { value: "high", label: "عالية" },
];

export const COLUMNS = [
  { id: "todo", title: "قائمة المهام", color: "from-blue-500 to-blue-600", icon: Circle },
  { id: "in-progress", title: "قيد التنفيذ", color: "from-amber-500 to-amber-600", icon: Clock },
  { id: "done", title: "مكتمل", color: "from-green-500 to-green-600", icon: CheckCircle2 },
];

export const PRIORITY_BADGE_VARIANTS = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

export const PRIORITY_LABELS = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};
