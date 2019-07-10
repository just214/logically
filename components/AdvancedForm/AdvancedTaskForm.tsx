import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text
} from "react-native";
import { colors, useDimensions } from "../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { ThemeView, ThemeText, ClosableTag, RoundedButton } from "../common";
import AdvancedTextTab from "./AdvancedTextTab";
import AdvancedDueDateTab from "./AdvancedDueDateTab";
import AdvancedRepeatTab from "./AdvancedRepeatTab";
import { ThemeContext } from "../../store";
import { format, isSameYear } from "date-fns";
const { blue, white } = colors;
const { width } = useDimensions();

const options = [
  { name: "Text", icon: "text-shadow", label: "Basic Info" },
  { name: "Date", icon: "calendar", label: "Due Date" },
  { name: "Time", icon: "alarm", label: "Alert" },
  { name: "Repeat", icon: "repeat", label: "Repeat" },
  { name: "Users", icon: "account-multiple-plus-outline", label: "Share" }
];

export interface AdvancedTaskFormProps {
  isVisible: boolean;
  onSubmit: (newTask: any) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  selectedTask?: any;
  title?: string;
  setTitle?: (value: string) => void;
}

const AdvancedTaskForm: React.SFC<AdvancedTaskFormProps> = ({
  isVisible,
  onSubmit,
  onCancel,
  onDelete,
  selectedTask,
  title,
  setTitle
}) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
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

  const getFormattedDate = () => {
    const now = Date.now();
    if (isSameYear(now, dueDate)) {
      return format(dueDate, "MMM DD, YYYY");
    } else return format(dueDate, "MMM DD, YYYY");
  };

  const handleOnRemoveDate = () => {
    setDueDate("");
  };

  return (
    <Modal
      isVisible={isVisible}
      avoidKeyboard={false}
      backdropOpacity={1}
      backdropColor={themeBGColor}
    >
      <View style={{ flex: 1 }}>
        <ThemeView style={{ flex: 1, paddingTop: 80 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              marginBottom: 10
            }}
          >
            {options.map(option => {
              return (
                <TouchableOpacity
                  key={option.name}
                  onPress={() => setSelectedOption(option)}
                  activeOpacity={0.9}
                  hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                >
                  <View style={{ width: 50 }}>
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={30}
                      color={
                        selectedOption.name === option.name ? blue : "#DADADA"
                      }
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
            <Button title="Save" onPress={handleSubmit} />
          </View>

          <View
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "flex-start"
            }}
          >
            <Text
              style={{
                color: colors.blue,
                fontWeight: "bold",
                fontSize: 20,
                marginHorizontal: 8
              }}
            >
              {selectedOption.label}
            </Text>
            {!!dueDate.length && selectedOption.name === "Date" && (
              <ClosableTag onClose={handleOnRemoveDate}>
                {getFormattedDate()}
              </ClosableTag>
            )}
          </View>

          {selectedOption.name === "Date" && (
            <AdvancedDueDateTab onDaySelection={setDueDate} dueDate={dueDate} />
          )}
          {selectedOption.name === "Text" && (
            <AdvancedTextTab
              title={title || existingTitle}
              onTitleChange={text =>
                setTitle ? setTitle(text) : setExistingTitle(text)
              }
              notes={notes}
              onNotesChange={setNotes}
              onSubmit={handleSubmit}
            />
          )}

          {selectedOption.name === "Repeat" && <AdvancedRepeatTab />}
        </ThemeView>
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
            <RoundedButton onPress={handleOnDelete}>Delete</RoundedButton>
            <RoundedButton onPress={handleOnCancel}>Cancel</RoundedButton>
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
  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export default AdvancedTaskForm;
