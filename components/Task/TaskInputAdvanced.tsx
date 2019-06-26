import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { colors, useDimensions, formatDate } from "../../utils";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { Calendar, Input, AnimatedView } from "../common";
import { ThemeContext } from "../../store";
const { darkGray, blueAlt, white } = colors;
const { width } = useDimensions();

const options = [
  { name: "Text", icon: "stream" },
  { name: "Date", icon: "calendar-alt" },
  { name: "Time", icon: "clock" },
  { name: "Repeat", icon: "redo" },
  { name: "Users", icon: "users" }
];

export interface TaskInputAdvancedProps {
  isVisible: boolean;
  onSubmit: (newTask: any) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  selectedTask?: any;
}

const TaskInputAdvanced: React.SFC<TaskInputAdvancedProps> = ({
  isVisible,
  onSubmit,
  onCancel,
  onDelete,
  selectedTask
}) => {
  const [selectedOption, setSelectedOption] = useState("Text");
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (selectedTask && selectedTask.id) {
      setTitle(selectedTask.title);
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
                    <FontAwesome
                      name={option.icon}
                      size={22}
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
            <View style={{ alignItems: "center" }}>
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
                onChangeText={text => setTitle(text)}
                value={title}
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
