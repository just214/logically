import React, { useContext, useMemo } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import SettingsSwitchItem from "../../components/Settings/SettingsSwitchItem";
import { CalendarsContext } from "../../store";
import SettingsLayout from "../../components/Settings/SettingsLayout";
import { CheckListItem, Dot, ThemeText } from "../../components/common";
import { useFade } from "../../utils";

const CalendarEventsSettings = props => {
  const {
    calendars,
    showEvents,
    toggleShowEvents,
    selectedCalendarIds,
    toggleSelectedCalendarId
  } = useContext(CalendarsContext);

  const fadeIn = useFade({ to: 1, duration: 500 });
  const fadeOut = useFade({ to: 0, duration: 500 });

  let sortedCalendars = {};

  calendars.forEach(cal => {
    if (!sortedCalendars[cal.source.type]) {
      sortedCalendars[cal.source.type] = [];
    }
    sortedCalendars[cal.source.type].push(cal);
  });

  return (
    <SettingsLayout
      backTo="Settings"
      title="Calendar Events"
      onClose={() => props.navigation.navigate("Home")}
    >
      <ScrollView>
        <SettingsSwitchItem
          icon="calendar"
          iconColor="red"
          title="Show Calendar Events"
          value={showEvents}
          onSwitch={toggleShowEvents}
        />
        {showEvents && (
          <>
            <ThemeText
              size="lg"
              bold
              style={{ marginHorizontal: 12, marginVertical: 20 }}
            >
              Select calendars
            </ThemeText>
            {Object.keys(sortedCalendars).map(key => {
              return (
                <View key={key}>
                  <ThemeText
                    size="sm"
                    bold
                    lightColor="#999999"
                    darkColor="#999999"
                    style={{
                      padding: 12
                    }}
                  >
                    {key === "caldav"
                      ? "iCloud"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                  </ThemeText>
                  <View style={{ paddingBottom: 15 }}>
                    {sortedCalendars[key].map(cal => (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          marginRight: 12
                        }}
                        key={cal.id}
                      >
                        <Dot color={cal.color} />

                        <CheckListItem
                          title={cal.title}
                          onSelection={() => {
                            toggleSelectedCalendarId(cal.id);
                          }}
                          isSelected={
                            !!selectedCalendarIds.find(id => id === cal.id)
                          }
                        />
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </SettingsLayout>
  );
};

const styles = StyleSheet.create({});

export default CalendarEventsSettings;
