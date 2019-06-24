import React, { useEffect, useState, createContext } from "react";
import { AsyncStorage } from "react-native";
import colors from "../utils/colors";
const { darkGray, white, lightGray } = colors;

const ThemeContext = createContext(null);

const ThemeProvider: React.FC = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  async function fetchDarkModeAsyncStorage() {
    const isDarkModeFromAsyncStorage = await AsyncStorage.getItem("@darkMode");
    return isDarkModeFromAsyncStorage;
  }

  async function setDarkmodeAsyncStorage() {
    const isDarkModeFromAsyncStorage = await AsyncStorage.getItem("@darkMode");
    return isDarkModeFromAsyncStorage;
  }

  useEffect(() => {
    fetchDarkModeAsyncStorage().then(value => {
      setIsDarkMode(value === "true" ? true : false);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("@darkMode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        themeTextColor: isDarkMode ? lightGray : darkGray,
        themeBGColor: isDarkMode ? darkGray : white
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
