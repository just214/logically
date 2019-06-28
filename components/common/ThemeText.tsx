import React from "react";
import { Text } from "react-native";
import { colors } from "../../utils";
const { darkGray } = colors;

export interface ThemeTextProps {
  style?: any;
  numberOfLines?: number;
  flex?: number;
}

const ThemeText: React.FC<ThemeTextProps> = ({
  children,
  style,
  flex = 1,
  ...rest
}) => {
  const color = "#333";

  return (
    <Text {...rest} style={[style, { color: "#333", flex }]}>
      {children}
    </Text>
  );
};

export default ThemeText;
