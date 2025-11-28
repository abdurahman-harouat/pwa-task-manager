import React, { useState, useEffect } from "react";
import { Trash2, Plus, GripVertical, Check, Circle } from "lucide-react";

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

  const deleteTask = (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });
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
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    >
      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Check className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">إدارة المهام</h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOnline
                  ? "bg-green-500 bg-opacity-20 text-green-300"
                  : "bg-red-500 bg-opacity-20 text-red-300"
              }`}
            >
              {isOnline ? "● متصل" : "● غير متصل"}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Task Form */}
        <div className="mb-8 bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask(e)}
              placeholder="أدخل مهمة جديدة..."
              className="flex-1 px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value)}
              className="px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="todo" className="bg-slate-800">
                قائمة المهام
              </option>
              <option value="in-progress" className="bg-slate-800">
                قيد التنفيذ
              </option>
              <option value="done" className="bg-slate-800">
                مكتمل
              </option>
            </select>
            <button
              onClick={addTask}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
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
              className="bg-white bg-opacity-5 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-10 min-h-96"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 ${column.color} rounded-full`}></div>
                <h2 className="text-lg font-semibold text-white">
                  {column.title}
                </h2>
                <span className="mr-auto bg-white bg-opacity-10 px-2 py-1 rounded-full text-xs text-gray-300">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="group bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-10 hover:bg-opacity-20 transition-all cursor-move"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        ) : (
                          <Circle
                            size={20}
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                          />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-white ${
                            task.completed ? "line-through opacity-60" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(task.createdAt).toLocaleDateString("ar-DZ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} className="text-gray-400" />
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Circle size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">لا توجد مهام بعد</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-10">
            <p className="text-gray-400 text-sm">إجمالي المهام</p>
            <p className="text-3xl font-bold text-white mt-1">{tasks.length}</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-10">
            <p className="text-gray-400 text-sm">المكتملة</p>
            <p className="text-3xl font-bold text-green-400 mt-1">
              {tasks.filter((t) => t.completed).length}
            </p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 border border-white border-opacity-10">
            <p className="text-gray-400 text-sm">قيد التنفيذ</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">
              {
                tasks.filter((t) => t.status === "in-progress" && !t.completed)
                  .length
              }
            </p>
          </div>
        </div>

        {/* PWA Install Prompt */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>💡 قم بتثبيت التطبيق للوصول دون اتصال بالإنترنت</p>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
