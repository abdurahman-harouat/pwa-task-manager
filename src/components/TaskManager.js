import React, { useState, useEffect, useReducer } from "react";
import { taskReducer } from "../store/taskReducer";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../constants/taskConstants";
import { getTaskStats, getCompletionRate, getTasksByStatus } from "../lib/taskUtils";
import { TaskHeader } from "./TaskHeader";
import { StatsCards } from "./StatsCards";
import { TaskFilters } from "./TaskFilters";
import { KanbanBoard } from "./KanbanBoard";
import {
  AddTaskButton,
  AddTaskDialog,
  EditTaskDialog,
  DeleteConfirmDialog,
  EmptyState,
} from "./TaskDialogs";

const TaskManager = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  
  // Add Task State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addStatus, setAddStatus] = useState("todo");
  const [addPriority, setAddPriority] = useState("medium");
  const [addDate, setAddDate] = useState("");
  
  // Tags State
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  
  // Edit Task State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("todo");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDate, setEditDate] = useState("");
  const [editTag, setEditTag] = useState("");
  
  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Filter & Sort State
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  
  // Drag & Drop State
  const [draggedTask, setDraggedTask] = useState(null);
  
  // Online Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load tasks from storage
  useEffect(() => {
    const stored = localStorage.getItem("pwa_tasks");
    if (stored) {
      try {
        dispatch({ type: "LOAD_TASKS", payload: JSON.parse(stored) });
      } catch (e) {
        console.error("Failed to load tasks:", e);
      }
    }
  }, []);

  // Load tags from storage
  useEffect(() => {
    const stored = localStorage.getItem("pwa_tags");
    if (stored) {
      try {
        setTags(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load tags:", e);
      }
    }
  }, []);

  // Save tasks to storage
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("pwa_tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Save tags to storage
  useEffect(() => {
    if (tags.length > 0) {
      localStorage.setItem("pwa_tags", JSON.stringify(tags));
    }
  }, [tags]);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Add Task
  const addTask = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!addTitle.trim()) return;

    const tagValue = isCreatingTag && newTagName.trim() ? newTagName.trim() : selectedTag;

    const task = {
      id: Date.now() + Math.random(),
      title: addTitle,
      description: addDescription,
      status: addStatus,
      priority: addPriority,
      tag: tagValue || null,
      dueDate: addDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    dispatch({ type: "ADD_TASK", payload: task });

    if (isCreatingTag && newTagName.trim()) {
      const t = newTagName.trim();
      const next = Array.from(new Set([t, ...tags]));
      setTags(next);
      localStorage.setItem("pwa_tags", JSON.stringify(next));
    }

    setAddTitle("");
    setAddDescription("");
    setAddStatus("todo");
    setAddPriority("medium");
    setAddDate("");
    setSelectedTag("");
    setIsCreatingTag(false);
    setNewTagName("");
    setIsAddDialogOpen(false);
  };

  // Create Tag
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const t = newTagName.trim();
    const next = Array.from(new Set([t, ...tags]));
    setTags(next);
    localStorage.setItem("pwa_tags", JSON.stringify(next));
    setIsCreatingTag(false);
    setSelectedTag(t);
    setNewTagName("");
  };

  // Toggle Task
  const toggleTask = (id) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
  };

  // Edit Task
  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditDate(task.dueDate || "");
    setEditTag(task.tag || "");
    setIsEditDialogOpen(true);
  };

  const saveEdit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editTitle.trim() || !editingTask) return;

    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: editingTask.id,
        updates: {
          title: editTitle,
          description: editDescription,
          status: editStatus,
          priority: editPriority,
          dueDate: editDate || null,
          tag: editTag || null,
        },
      },
    });

    setIsEditDialogOpen(false);
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
    setEditStatus("todo");
    setEditPriority("medium");
    setEditDate("");
    setEditTag("");
  };

  // Delete Task
  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      dispatch({ type: "DELETE_TASK", payload: taskToDelete });
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Drag & Drop
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (status) => {
    if (draggedTask && draggedTask.status !== status) {
      dispatch({
        type: "MOVE_TASK",
        payload: { taskId: draggedTask.id, newStatus: status },
      });
    }
    setDraggedTask(null);
  };

  // Calculate stats
  const stats = getTaskStats(tasks);
  const completionRate = getCompletionRate(stats);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <TaskHeader isOnline={isOnline} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-start gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col items-center gap-4 w-20 rounded-xl bg-muted/40 p-3">
            <div className="w-full flex items-center justify-center py-2">
              <button className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                ✓
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center gap-3 overflow-y-auto py-2">
              <button className="h-10 w-10 rounded-lg bg-transparent text-muted-foreground hover:bg-muted/60 flex items-center justify-center">
                ◎
              </button>
              <button className="h-10 w-10 rounded-lg bg-transparent text-muted-foreground hover:bg-muted/60 flex items-center justify-center">
                ≡
              </button>
              <button className="h-10 w-10 rounded-lg bg-transparent text-muted-foreground hover:bg-muted/60 flex items-center justify-center">
                ⚙
              </button>
            </div>
            <div className="w-full flex items-center justify-center py-2">
              <button className="h-10 w-10 rounded-lg bg-transparent text-muted-foreground hover:bg-muted/60 flex items-center justify-center">
                +
              </button>
            </div>
          </aside>

          <div className="flex-1">
            {/* Stats */}
            <StatsCards stats={stats} />

            {/* Add Task Button */}
            <AddTaskButton onAdd={() => setIsAddDialogOpen(true)} />

            {/* Filters */}
            <TaskFilters
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              sortBy={sortBy}
              setSortBy={setSortBy}
              completionRate={completionRate}
              showProgress={tasks.length > 0}
            />

            {/* Kanban Board */}
            <KanbanBoard
              tasks={tasks}
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              sortBy={sortBy}
              draggedTask={draggedTask}
              getTasksByStatus={getTasksByStatus}
              onToggle={toggleTask}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />

            {/* Empty State */}
            {tasks.length === 0 && <EmptyState />}

            {/* PWA Install Hint */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                💡 يمكنك تثبيت التطبيق للوصول إليه دون اتصال بالإنترنت
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddTaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={addTask}
        title={addTitle}
        setTitle={setAddTitle}
        description={addDescription}
        setDescription={setAddDescription}
        status={addStatus}
        setStatus={setAddStatus}
        priority={addPriority}
        setPriority={setAddPriority}
        date={addDate}
        setDate={setAddDate}
        tags={tags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        isCreatingTag={isCreatingTag}
        setIsCreatingTag={setIsCreatingTag}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        onCreateTag={handleCreateTag}
      />

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={saveEdit}
        title={editTitle}
        setTitle={setEditTitle}
        description={editDescription}
        setDescription={setEditDescription}
        status={editStatus}
        setStatus={setEditStatus}
        priority={editPriority}
        setPriority={setEditPriority}
        date={editDate}
        setDate={setEditDate}
        tags={tags}
        tag={editTag}
        setTag={setEditTag}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TaskManager;
