import { useReducer } from "react";

export default tasks => {
  function reducer(state, action) {
    const inProgressTasks = tasks.filter(task => task.isCompleted === false);
    switch (action.type) {
      case "All":
        return inProgressTasks;
      case "Scheduled":
        return inProgressTasks.filter(task => task.dueDate);
      case "Unscheduled":
        return inProgressTasks.filter(task => !task.dueDate);
      case "Completed":
        return tasks.filter(task => task.isCompleted);
      case "Shared":
        return [];
      case "Repeating":
        return [];
      case "Overdue":
        return inProgressTasks.filter(
          task => new Date(task.dueDate) < new Date()
        );
      case "Date":
        return inProgressTasks.filter(task => task.dueDate === action.value);
      default:
        return inProgressTasks;
    }
  }

  const [filteredTasks, dispatch] = useReducer(reducer, []);

  return [filteredTasks, dispatch];
};
