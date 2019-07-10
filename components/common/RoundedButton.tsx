import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { colors } from "../../utils";
export type RoundedButtonProps = {
  onPress: () => void;
};
export const RoundedButton: React.FC<RoundedButtonProps> = ({
  children,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    backgroundColor: "tomato",
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  text: {
    color: colors.lightestGray
  }
});

export default RoundedButton;
