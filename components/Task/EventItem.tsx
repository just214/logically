import React from "react";
import { Text, View } from "react-native";
import { AnimatedText } from "../common";
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

      <Text style={{ fontSize: 12, color: blue }}>{event.startTime}</Text>
      <AnimatedText
        numberOfLines={1}
        style={{
          fontSize: 14,
          marginRight: 8,
          marginLeft: 8
        }}
      >
        {event.title}
      </AnimatedText>
    </View>
  );
};

export default EventItem;
