import React, { Component, useState, useRef } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet
} from "react-native";

const BottomSheet = ({
  height = 300,
  onClose,
  duration,
  minClosingHeight,
  closeOnDragDown,
  customStyles = { wrapper: {}, container: {} },
  closeOnPressMask = true,
  children
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let animatedHeight = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  let panResponder = useRef(null);

  function setModalVisible(visible) {
    if (visible) {
      setIsVisible(visible);
      Animated.timing(animatedHeight, {
        toValue: height,
        duration
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: minClosingHeight,
        duration
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        setIsVisible(false);
        animatedHeight = new Animated.Value(0);

        if (typeof onClose === "function") onClose();
      });
    }
  }

  function createPanResponder() {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => closeOnDragDown,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 20 && gestureState.dy < -20) {
          Animated.event([null, { dy: pan.y }])(e, gestureState);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (height / 4 - gestureState.dy < 0) {
          setIsVisible(false);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
        }
      }
    });
  }

  const panStyle = {
    transform: pan.getTranslateTransform()
  };

  return (
    <Modal
      transparent
      animationType={"slide"}
      visible={isVisible}
      supportedOrientations={["portrait"]}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <View style={[styles.wrapper, customStyles.wrapper]}>
        <TouchableOpacity
          style={styles.mask}
          activeOpacity={1}
          onPress={() => (closeOnPressMask ? setIsVisible(false) : {})}
        />
        <Animated.View
          {...panResponder.current.panHandlers}
          style={[
            panStyle,
            styles.container,
            customStyles.container,
            { height: animatedHeight }
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#00000077"
  },
  mask: {
    flex: 1,
    backgroundColor: "transparent"
  },
  container: {
    backgroundColor: "#fff",
    width: "100%",
    height: 0,
    overflow: "hidden"
  }
});

export default BottomSheet;
