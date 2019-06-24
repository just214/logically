import React, {
  useEffect,
  useState,
  createContext,
  useCallback,
  useRef
} from "react";
import { AsyncStorage } from "react-native";
import * as Haptic from "expo-haptics";

const VibrationContext = createContext({
  isVibrationMode: true,
  vibrate: null,
  toggleVibrationMode: null
});

const VibrationProvider: React.FC = ({ children }) => {
  const [isVibrationMode, setIsVibrationMode] = useState<boolean>(true);

  async function fetchVibrationModeAsyncStorage() {
    const isVibrationModeFromAsyncStorage = await AsyncStorage.getItem(
      "@vibrationMode"
    );
    return isVibrationModeFromAsyncStorage;
  }

  async function setVibrationmodeAsyncStorage() {
    const isVibrationModeFromAsyncStorage = await AsyncStorage.getItem(
      "@vibrationMode"
    );
    return isVibrationModeFromAsyncStorage;
  }

  const isVibrationModeRef = useRef(isVibrationMode);

  const vibrate = useCallback(() => {
    if (isVibrationModeRef.current) {
      return Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    }
  }, [isVibrationMode]);

  function toggleVibrationMode() {
    setIsVibrationMode(mode => !mode);
  }

  useEffect(() => {
    fetchVibrationModeAsyncStorage().then(value => {
      if (value === "true") {
        setIsVibrationMode(true);
      } else if (value === "false") {
        setIsVibrationMode(false);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@vibrationMode", isVibrationMode ? "true" : "false");
    isVibrationModeRef.current = isVibrationMode;
  }, [isVibrationMode]);

  return (
    <VibrationContext.Provider
      value={{ isVibrationMode, toggleVibrationMode, vibrate }}
    >
      {children}
    </VibrationContext.Provider>
  );
};

export { VibrationProvider, VibrationContext };
