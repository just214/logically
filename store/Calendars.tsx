import React, { createContext, useState, useEffect, useRef } from "react";
import { AsyncStorage } from "react-native";
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
import formatDate from "../utils/formatDate";
import { format } from "date-fns";
import unionBy from "lodash/unionBy";
import isEqual from "lodash/isEqual";
import { addDays, startOfDay, isPast } from "date-fns";

/*
 * AsyncStorage is used to save the user's preference for calendar events:
 * @selectedCalendarIds
 * @showCalendarEvents
 */

interface CalendarsContextObject {
  events: any;
  showEvents: boolean;
  calendars: any[];
  toggleShowEvents: () => void;
  toggleSelectedCalendarId: (calendarId: string) => void;
  selectedCalendarIds: string[];
}

// * THE CONTEXT OBJECT
const CalendarsContext = createContext<CalendarsContextObject | null>(null);

function getDatesBetween(startDate, endDate) {
  var dateArray = [];
  var current = new Date(startDate);
  var end = new Date(endDate);
  while (current <= end) {
    dateArray.push(formatDate(current));
    current = addDays(current, 1);
  }
  return dateArray;
}

async function handleCalendarPermissions() {
  const { status } = await Permissions.getAsync(Permissions.CALENDAR);
  if (status === "granted") {
    return Promise.resolve();
  } else {
    return Permissions.askAsync(Permissions.CALENDAR);
  }
}

async function fetchEventsAsync(calendarIds, calendarsArray): Promise<any[]> {
  // Need startDate to start at the very beginning of the day so that some events are not overlooked
  // if it is currently later in the day.

  const start_date = startOfDay(new Date());
  const end_date = addDays(Date.now(), 100);

  const eventsArray = await Calendar.getEventsAsync(
    calendarIds,
    start_date,
    end_date
  ).then(events => {
    let newEvents = [];
    let updatedEvents = [];
    events.forEach((event, i) => {
      if (isPast(event.startDate)) return;
      const { startDate, endDate } = event;
      const isSameDate = startDate === endDate;

      if (!isSameDate && endDate) {
        const dateArray = getDatesBetween(startDate, endDate);
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
    return updatedEvents;
  });
  return eventsArray;
}

async function fetchCalendarsAsync() {
  const calendarResults = await Calendar.getCalendarsAsync();
  return calendarResults;
}

export interface CalendarsProviderProps {}

const CalendarsProvider: React.FC<CalendarsProviderProps> = ({ children }) => {
  const [showEvents, setShowEvents] = useState<boolean>(false);
  const [calendars, setCalendars] = useState<any>([]);
  const [selectedCalendarIds, setSelectedCalendarIds] = useState(
    calendars.map(c => c.id)
  );
  const [events, setEvents] = useState([]);

  // * If the user chooses to show events, handle permissions then fetch the calendars and events.
  useEffect(() => {
    let interval = null;
    async function handleFetchCalendarsAndEvents() {
      await handleCalendarPermissions();
      const calendarsArray = await fetchCalendarsAsync();
      setCalendars(calendarsArray);
      if (!calendarsArray.length) return;
      const idsArray = selectedCalendarIds.length
        ? selectedCalendarIds
        : calendarsArray;
      const eventsArray = await fetchEventsAsync(idsArray, calendarsArray);
      const filteredForDupes = unionBy(eventsArray, "id");
      if (!isEqual(events, filteredForDupes)) {
        setEvents(filteredForDupes);
      }
    }
    if (showEvents) {
      // On a schedule in case the calendar changes over time.
      interval = setInterval(() => {
        handleFetchCalendarsAndEvents();
      }, 5000);
      // The initial fetch
      handleFetchCalendarsAndEvents();
    }
    return () => clearInterval(interval);
  }, [showEvents]);

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

  return (
    <CalendarsContext.Provider
      value={{
        events: showEvents
          ? events.filter(ev => selectedCalendarIds.includes(ev.calendarId))
          : [],
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
