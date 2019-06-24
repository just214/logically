import React, { useMemo } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  Animated
} from "react-native";
import { useFade, useDimensions } from "../../utils";

const { width, height } = useDimensions();

export interface OverlayProps {
  onPress?: (e: GestureResponderEvent) => void;
  opacity?: number;
}

const Overlay: React.SFC<OverlayProps> = ({ onPress, opacity = 0.7 }) => {
  const fade = useFade({ to: opacity });
  const Component = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View
          style={[styles.overlay, { width, height, opacity: fade }]}
        />
      </TouchableWithoutFeedback>
    );
  }, []);

  return <>{Component}</>;
};

var styles = StyleSheet.create({
  // Flex to fill, position absolute,
  // Fixed left/top, and the width set to the window width
  overlay: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    top: 0,
    backgroundColor: "black",
    width,
    height
  }
});

export default Overlay;
