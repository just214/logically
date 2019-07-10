import React, { useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeText } from "../common";
import { colors } from "../../utils";
const { lightGray } = colors;
import { VibrationContext } from "../../store";

export interface SettingsItemProps {
  icon: string;
  iconColor: string;
  title: string;
  onPress?: (event: any) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor,
  title,
  children,
  onPress
}) => {
  const { vibrate } = useContext(VibrationContext);
  const handleOnPress = (e: GestureResponderEvent) => {
    vibrate();
    onPress(e);
  };
  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.wrapper}>
      <MaterialCommunityIcons name={icon} color={iconColor} size={25} />
      <ThemeText animate style={styles.title}>
        {title}
      </ThemeText>
      <View style={{ position: "absolute", right: 0 }}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color={lightGray}
          style={{ alignSelf: "flex-end" }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    padding: 10
  },
  title: {
    fontSize: 18,
    paddingLeft: 10
    // fontWeight: "bold"
  }
});

export default SettingsItem;
