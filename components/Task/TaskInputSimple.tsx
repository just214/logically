import React, { useState, useContext } from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";
import { colors, useDimensions } from "../../utils";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { Overlay, AnimatedView, Input } from "../common";
import { ThemeContext } from "../../store";
const { darkGray, white } = colors;

const { width } = useDimensions();

export interface TaskInputSimpleProps {
  onSubmit: (arg: any) => void;
  onCancel: () => void;
  onPressAdvancedSettings: () => void;
}

const TaskInputSimple: React.SFC<TaskInputSimpleProps> = ({
  onCancel,
  onSubmit,
  onPressAdvancedSettings
}) => {
  const { themeTextColor } = useContext(ThemeContext);

  // const themeText = isDarkMode ?

  const [title, setTitle] = useState("");

  const handleSave = () => {
    onSubmit({ title });
  };

  const MemoBox = React.useMemo(
    () => (
      <>
        <Input
          placeholder="New Task"
          autoFocus
          onChangeText={text => setTitle(text)}
          value={title}
          onSubmitEditing={handleSave}
        />
        <View style={styles.buttonGroup}>
          <TouchableOpacity>
            <View style={{ width: 80 }}>
              <FontAwesome
                name={"ellipsis-h"}
                size={25}
                color={themeTextColor}
                onPress={onPressAdvancedSettings}
              />
            </View>
          </TouchableOpacity>

          <Button title="Save" onPress={handleSave} />
        </View>
      </>
    ),
    [title]
  );

  return (
    <>
      <Overlay onPress={onCancel} />
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <AnimatedView
          style={styles.box}
          // style={[styles.box, { opacity: showModal ? fadeOut : fadeIn }]}
        >
          {MemoBox}
        </AnimatedView>
      </KeyboardAvoidingView>
    </>
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

  buttonGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export default TaskInputSimple;
