import React, { createContext, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
import formatDate from "../utils/formatDate";
import { format } from "date-fns";
import unionBy from "lodash/unionBy";

const CalendarsContext = createContext(null);

export interface CalendarsProviderProps {}

const CalendarsProvider: React.FC<CalendarsProviderProps> = ({ children }) => {
  const [showEvents, setShowEvents] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(
    calendars.map(c => c.id)
  );
  const [events, setEvents] = useState([]);

  async function handleShowCalendarEvents() {
    const permissionStatus = await Permissions.getAsync(Permissions.CALENDAR);
    const permission = await Permissions.askAsync(Permissions.CALENDAR);
  }

  function fetchCalendarEvents() {
    Calendar.getCalendarsAsync().then((calendarsArray: any) => {
      const filteredForDupes = unionBy(calendarsArray, "id");
      setCalendars(filteredForDupes);

      const ids = selectedCalendarIds;
      if (!ids.length) return;
      Calendar.getEventsAsync(
        ids,
        new Date(),
        // TODO- Make a reasonable end date (infinity?)
        new Date(
          Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10
        )
      ).then(events => {
        const updatedEvents = events.map(event => {
          const parentCalendar = calendarsArray.find(
            cal => cal.id === event.calendarId
          );

          return {
            ...event,
            isEvent: true,
            calendarTitle: parentCalendar.title,
            calendarColor: parentCalendar.color,
            dueDate: formatDate(event.startDate),
            isCompleted: false,
            startTime: format(new Date(event.originalStartDate), "hh:mm A")
          };
        });
        const filteredForDupes = unionBy(updatedEvents, "id");
        setEvents(filteredForDupes);
      });
    });
  }

  useEffect(() => {
    AsyncStorage.getItem("@selectedCalendarIds").then(value => {
      const maybeArray = JSON.parse(value);
      setSelectedCalendarIds(Array.isArray(maybeArray) ? maybeArray : []);
    });
    AsyncStorage.getItem("@showCalendarEvents").then(value => {
      setShowEvents(value === "true" ? true : false);
    });
  }, []);

  function toggleShowEvents() {
    setShowEvents(v => !v);
  }

  function toggleSelectedCalendarId(calendarId) {
    const isSelected = selectedCalendarIds.find(v => v === calendarId);
    const newValue = isSelected
      ? selectedCalendarIds.filter(id => id !== calendarId)
      : [...selectedCalendarIds, calendarId];

    setSelectedCalendarIds(newValue);

    AsyncStorage.setItem("@selectedCalendarIds", JSON.stringify(newValue));
  }

  useEffect(() => {
    AsyncStorage.setItem("@showCalendarEvents", JSON.stringify(showEvents));
  }, [showEvents]);

  useEffect(() => {
    if (showEvents) {
      fetchCalendarEvents();
    } else {
      setEvents([]);
    }
  }, [showEvents, selectedCalendarIds]);

  return (
    <CalendarsContext.Provider
      value={{
        events,
        showEvents,
        calendars,
        toggleShowEvents,
        toggleSelectedCalendarId,
        selectedCalendarIds
      }}
    >
      {children}
    </CalendarsContext.Provider>
  );
};

export { CalendarsProvider, CalendarsContext };
