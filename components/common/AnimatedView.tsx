import React from "react";
import { Animated } from "react-native";
import { useTheme, colors } from "../../utils";

const { darkGray, darkestGray, white } = colors;

export interface AnimatedViewProps {
  style: any;
  bg?: boolean;
}

const AnimatedView: React.SFC<AnimatedViewProps> = ({
  children,
  style,
  bg
}) => {
  const backgroundColor = useTheme({
    light: white,
    dark: bg ? darkestGray : darkGray
  });

  return (
    <Animated.View style={[style, { backgroundColor }]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedView;
