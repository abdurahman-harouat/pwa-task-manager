import React, { useState, useEffect, useReducer } from "react";
import { Plus } from "lucide-react"; // Import Plus icon
import { taskReducer } from "../store/taskReducer";
import { getTaskStats, getCompletionRate, getTasksByStatus } from "../lib/taskUtils";
import { TaskHeader } from "./TaskHeader";
// import { StatsCards } from "./StatsCards"; // integrated stats into header or made smaller
import { TaskFilters } from "./TaskFilters";
import { KanbanBoard } from "./KanbanBoard";
import {
  AddTaskDialog,
  EditTaskDialog,
  DeleteConfirmDialog,
} from "./TaskDialogs";

const TaskManager = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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
  
  // Edit/Delete State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("todo");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDate, setEditDate] = useState("");
  const [editTag, setEditTag] = useState("");
  
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

  // --- Effects (Load/Save) remain the same ---
  useEffect(() => {
    const stored = localStorage.getItem("pwa_tasks");
    if (stored) {
      try { dispatch({ type: "LOAD_TASKS", payload: JSON.parse(stored) }); } 
      catch (e) { console.error(e); }
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("pwa_tags");
    if (stored) setTags(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!isInitialLoad) localStorage.setItem("pwa_tasks", JSON.stringify(tasks));
  }, [tasks, isInitialLoad]);

  useEffect(() => {
    if (tags.length > 0) localStorage.setItem("pwa_tags", JSON.stringify(tags));
  }, [tags]);

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

  // --- Handlers ---
  
  const openAddDialog = (statusPreselect = "todo") => {
      setAddStatus(statusPreselect);
      setIsAddDialogOpen(true);
  };

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
      const next = Array.from(new Set([newTagName.trim(), ...tags]));
      setTags(next);
      localStorage.setItem("pwa_tags", JSON.stringify(next));
    }

    // Reset form
    setAddTitle(""); setAddDescription(""); setAddStatus("todo");
    setAddPriority("medium"); setAddDate(""); setSelectedTag("");
    setIsCreatingTag(false); setNewTagName(""); setIsAddDialogOpen(false);
  };

  // Tag Handler
  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const next = Array.from(new Set([newTagName.trim(), ...tags]));
    setTags(next);
    localStorage.setItem("pwa_tags", JSON.stringify(next));
    setIsCreatingTag(false); setSelectedTag(newTagName.trim()); setNewTagName("");
  };

  // Task Actions
  const toggleTask = (id) => dispatch({ type: "TOGGLE_TASK", payload: id });

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
    if (e) e.preventDefault();
    if (!editTitle.trim() || !editingTask) return;
    dispatch({
      type: "UPDATE_TASK",
      payload: {
        id: editingTask.id,
        updates: {
          title: editTitle, description: editDescription, status: editStatus,
          priority: editPriority, dueDate: editDate || null, tag: editTag || null,
        },
      },
    });
    setIsEditDialogOpen(false); setEditingTask(null);
  };

  const handleDeleteClick = (id) => { setTaskToDelete(id); setIsDeleteModalOpen(true); };
  const confirmDelete = () => {
    if (taskToDelete) {
      dispatch({ type: "DELETE_TASK", payload: taskToDelete });
      setTaskToDelete(null); setIsDeleteModalOpen(false);
    }
  };

  // Drag & Drop
  const handleDragStart = (task) => setDraggedTask(task);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (status) => {
    if (draggedTask && draggedTask.status !== status) {
      dispatch({ type: "MOVE_TASK", payload: { taskId: draggedTask.id, newStatus: status } });
    }
    setDraggedTask(null);
  };

  const stats = getTaskStats(tasks);
  const completionRate = getCompletionRate(stats);

  return (
    <div dir="rtl" className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* 1. Slim Header with integrated actions */}
      <TaskHeader isOnline={isOnline} />

      {/* 2. Control Bar (Filters + Stats summary) - Compact */}
      <div className="flex-none px-4 py-3 border-b border-border bg-background/50 backdrop-blur-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Filters */}
            <div className="flex-1">
                <TaskFilters
                    filterPriority={filterPriority}
                    setFilterPriority={setFilterPriority}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    completionRate={completionRate}
                    showProgress={tasks.length > 0}
                />
            </div>
            
            {/* Right: Primary Action (Desktop) */}
            <button 
                onClick={() => openAddDialog("todo")}
                className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
                <Plus size={18} />
                <span>مهمة جديدة</span>
            </button>
        </div>
      </div>

      {/* 3. Main Content - Full Height Kanban */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full py-4">
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
              onAddClick={openAddDialog} // Pass the add handler
            />
        </div>
        
        {/* Floating Action Button (Mobile/Tablet PWA friendly) */}
        <button 
            onClick={() => openAddDialog("todo")}
            className="md:hidden absolute bottom-6 left-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
            <Plus size={28} />
        </button>
      </main>

      {/* Dialogs - Kept functionality, just rendering at bottom */}
      <AddTaskDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={addTask}
        title={addTitle} setTitle={setAddTitle}
        description={addDescription} setDescription={setAddDescription}
        status={addStatus} setStatus={setAddStatus}
        priority={addPriority} setPriority={setAddPriority}
        date={addDate} setDate={setAddDate}
        tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag}
        isCreatingTag={isCreatingTag} setIsCreatingTag={setIsCreatingTag}
        newTagName={newTagName} setNewTagName={setNewTagName}
        onCreateTag={handleCreateTag}
      />

      <EditTaskDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={saveEdit}
        title={editTitle} setTitle={setEditTitle}
        description={editDescription} setDescription={setEditDescription}
        status={editStatus} setStatus={setEditStatus}
        priority={editPriority} setPriority={setEditPriority}
        date={editDate} setDate={setEditDate}
        tags={tags} tag={editTag} setTag={setEditTag}
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