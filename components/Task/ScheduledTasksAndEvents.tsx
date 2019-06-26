import React, { useMemo, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import groupBy from "lodash/groupBy";
import TaskItem from "./TaskItem";
import EventItem from "./EventItem";
import { formatPrettyDate, colors } from "../../utils";
import { format } from "date-fns";
import { AnimatedText } from "../common";
import { ThemeContext } from "../../store";

const { blueAlt } = colors;

function groupByDate(tasksAndEvents) {
  const inProgressOnly = tasksAndEvents
    .filter(task => task.isCompleted === false && !!task.dueDate)
    .sort((a, b) => {
      if (a.dueDate < b.dueDate) {
        return -1;
      } else {
        return 1;
      }
    });
  const tasksGroupedBydueDate = groupBy(inProgressOnly, task => task.dueDate);

  return tasksGroupedBydueDate;
}

export interface ScheduledTasksAndEventsProps {
  tasksAndEvents: any;
  handleToggleTaskCompletion: any;
  onTaskSelect: any;
}

const ScheduledTasksAndEvents: React.SFC<ScheduledTasksAndEventsProps> = ({
  tasksAndEvents,
  handleToggleTaskCompletion,
  onTaskSelect
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const groupedTasks = groupByDate(tasksAndEvents);
  const renderList = useMemo(
    () => (
      <FlatList
        data={Object.keys(groupedTasks)}
        keyExtractor={key => key}
        renderItem={({ item }) => {
          const key = item;
          return (
            <View style={{ marginVertical: 25 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 16
                }}
              >
                <View
                  style={{
                    marginLeft: 12
                  }}
                >
                  <Text
                    style={{
                      color: blueAlt,
                      fontWeight: "bold",
                      fontSize: 18
                    }}
                  >
                    {format(key, "ddd")}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      paddingHorizontal: 12,
                      paddingTop: 0,
                      color: "#999",
                      fontWeight: "bold"
                    }}
                  >
                    {format(key, "MMMM DD, YYYY")}
                  </Text>
                </View>
              </View>

              <FlatList
                data={groupedTasks[key]}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const task = item;
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
                }}
              />
            </View>
          );
        }}
      />
    ),
    [tasksAndEvents]
  );
  return (
    <View>
      <AnimatedText
        style={{ alignSelf: "center", fontSize: 18, paddingVertical: 20 }}
      >
        Today is {formatPrettyDate(new Date())}
      </AnimatedText>
      {renderList}
    </View>
  );
};

export default ScheduledTasksAndEvents;
