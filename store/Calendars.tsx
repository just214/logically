import React, { createContext, useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
import formatDate from "../utils/formatDate";
import { format } from "date-fns";
import unionBy from "lodash/unionBy";
import { addDays } from "date-fns";

const CalendarsContext = createContext(null);

export interface CalendarsProviderProps {}

function getDates(startDate, endDate) {
  var dateArray = [];
  var current = new Date(startDate);
  var end = new Date(endDate);
  while (current <= end) {
    dateArray.push(formatDate(current));
    current = addDays(current, 1);
  }
  return dateArray;
}

const CalendarsProvider: React.FC<CalendarsProviderProps> = ({ children }) => {
  const [showEvents, setShowEvents] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(
    calendars.map(c => c.id)
  );
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const handlePermissions = async () => {
      const permission = await Permissions.askAsync(Permissions.CALENDAR);
    };
    if (showEvents) {
      handlePermissions().then(() => {
        fetchCalendarEvents();
      });
    }
  }, [showEvents]);

  // TODO Handle Permissions
  async function handleShowCalendarEvents() {
    const permissionStatus = await Permissions.getAsync(Permissions.CALENDAR);
    const permission = await Permissions.askAsync(Permissions.CALENDAR);
  }

  let updatedEvents = [];

  function fetchCalendarEvents() {
    Calendar.getCalendarsAsync().then((calendarsArray: any) => {
      const filteredForDupes = unionBy(calendarsArray, "id");
      setCalendars(filteredForDupes);

      const ids = selectedCalendarIds;
      if (!ids.length) return;
      Calendar.getEventsAsync(ids, new Date(), addDays(Date.now(), 100)).then(
        events => {
          let newEvents = [];
          events.forEach(event => {
            const { startDate, endDate } = event;
            const isSameDate = startDate === endDate;

            if (!isSameDate && endDate) {
              const dateArray = getDates(startDate, endDate);
              dateArray.forEach(date => {
                newEvents.push({ ...event, dueDate: date });
              });
            } else {
              newEvents.push({ ...event, dueDate: startDate });
            }
            updatedEvents = newEvents.map(event => {
              const parentCalendar = calendarsArray.find(
                cal => cal.id === event.calendarId
              );
              return {
                ...event,
                isEvent: true,
                calendarTitle: parentCalendar.title,
                calendarColor: parentCalendar.color,
                dueDate: formatDate(event.startDate),
                endDate: formatDate(event.endDate),
                isCompleted: false,
                startTime: format(new Date(event.originalStartDate), "hh:mm A")
              };
            });
          });
          const filteredForDupes = unionBy(updatedEvents, "id");
          setEvents(filteredForDupes);
        }
      );
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
