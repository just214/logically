import React, { useState, useMemo, useEffect, useRef, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated
} from "react-native";
import actions from "./actions";
import { Overlay } from "../common";
import DisplayText from "./DisplayText";
import { VibrationContext } from "../../store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../utils";
const { darkGray, blue, white } = colors;

interface FABProps {
  onSelection: (s: string) => void;
  onPress: () => void;
}

type TextType = "Calendar" | "Lists" | "Settings" | "";

const FAB: React.FC<FABProps> = ({ onSelection, onPress }) => {
  const { vibrate } = useContext(VibrationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<TextType>("");

  // This is basically a copy of the selectedAction state since the state cannot be read in the useMemo
  // and the useRef cannot be used in the JSX.
  const selected = useRef<string>();
  const open = useRef<boolean>();

  useEffect(() => {
    selected.current = selectedAction;
  }, [selectedAction]);

  function handleSetSelectedAction(action) {
    if (action.length) {
      vibrate();
    }
    setSelectedAction(action);
  }

  const panResponder = useRef<{ panHandlers: any }>({ panHandlers: {} });

  useMemo(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        // @ts-ignore
        this.timeout = setTimeout(() => {
          setIsOpen(true);
          open.current = true;
        }, 200);
        vibrate();
      },
      onPanResponderMove: (evt, gestureState) => {
        clearTimeout(this.timeout);
        setIsOpen(true);
        open.current = true;
        if (
          gestureState.dy < -60 &&
          gestureState.dy > -140 &&
          gestureState.dx < 20 &&
          gestureState.dx > -20
        ) {
          if (selected.current !== "Calendar") {
            handleSetSelectedAction("Calendar");
          }
        } else if (
          gestureState.dy < -30 &&
          gestureState.dy > -80 &&
          gestureState.dx < -45 &&
          gestureState.dx > -110
        ) {
          if (selected.current !== "Lists") {
            handleSetSelectedAction("Lists");
          }
        } else if (
          gestureState.dy < 40 &&
          gestureState.dy > -10 &&
          gestureState.dx < -55 &&
          gestureState.dx > -120
        ) {
          if (selected.current !== "Settings") {
            handleSetSelectedAction("Settings");
          }
        } else {
          handleSetSelectedAction("");
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (selected.current) {
          onSelection(selected.current);
        } else if (!open.current) {
          onPress();
        }
        clearTimeout(this.timeout);
        setIsOpen(false);
        open.current = false;

        setSelectedAction("");
      }
    });
  }, []);

  let bounceAnimation = useRef(new Animated.Value(0.01)).current;
  let positionAnimation = useRef(new Animated.Value(60)).current;
  let fadeAnimation = useRef(new Animated.Value(0.01)).current;

  const position = 60;

  useEffect(() => {
    isOpen ? triggerOpenAnimation() : triggerCloseAnimation();
  }, [isOpen]);

  const triggerOpenAnimation = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bounceAnimation, {
            toValue: 310,
            duration: 220
            // easing: Easing.out(Easing.bounce)
          }),
          Animated.timing(positionAnimation, {
            toValue: -position,
            duration: 220
          })
        ]),
        Animated.parallel([
          Animated.timing(bounceAnimation, {
            toValue: 240,
            duration: 200
          }),
          Animated.timing(positionAnimation, {
            toValue: -(position / 2),
            duration: 200
          })
        ]),
        Animated.parallel([
          Animated.timing(bounceAnimation, {
            toValue: 260,
            duration: 220
          }),
          Animated.timing(positionAnimation, {
            toValue: -(position / 2 + 10),
            duration: 220
          })
        ])
      ]),
      Animated.timing(fadeAnimation, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
  };

  const triggerCloseAnimation = () => {
    Animated.parallel([
      Animated.timing(bounceAnimation, {
        toValue: 0,
        duration: 300
      }),
      Animated.timing(positionAnimation, {
        toValue: 90,
        duration: 300
      })
    ]).start();
  };

  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      bottom: position,
      right: position
    },
    fab: {
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: blue,
      borderRadius: 30,
      elevation: 8,
      shadowColor: darkGray,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2
    }
  });

  return (
    <>
      {isOpen && <Overlay opacity={0.8} />}

      <Animated.View
        style={{
          position: "absolute",
          bottom: positionAnimation,
          right: positionAnimation,
          borderRadius: 300,
          backgroundColor: blue,
          opacity: 0.7,
          height: bounceAnimation,
          width: bounceAnimation,
          shadowColor: white,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 20,
          elevation: 1
        }}
      />

      <DisplayText text={selectedAction} />

      <View style={styles.container}>
        <View {...panResponder.current.panHandlers}>
          {isOpen &&
            actions.map(action => (
              <Animated.View
                key={action.title}
                style={[
                  action.style,
                  {
                    position: "absolute",
                    opacity: fadeAnimation
                  }
                ]}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={35}
                  color={
                    selectedAction === action.title
                      ? action.selectedColor
                      : action.color
                  }
                />
              </Animated.View>
            ))}
          <TouchableOpacity style={styles.fab}>
            <View>
              <MaterialCommunityIcons
                name={isOpen ? "close" : "plus"}
                size={30}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default FAB;
