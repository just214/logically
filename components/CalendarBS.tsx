import React, { useState, useRef, useEffect, useContext } from "react";
import { Button, StyleSheet, View } from "react-native";
import { BottomSheet } from "./common";
import { VibrationContext, ThemeContext } from "../store";
import { formatDate, colors } from "../utils";
import { Calendar } from "./common";

const { white } = colors;

export interface CalendarBSProps {
  onClose: () => void;
  onSelection: (date: string) => void;
  markedDates: any;
  value: string;
}

const CalendarBS: React.FC<CalendarBSProps> = ({
  onClose,
  onSelection,
  markedDates,
  value
}) => {
  const { vibrate } = useContext(VibrationContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [marked, setMarked] = useState(markedDates);
  useEffect(() => {
    ref.current.open();
  }, []);

  const ref = useRef(null);
  const handleClose = () => {
    ref.current.close();
  };

  const handleSelection = day => {
    vibrate();

    const formattedDate = day.dateString || day;
    // @ts-ignore
    // setMarked(value => ({
    //   ...markedDates,

    // }));
    onSelection(formattedDate);
  };

  return (
    <BottomSheet ref={ref} onClose={onClose}>
      <View style={styles.buttonGroup}>
        <Button
          title="Today"
          onPress={() => {
            handleSelection(formatDate(new Date()));
          }}
        />
      </View>

      <Calendar
        // Enable horizontal scrolling, default = false
        horizontal={true}
        // markingType="multi-dot"
        // Enable paging on horizontal, default = false
        pagingEnabled={true}
        onDayPress={handleSelection}
        markedDates={markedDates}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    backgroundColor: "transparent",
    position: "absolute",
    top: -10,
    right: 10,
    zIndex: 1000
  }
});

export default CalendarBS;
