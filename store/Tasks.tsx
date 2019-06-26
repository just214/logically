import React, { useEffect, useState, createContext } from "react";
import { db, auth, create, subscribe, setMerge, _delete } from "../firebase";

const TasksContext = createContext(null);

const TasksProvider: React.FC = ({ children }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);

  function subscribeToInProgressTasks() {
    const callback = (data: Task[]) => {
      setInProgressTasks(data);
    };
    const userId = auth().currentUser.uid;
    const ref = db
      .collection("tasks")
      .where(`access.${userId}`, "==", true)
      .where("isCompleted", "==", false);
    return subscribe(ref, callback);
  }

  function subscribeToCompletedTasks() {
    const callback = (data: Task[]) => {
      setCompletedTasks(data);
    };
    const userId = auth().currentUser.uid;
    const ref = db
      .collection("tasks")
      .where(`access.${userId}`, "==", true)
      .where("isCompleted", "==", true);
    return subscribe(ref, callback);
  }

  function toggleTaskCompletion(task) {
    const ref = db.collection("tasks").doc(task.id);

    return setMerge(ref, {
      isCompleted: !task.isCompleted
    });
  }

  function createTask(newTask) {
    const userId = auth().currentUser.uid;
    const newTaskRef = db.collection("tasks").doc();

    return create(newTaskRef, {
      id: newTaskRef.id,
      isCompleted: false,
      access: {
        [`${userId}`]: true
      },
      ...newTask
    });
  }

  function editTask(task) {
    const taskRef = db.collection("tasks").doc(task.id);
    return setMerge(taskRef, task);
  }

  function deleteTask(taskId) {
    const taskRef = db.collection("tasks").doc(taskId);
    return _delete(taskRef);
  }

  useEffect(() => {
    subscribeToInProgressTasks();
    subscribeToCompletedTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        completedTasks,
        inProgressTasks,
        toggleTaskCompletion,
        createTask,
        editTask,
        deleteTask
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export { TasksProvider, TasksContext };
