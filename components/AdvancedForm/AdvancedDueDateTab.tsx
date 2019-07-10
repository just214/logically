import React from "react";
import { View } from "react-native";
import { Calendar, ThemeText } from "../common";
import { formatDate } from "../../utils";

type AdvancedDueDateTabProps = {
  onDaySelection: (day: string) => void;
  dueDate: string;
};
export const AdvancedDueDateTab: React.FC<AdvancedDueDateTabProps> = ({
  onDaySelection,
  dueDate
}) => {
  return (
    <View style={{ alignItems: "center", marginHorizontal: -15 }}>
      <Calendar
        minDate={formatDate(new Date())}
        pastScrollRange={0}
        onDayPress={day => {
          onDaySelection(day.dateString);
        }}
        markedDates={{
          [`${dueDate}`]: {
            selected: true,
            selectedColor: "steelblue"
          }
        }}
      />
    </View>
  );
};

export default AdvancedDueDateTab;
