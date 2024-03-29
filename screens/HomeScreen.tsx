import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  View,
  FlatList
} from "react-native";
import { TasksContext, CalendarsContext, ThemeContext } from "../store";
import {
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
import BasicTaskForm from "../components/BasicForm/BasicTaskForm";
import AdvancedTaskForm from "../components/AdvancedForm/AdvancedTaskForm";
import CalendarBS from "../components/BottomSheets/CalendarBS";
import ListsBS from "../components/BottomSheets/ListsBS";
import TaskItem from "../components/Task/TaskItem";
import EventItem from "../components/Task/EventItem";
import ListTitle from "../components/List/ListTitle";
import { ThemeView } from "../components/common";
import ScheduledTasksAndEvents from "../components/Task/ScheduledTasksAndEvents";

const { width } = useDimensions();

const HomeScreen = ({ navigation }) => {
  // * STATE
  const [showBasicTaskForm, setShowBasicTaskForm] = useState(false);
  const [showAdvancedTaskForm, setShowAdvancedTaskForm] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [filter, setFilter] = useState({
    type: "Scheduled",
    value: ""
  });
  // Share the title between simple and advanced view
  const [title, setTitle] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [allTasksAndEvents, setAllTasksAndEvents] = useState([]);
  const [showScheduledTasks, setShowScheduledTasks] = useState(false);

  // * CONTEXT
  const tasks = useContext(TasksContext);
  const { isDarkMode } = useContext(ThemeContext);
  const { events } = useContext(CalendarsContext);
  const inProgressTasks = tasks.inProgressTasks;
  const completedTasks = tasks.completedTasks;
  const [selectedTask, setSelectedTask] = useState({});

  // * MEMOS
  const MemoFAB = useMemo(() => FAB, []);

  let x = useRef(0);

  // * EFFECTS
  useEffect(() => {
    setAllTasksAndEvents([...events, ...inProgressTasks, ...completedTasks]);
  }, [inProgressTasks, completedTasks, events]);

  useEffect(() => {
    x.current = x.current + 1;
    // console.log(x.current);
    const calMarkers = createCalendarMarkers(allTasksAndEvents, filter);
    setMarkedDates(calMarkers);
  }, [allTasksAndEvents, filter]);

  // * CUSTOM HOOKS
  const [filteredTasks, dispatchFilter] = useFilter(allTasksAndEvents);

  useEffect(() => {
    if (filter.type === "Scheduled") {
      setShowScheduledTasks(true);
    } else {
      setShowScheduledTasks(false);
    }
  }, [filter]);

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
    setShowBasicTaskForm(false);
    setShowAdvancedTaskForm(false);
    setTitle("");
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
      tasks.editTask(scrubbedTask).then(() => {
        setSelectedTask({});
      });
    } else {
      setSelectedTask({});
    }
  };

  const handleDeleteTask = taskId => {
    tasks.deleteTask(taskId).then(() => {
      setSelectedTask({});
    });
  };

  const onTaskSelect = task => {
    setSelectedTask(task);
  };

  const toggleBasicTaskForm = () => {
    if (showBasicTaskForm) {
      setTitle("");
    }
    handleClearMenuAction();
    setShowBasicTaskForm(value => !value);
  };

  const toggleAdvancedTaskForm = () => {
    if (showAdvancedTaskForm) {
      setTitle("");
    }
    setShowAdvancedTaskForm(value => !value);
    setShowBasicTaskForm(false);
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

  if (!inProgressTasks.length && !completedTasks.length) {
    return null;
  }

  return (
    <ThemeView altBG style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView style={{ width, padding: 12 }}>
        <ListTitle title={getListTitle(filter)} />
        <View style={{ paddingBottom: 150 }}>
          {filter.type === "Scheduled" && showScheduledTasks && (
            <ScheduledTasksAndEvents
              handleToggleTaskCompletion={handleToggleTaskCompletion}
              tasksAndEvents={allTasksAndEvents}
              onTaskSelect={onTaskSelect}
            />
          )}
          {filter.type !== "Scheduled" && (
            <FlatList
              data={filteredTasks}
              keyExtractor={t => t.id}
              renderItem={({ item }) => {
                if (item.isEvent) {
                  return <EventItem event={item} />;
                } else
                  return (
                    <TaskItem
                      // key={task.id}
                      task={item}
                      onCheck={handleToggleTaskCompletion}
                      onSelect={onTaskSelect}
                    />
                  );
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* These are for creating a new task */}

      {showBasicTaskForm && (
        <BasicTaskForm
          onSubmit={handleCreateTask}
          onCancel={toggleBasicTaskForm}
          onPressAdvancedSettings={toggleAdvancedTaskForm}
          title={title}
          setTitle={setTitle}
        />
      )}

      {showAdvancedTaskForm && (
        <AdvancedTaskForm
          isVisible={showAdvancedTaskForm}
          onSubmit={handleCreateTask}
          onCancel={toggleAdvancedTaskForm}
          title={title}
          setTitle={setTitle}
        />
      )}

      {/* This one is for editing */}
      {!!selectedTask.id && (
        <AdvancedTaskForm
          selectedTask={selectedTask}
          isVisible={!!selectedTask.id}
          onSubmit={handleEditTask}
          onCancel={() => setSelectedTask({})}
          onDelete={handleDeleteTask}
        />
      )}

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
        onPress={toggleBasicTaskForm}
        onSelection={handleSelectedAction}
      />
    </ThemeView>
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
