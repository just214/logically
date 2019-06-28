import React from "react";
import { Text, View } from "react-native";
import { ThemeText } from "../common";
import { Dot } from "../common";
import { colors } from "../../utils";
const { blue } = colors;

export interface EventItemProps {
  event: any;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 25,
        paddingLeft: 12
      }}
    >
      <Dot color={event.calendarColor} />

      <Text style={{ fontSize: 12, color: "#666" }}>
        {event.startTime !== "12:00 AM" && event.startTime}
      </Text>

      <ThemeText
        numberOfLines={1}
        style={{
          fontSize: 14,
          marginRight: 8,
          marginLeft: 8
        }}
      >
        {event.title}
      </ThemeText>
    </View>
  );
};

export default EventItem;
