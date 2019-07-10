import React, { useContext } from "react";
import { Animated, Text } from "react-native";
import { useTheme, colors } from "../../utils";
import { ThemeContext } from "../../store";
const { lightGray, darkBlueGray } = colors;

const fontSizeMap = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24
};

type SizeType = "xs" | "sm" | "md" | "lg" | "xl";

interface ThemeTextProps {
  style?: any;
  numberOfLines?: number;
  flex?: number;
  animate?: boolean;
  size?: SizeType;
  bold?: boolean;
  lightColor?: string;
  darkColor?: string;
}

const ThemeText: React.FC<ThemeTextProps> = ({
  children,
  animate,
  style,
  lightColor = darkBlueGray,
  darkColor = lightGray,
  size = "md",
  flex = 1,
  bold = false,
  ...rest
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const color = useTheme({ light: lightColor, dark: darkColor });

  const styleObject = {
    color: animate ? color : isDarkMode ? lightGray : darkBlueGray,
    flex,
    fontWeight: bold ? "bold" : "normal",
    fontSize: fontSizeMap[size]
  };

  if (animate) {
    return (
      <Animated.Text {...rest} style={[styleObject, style]}>
        {children}
      </Animated.Text>
    );
  } else {
    return (
      <Text {...rest} style={[styleObject, style]}>
        {children}
      </Text>
    );
  }
};

export default ThemeText;
