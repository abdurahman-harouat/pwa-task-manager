import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Plus,
  GripVertical,
  Check,
  Circle,
  X,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

// Custom Shadcn-style Select Component
const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-48 flex items-center justify-between px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : "اختر..."}
        </span>
        <ChevronDown size={16} className="opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-lg shadow-md z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                value === option.value
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-popover-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-card border border-border rounded-xl shadow-lg mx-4 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="text-destructive" size={20} />
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">{message}</p>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm font-medium"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Redux-like state management using useReducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_TASKS":
      return action.payload;
    case "ADD_TASK":
      return [...state, action.payload];
    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.payload
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed ? null : new Date().toISOString(),
            }
          : task
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload);
    case "MOVE_TASK":
      const { taskId, newStatus } = action.payload;
      return state.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );
    default:
      return state;
  }
};

const TaskManager = () => {
  const [tasks, dispatch] = React.useReducer(taskReducer, []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("todo");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [draggedTask, setDraggedTask] = useState(null);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const statusOptions = [
    { value: "todo", label: "قائمة المهام" },
    { value: "in-progress", label: "قيد التنفيذ" },
    { value: "done", label: "مكتمل" },
  ];

  // Load tasks from storage
  useEffect(() => {
    const stored = localStorage.getItem("pwa_tasks");
    if (stored) {
      dispatch({ type: "LOAD_TASKS", payload: JSON.parse(stored) });
    }
  }, []);

  // Save tasks to storage
  useEffect(() => {
    localStorage.setItem("pwa_tasks", JSON.stringify(tasks));
  }, [tasks]);

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

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task = {
      id: Date.now() + Math.random(),
      title: newTaskTitle,
      status: newTaskStatus,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    dispatch({ type: "ADD_TASK", payload: task });
    setNewTaskTitle("");
  };

  const toggleTask = (id) => {
    dispatch({ type: "TOGGLE_TASK", payload: id });
  };

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

  const columns = [
    { id: "todo", title: "قائمة المهام", color: "bg-blue-500" },
    { id: "in-progress", title: "قيد التنفيذ", color: "bg-yellow-500" },
    { id: "done", title: "مكتمل", color: "bg-green-500" },
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Check className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">إدارة المهام</h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                isOnline
                  ? "bg-green-500/10 text-green-600 border-green-200 dark:text-green-400 dark:border-green-800"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {isOnline ? "● متصل" : "● غير متصل"}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Task Form */}
        <div className="mb-8 bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask(e)}
              placeholder="أدخل مهمة جديدة..."
              className="flex-1 px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="w-full md:w-48">
              <CustomSelect
                value={newTaskStatus}
                onChange={setNewTaskStatus}
                options={statusOptions}
              />
            </div>
            <button
              onClick={addTask}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus size={20} />
              إضافة مهمة
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className="bg-muted/50 rounded-xl p-4 border border-border min-h-96"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                <h2 className="text-lg font-semibold text-foreground">
                  {column.title}
                </h2>
                <span className="mr-auto bg-background px-2 py-1 rounded-full text-xs text-muted-foreground border border-border shadow-sm">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="group bg-card rounded-lg p-4 border border-border shadow-sm hover:shadow-md transition-all cursor-move"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <Check size={14} className="text-primary-foreground" />
                          </div>
                        ) : (
                          <Circle
                            size={20}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-foreground font-medium ${
                            task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(task.createdAt).toLocaleDateString("ar-DZ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} className="text-muted-foreground/50" />
                        <button
                          onClick={() => handleDeleteClick(task.id)}
                          className="text-destructive/70 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Circle size={32} className="mx-auto mb-2 opacity-20" />
                    <p className="text-sm">لا توجد مهام بعد</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-muted-foreground text-sm">إجمالي المهام</p>
            <p className="text-3xl font-bold text-foreground mt-1">{tasks.length}</p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-muted-foreground text-sm">المكتملة</p>
            <p className="text-3xl font-bold text-green-500 mt-1">
              {tasks.filter((t) => t.completed).length}
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <p className="text-muted-foreground text-sm">قيد التنفيذ</p>
            <p className="text-3xl font-bold text-yellow-500 mt-1">
              {
                tasks.filter((t) => t.status === "in-progress" && !t.completed)
                  .length
              }
            </p>
          </div>
        </div>

        {/* PWA Install Prompt */}
        <div className="mt-6 text-center text-muted-foreground text-sm">
          <p>💡 قم بتثبيت التطبيق للوصول دون اتصال بالإنترنت</p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="حذف المهمة"
        message="هل أنت متأكد أنك تريد حذف هذه المهمة؟ لا يمكن التراجع عن هذا الإجراء."
      />
    </div>
  );
};

export default TaskManager;
