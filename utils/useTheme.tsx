import { useEffect, useState, useRef, useContext } from "react";
import { Animated } from "react-native";
import { ThemeContext } from "../store";

export default ({ light, dark }) => {
  const theme = useContext(ThemeContext);
  const colorValue = useRef(new Animated.Value(0)).current;
  let mounted = useRef(false);

  const animateBackgroundColor = () => {
    colorValue.setValue(0);
    Animated.timing(colorValue, {
      toValue: 1,
      duration: 400
    }).start();
  };

  const darkMode = theme.isDarkMode;

  const [finalColor, setFinalColor] = useState(darkMode ? dark : light);

  useEffect(() => {
    if (mounted.current) {
      animateBackgroundColor();

      setFinalColor(
        colorValue.interpolate({
          inputRange: [0, 1],
          outputRange: darkMode ? [light, dark] : [dark, light],
          extrapolate: "clamp"
        })
      );
    } else {
      mounted.current = true;
    }
  }, [darkMode]);

  return finalColor;
};
