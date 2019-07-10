import React from "react";
import { View, Switch, StyleSheet, GestureResponderEvent } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeText } from "../common";

export interface SettingsItemProps {
  icon: string;
  iconColor: string;
  title: string;
  value: boolean;
  onSwitch?: (event: any) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconColor,
  title,
  value,
  onSwitch
}) => {
  const handleSwitch = (value: boolean) => {
    onSwitch(value);
  };
  return (
    <View style={styles.wrapper}>
      <MaterialCommunityIcons name={icon} color={iconColor} size={25} />
      <ThemeText animate style={styles.title}>
        {title}
      </ThemeText>
      <View style={{ position: "absolute", right: 0 }}>
        <Switch value={value} onValueChange={handleSwitch} />
      </View>
    </View>
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
