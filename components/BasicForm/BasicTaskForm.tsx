import React, { useContext } from "react";
import {
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";
import { colors, useDimensions } from "../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Overlay, ThemeView, Input } from "../common";
import { ThemeContext } from "../../store";
const { white } = colors;
const { width } = useDimensions();

export interface BasicTaskFormProps {
  onSubmit: (arg: any) => void;
  onCancel: () => void;
  onPressAdvancedSettings: () => void;
  title: string;
  setTitle: (value: string) => void;
}

const BasicTaskForm: React.SFC<BasicTaskFormProps> = ({
  onCancel,
  onSubmit,
  onPressAdvancedSettings,
  title,
  setTitle
}) => {
  const { themeTextColor } = useContext(ThemeContext);

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
              <MaterialCommunityIcons
                name="dots-horizontal-circle-outline"
                size={30}
                color="#666"
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
        <ThemeView
          style={styles.box}
          // style={[styles.box, { opacity: showModal ? fadeOut : fadeIn }]}
        >
          {MemoBox}
        </ThemeView>
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

export default BasicTaskForm;
