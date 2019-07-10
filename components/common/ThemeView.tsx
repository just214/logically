import React, { useContext } from "react";
import { Animated, View } from "react-native";
import { useTheme, colors } from "../../utils";
import { ThemeContext } from "../../store";

const { darkBlueGray, darkestGray, white } = colors;

export interface ThemeViewProps {
  style: any;
  animate?: boolean;
  altBG?: boolean;
}

const ThemeView: React.FC<ThemeViewProps> = ({
  children,
  style,
  animate,
  altBG
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const animateBackgroundColor = useTheme({
    light: white,
    dark: darkBlueGray
  });

  const backgroundColor = isDarkMode
    ? altBG
      ? darkestGray
      : darkBlueGray
    : white;

  if (animate) {
    return (
      <Animated.View
        style={[style, { backgroundColor: animateBackgroundColor }]}
      >
        {children}
      </Animated.View>
    );
  } else {
    return <View style={[style, { backgroundColor }]}>{children}</View>;
  }
};

export default ThemeView;
