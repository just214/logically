import React from "react";
import { View, Switch, StyleSheet, GestureResponderEvent } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { AnimatedText } from "../common";

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
      <FontAwesome5 name={icon} color={iconColor} size={18} />
      <AnimatedText style={styles.title}>{title}</AnimatedText>
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
