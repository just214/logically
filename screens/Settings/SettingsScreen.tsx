import React, { useMemo, useContext } from "react";
import SettingsLayout from "../../components/Settings/SettingsLayout";
import SettingsNavItem from "../../components/Settings/SettingsNavItem";
import SettingsSwitchItem from "../../components/Settings/SettingsSwitchItem";
import { ThemeContext, VibrationContext } from "../../store";

const settingOptions = [
  {
    icon: "account",
    title: "Account",
    route: "AccountSettings",
    backTo: "Settings",
    iconColor: "#999999"
  },
  {
    icon: "calendar",
    title: "Calendar Events",
    route: "CalendarEventsSettings",
    backTo: "Settings",
    iconColor: "red"
  }
];

const SettingsScreen = props => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { toggleVibrationMode, isVibrationMode } = useContext(VibrationContext);

  const Layout = useMemo(() => {
    return SettingsLayout;
  }, []);

  return (
    <Layout onClose={() => props.navigation.navigate("Home")} title="Settings">
      {settingOptions.map(opt => {
        return (
          <SettingsNavItem
            key={opt.title}
            icon={opt.icon}
            iconColor={opt.iconColor}
            title={opt.title}
            onPress={() => props.navigation.navigate(opt.route)}
          />
        );
      })}

      <SettingsSwitchItem
        icon="weather-night"
        iconColor="orange"
        title="Dark Mode"
        value={isDarkMode}
        onSwitch={() => setIsDarkMode(!isDarkMode)}
      />

      <SettingsSwitchItem
        icon="vibrate"
        iconColor="steelblue"
        title="Vibration"
        value={isVibrationMode}
        onSwitch={toggleVibrationMode}
      />
    </Layout>
  );
};

export default SettingsScreen;
