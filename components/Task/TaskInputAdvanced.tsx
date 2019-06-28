import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { colors, useDimensions, formatDate } from "../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Calendar, Input, AnimatedView } from "../common";
import { ThemeContext } from "../../store";
const { darkGray, blueAlt, white } = colors;
const { width } = useDimensions();

const options = [
  { name: "Text", icon: "text-shadow" },
  { name: "Date", icon: "calendar" },
  { name: "Time", icon: "alarm" },
  { name: "Repeat", icon: "repeat" },
  { name: "Users", icon: "account-multiple-plus-outline" }
];

export interface TaskInputAdvancedProps {
  isVisible: boolean;
  onSubmit: (newTask: any) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  selectedTask?: any;
  title?: string;
  setTitle?: (value: string) => void;
}

const TaskInputAdvanced: React.SFC<TaskInputAdvancedProps> = ({
  isVisible,
  onSubmit,
  onCancel,
  onDelete,
  selectedTask,
  title,
  setTitle
}) => {
  const [selectedOption, setSelectedOption] = useState("Text");
  const [dueDate, setDueDate] = useState("");
  const [existingTitle, setExistingTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedTask && selectedTask.id) {
      setExistingTitle(selectedTask.title);
      setNotes(selectedTask.notes);
      setDueDate(selectedTask.dueDate);
    }
  }, [selectedTask]);

  const { themeBGColor } = useContext(ThemeContext);

  const handleSubmit = () => {
    if (selectedTask && selectedTask.id) {
      onSubmit({ ...selectedTask, title, dueDate, notes });
    } else {
      onSubmit({ title, dueDate, notes });
    }
  };

  const handleOnCancel = () => {
    onCancel();
  };

  const handleOnDelete = () => {
    onDelete(selectedTask.id);
  };

  return (
    <Modal
      isVisible={isVisible}
      avoidKeyboard={false}
      backdropOpacity={1}
      backdropColor={themeBGColor}
    >
      <View style={{ flex: 1 }}>
        <AnimatedView style={{ flex: 1, paddingTop: 80 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              marginBottom: 30
            }}
          >
            {options.map(option => {
              return (
                <TouchableOpacity
                  key={option.name}
                  onPress={() => setSelectedOption(option.name)}
                  activeOpacity={0.9}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <View style={{ width: 50 }}>
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={30}
                      color={
                        selectedOption === option.name ? blueAlt : "#DADADA"
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
            <Button title="Save" onPress={handleSubmit} />
          </View>
          {selectedOption === "Date" && (
            <View style={{ alignItems: "center", margin: -15 }}>
              <Calendar
                minDate={formatDate(new Date())}
                pastScrollRange={0}
                onDayPress={day => {
                  setDueDate(day.dateString);
                }}
                markedDates={{
                  [`${dueDate}`]: {
                    selected: true,
                    selectedColor: "steelblue"
                  }
                }}
              />
            </View>
          )}
          {selectedOption === "Text" && (
            <>
              <Input
                placeholder="New Task"
                autoFocus
                style={styles.largeInput}
                onChangeText={text =>
                  setTitle ? setTitle(text) : setExistingTitle(text)
                }
                value={title || existingTitle}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
              <Input
                placeholder="Details"
                style={styles.input}
                onChangeText={text => setNotes(text)}
                value={notes}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
            </>
          )}
        </AnimatedView>
        <KeyboardAvoidingView
          behavior="position"
          contentContainerStyle={{ marginBottom: 40 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly"
            }}
          >
            <Button color="tomato" title="Delete" onPress={handleOnDelete} />
            <Button color="#666" title="Cancel" onPress={handleOnCancel} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0
  },
  box: {
    height: 100,
    width,
    alignSelf: "stretch",
    backgroundColor: white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20
  },
  input: {
    height: 40,
    fontSize: 18
  },
  largeInput: {
    height: 50,
    fontSize: 22
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export default TaskInputAdvanced;
