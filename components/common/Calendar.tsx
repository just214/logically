import React, { useContext } from "react";
import { CalendarList } from "react-native-calendars";
import { colors, useDimensions } from "../../utils";
import { ThemeContext } from "../../store";

const { darkBlueGray, white, blue, lightGray } = colors;

export interface CalendarProps {
  horizontal?: boolean;
  pagingEnabled?: boolean;
  onDayPress: (day: any) => void;
  markedDates?: any;
  minDate?: string;
  pastScrollRange?: number;
  markingType?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  horizontal = false,
  pagingEnabled = false,
  onDayPress,
  markedDates,
  minDate,
  pastScrollRange,
  markingType
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { width } = useDimensions();

  return (
    <CalendarList
      // Enable horizontal scrolling, default = false
      horizontal={horizontal}
      minDate={minDate}
      pagingEnabled={pagingEnabled}
      pastScrollRange={pastScrollRange}
      calendarWidth={width}
      theme={{
        monthTextColor: isDarkMode ? lightGray : darkBlueGray,
        dayTextColor: isDarkMode ? lightGray : darkBlueGray,
        backgroundColor: isDarkMode ? darkBlueGray : white,
        calendarBackground: isDarkMode ? darkBlueGray : white,
        selectedDayBackgroundColor: blue,
        todayTextColor: blue,
        textDisabledColor: isDarkMode ? "#333" : "#DADADA"
      }}
      onDayPress={onDayPress}
      markedDates={markedDates}
      markingType={"multi-dot"}
    />
  );
};

export default Calendar;
