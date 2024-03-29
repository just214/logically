import React, { useMemo, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import groupBy from "lodash/groupBy";
import TaskItem from "./TaskItem";
import EventItem from "./EventItem";
import { formatPrettyDate, colors } from "../../utils";
import { format, isToday } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { blue } = colors;

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
                      color: blue,
                      fontWeight: "bold",
                      fontSize: 22
                    }}
                  >
                    {format(key, "ddd")}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      paddingHorizontal: 6,
                      paddingTop: 0,
                      color: "#999",
                      fontWeight: "bold"
                    }}
                  >
                    {format(key, "MMMM DD, YYYY")}
                  </Text>
                </View>
                {isToday(key) && (
                  <MaterialCommunityIcons
                    name="star-box-outline"
                    size={30}
                    color={blue}
                  />
                )}
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
      <Text
        style={{
          fontSize: 18,
          paddingLeft: 12,
          paddingVertical: 20,
          color: blue
        }}
      >
        Today is {formatPrettyDate(new Date())}
      </Text>
      {renderList}
    </View>
  );
};

export default ScheduledTasksAndEvents;
