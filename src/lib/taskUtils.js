import { PRIORITY_BADGE_VARIANTS, PRIORITY_LABELS } from "../constants/taskConstants";

export const getPriorityBadgeVariant = (priority) => {
  return PRIORITY_BADGE_VARIANTS[priority] || "default";
};

export const getPriorityLabel = (priority) => {
  return PRIORITY_LABELS[priority] || priority;
};

export const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString("ar-DZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

export const getTaskStats = (tasks) => {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    inProgress: tasks.filter((t) => t.status === "in-progress" && !t.completed).length,
    high: tasks.filter((t) => t.priority === "high").length,
  };
};

export const getCompletionRate = (stats) => {
  return stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
};

export const getTasksByStatus = (tasks, status, filterStatus, filterPriority, sortBy) => {
  let filtered = tasks.filter((task) => task.status === status);

  if (filterStatus !== "all") {
    filtered = filtered.filter((task) => task.status === filterStatus);
  }

  if (filterPriority !== "all") {
    filtered = filtered.filter((task) => task.priority === filterPriority);
  }

  // Sort tasks
  filtered.sort((a, b) => {
    if (sortBy === "created") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return filtered;
};
