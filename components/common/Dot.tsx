import React from "react";
import { View } from "react-native";

export interface DotProps {
  color: string;
}

const Dot: React.FC<DotProps> = ({ color }) => {
  return (
    <View
      style={{
        width: 10,
        height: 10,
        borderRadius: 15,
        backgroundColor: color,
        marginRight: 10
      }}
    />
  );
};

export default Dot;
