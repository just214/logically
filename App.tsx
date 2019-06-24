import "./firebase/firebase.config";
import { auth } from "./firebase";
import React, { useState, useEffect } from "react";
import { AppLoading } from "expo";
import { createStackNavigator, createAppContainer } from "react-navigation";
import AuthStack from "./Auth/navigator";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/Settings/SettingsScreen";
import AccountSettings from "./screens/Settings/AccountSettings";
import CalendarEventsSettings from "./screens/Settings/CalendarEventsSettings";
import {
  ThemeProvider,
  TasksProvider,
  VibrationProvider,
  CalendarsProvider
} from "./store";

const AppComponent = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const AppStack = createStackNavigator({ Home: HomeScreen });
  const SettingsStack = createStackNavigator(
    {
      Settings: {
        screen: SettingsScreen
      },
      AccountSettings: {
        screen: AccountSettings
      },
      CalendarEventsSettings: {
        screen: CalendarEventsSettings
      }
    },
    {
      headerMode: "none"
    }
  );
  const OptionsStack = createStackNavigator(
    {
      Home: {
        screen: HomeScreen
      },
      Settings: {
        screen: SettingsStack
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      transparentCard: true
    }
  );

  const startAuthListener = () =>
    new Promise(resolve => {
      return auth().onAuthStateChanged(user => {
        resolve();
        setIsLoggedIn(user ? true : false);
      });
    });

  const App = createAppContainer(isLoggedIn ? OptionsStack : AuthStack);

  if (!isReady) {
    return (
      <AppLoading
        // @ts-ignore
        startAsync={startAuthListener}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  } else if (isLoggedIn) {
    return (
      <ThemeProvider>
        <TasksProvider>
          <CalendarsProvider>
            <VibrationProvider>
              <App />
            </VibrationProvider>
          </CalendarsProvider>
        </TasksProvider>
      </ThemeProvider>
    );
  } else {
    return <App />;
  }
};

export default AppComponent;
