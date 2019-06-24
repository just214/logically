import React from "react";
import { Animated } from "react-native";
import { useTheme } from "../../utils";
import { colors } from "../../utils";
const { lightGray, lightestGray, darkGray } = colors;

export interface AnimatedTextProps {
  style?: any;
  numberOfLines?: number;
  flex?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  style,
  flex = 1,
  ...rest
}) => {
  const color = useTheme({ light: darkGray, dark: "#c1c1c1" });

  return (
    <Animated.Text {...rest} style={[style, { color, flex }]}>
      {children}
    </Animated.Text>
  );
};

export default AnimatedText;
