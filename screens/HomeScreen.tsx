import React, { useState, useEffect, useContext, useMemo } from "react";
import { StyleSheet, ScrollView, StatusBar, View } from "react-native";
import {
  TasksContext,
  CalendarsContext,
  ThemeContext,
  VibrationContext
} from "../store";
import {
  formatDate,
  useFilter,
  createCalendarMarkers,
  getListTitle,
  useDimensions
} from "../utils";
import isEqual from "lodash/isEqual";
import pickBy from "lodash/pickBy";
import identity from "lodash/identity";

// * Components
import FAB from "../components/FAB";
import TaskInputSimple from "../components/Task/TaskInputSimple";
import TaskInputAdvanced from "../components/Task/TaskInputAdvanced";
import CalendarBS from "../components/CalendarBS";
import ListsBS from "../components/ListsBS";
import TaskItem from "../components/Task/TaskItem";
import EventItem from "../components/Task/EventItem";
import ListTitle from "../components/List/ListTitle";
import { AnimatedView } from "../components/common";

const { width } = useDimensions();

const HomeScreen = ({ navigation }) => {
  // * STATE
  const [showTaskInputSimple, setShowTaskInputSimple] = useState(false);
  const [showTaskInputAdvanced, setShowTaskInputAdvanced] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [filter, setFilter] = useState({
    type: "Date",
    value: formatDate(new Date())
  });
  const [markedDates, setMarkedDates] = useState({});
  const [allTasksAndEvents, setAllTasksAndEvents] = useState([]);

  // * CONTEXT
  const tasks = useContext(TasksContext);
  const { isDarkMode } = useContext(ThemeContext);
  const { events } = useContext(CalendarsContext);
  const inProgressTasks = tasks.inProgressTasks;
  const completedTasks = tasks.completedTasks;
  const [selectedTask, setSelectedTask] = useState({});

  // * MEMOS
  const MemoFAB = useMemo(() => FAB, []);

  // * EFFECTS
  useEffect(() => {
    setAllTasksAndEvents([...inProgressTasks, ...completedTasks, ...events]);
  }, [inProgressTasks, completedTasks, events]);

  useEffect(() => {
    const calMarkers = createCalendarMarkers(allTasksAndEvents, filter);
    setMarkedDates(calMarkers);
  }, [allTasksAndEvents, filter]);

  // * CUSTOM HOOKS
  const [filteredTasks, dispatchFilter] = useFilter(allTasksAndEvents);

  useEffect(() => {
    dispatchFilter(filter);
  }, [allTasksAndEvents]);

  // * METHODS
  const handleSelectedAction = action => {
    if (action === "Settings") {
      navigation.navigate("Settings");
    }
    setSelectedAction(action);
  };

  const handleCreateTask = newTask => {
    const scrubbedTask = pickBy(newTask, identity);
    if (newTask.title) {
      tasks.createTask(scrubbedTask);
    }
    setShowTaskInputSimple(false);
    setShowTaskInputAdvanced(false);
  };

  const handleToggleTaskCompletion = task => {
    tasks.toggleTaskCompletion(task);
  };

  const handleClearMenuAction = () => {
    setSelectedAction("");
  };

  const handleEditTask = task => {
    const scrubbedTask = pickBy(task, identity);
    // Only edit if the task was edited. Otherwise, just close the form.
    if (!isEqual(scrubbedTask, selectedTask)) {
      console.log(task, selectedTask);
      tasks.editTask(scrubbedTask).then(() => {
        setSelectedTask({});
      });
    } else {
      setSelectedTask({});
    }
  };

  const onTaskSelect = task => {
    setSelectedTask(task);
  };

  const toggleTaskInputSimple = () => {
    handleClearMenuAction();
    setShowTaskInputSimple(value => !value);
  };

  const toggleTaskInputAdvanced = () => {
    setShowTaskInputAdvanced(value => !value);
    setShowTaskInputSimple(false);
  };

  const handleDateSelection = date => {
    const action = { type: "Date", value: date };
    setFilter(action);
    dispatchFilter(action);
  };

  const handleListSelection = type => {
    const action = { type, value: "" };
    setFilter(action);
    dispatchFilter(action);
  };

  // * RENDER

  return (
    <AnimatedView bg style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView style={{ width, padding: 12 }}>
        <ListTitle title={getListTitle(filter)} />
        <View style={{ paddingBottom: 150 }}>
          {filteredTasks.map(task => {
            if (!task.isEvent) {
              return (
                <TaskItem
                  key={task.id}
                  task={task}
                  onCheck={handleToggleTaskCompletion}
                  onSelect={onTaskSelect}
                />
              );
            } else {
              return <EventItem key={task.id} event={task} />;
            }
          })}
        </View>
      </ScrollView>

      {showTaskInputSimple && (
        <TaskInputSimple
          onSubmit={handleCreateTask}
          onCancel={toggleTaskInputSimple}
          onPressAdvancedSettings={toggleTaskInputAdvanced}
        />
      )}

      <TaskInputAdvanced
        isVisible={showTaskInputAdvanced}
        onSubmit={handleCreateTask}
        onCancel={toggleTaskInputAdvanced}
      />

      <TaskInputAdvanced
        selectedTask={selectedTask}
        isVisible={!!selectedTask.id}
        onSubmit={handleEditTask}
        onCancel={toggleTaskInputAdvanced}
      />

      {selectedAction === "Calendar" && (
        <CalendarBS
          markedDates={markedDates}
          onClose={handleClearMenuAction}
          onSelection={handleDateSelection}
          value={filter.value}
        />
      )}

      {selectedAction === "Lists" && (
        <ListsBS
          onClose={handleClearMenuAction}
          selected={filter.type}
          onSelection={handleListSelection}
        />
      )}

      <MemoFAB
        onPress={toggleTaskInputSimple}
        onSelection={handleSelectedAction}
      />
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 80
  }
});

HomeScreen.navigationOptions = {
  header: null
};

export default HomeScreen;
