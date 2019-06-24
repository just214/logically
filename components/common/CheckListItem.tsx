import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, colors } from "../../utils";
import { VibrationContext, ThemeContext } from "../../store";

const { darkGray, lightGray } = colors;

export interface CheckListItemProps {
  onSelection: () => void;
  isSelected: boolean;
  title: string;
}

const CheckListItem: React.SFC<CheckListItemProps> = ({
  onSelection,
  isSelected,
  title
}) => {
  const color = useTheme({ light: darkGray, dark: lightGray });
  const { vibrate } = useContext(VibrationContext);
  const { isDarkMode } = useContext(ThemeContext);

  const handlePress = () => {
    vibrate();
    onSelection();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.buttonItem,
        { borderBottomColor: isDarkMode ? "#191919" : "#EFEFEF" }
      ]}
      onPress={handlePress}
    >
      <Animated.Text
        style={{
          fontSize: 20,
          color: isSelected ? "#00adf5" : color
        }}
      >
        {title}
      </Animated.Text>
      {isSelected && (
        <Ionicons name={"md-checkmark"} size={20} color={"#00adf5"} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 10,
    paddingTop: 10,

    borderBottomWidth: 0.5
  }
});

export default CheckListItem;
