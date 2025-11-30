// Redux-like state management for tasks
export const taskReducer = (state, action) => {
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
    case "UPDATE_TASK":
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
      );
    default:
      return state;
  }
};
