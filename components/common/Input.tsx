import React, { useContext } from "react";
import { TextInput, StyleSheet } from "react-native";
import { ThemeContext } from "../../store";

const Input: React.FC<any> = ({ style, ...rest }) => {
  const { isDarkMode, themeTextColor } = useContext(ThemeContext);
  return (
    <TextInput
      {...rest}
      placeholderTextColor="#AFAFAF"
      style={[styles.input, style, { color: themeTextColor }]}
      returnKeyType="done"
      keyboardAppearance={isDarkMode ? "dark" : "default"}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 18
  }
});

export default Input;
