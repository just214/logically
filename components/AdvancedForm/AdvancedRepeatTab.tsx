import React, { useState } from "react";
import { View, Picker } from "react-native";
import { ThemeText } from "../common";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";

export type AdvancedRepeatTabProps = {};
export const AdvancedRepeatTab: React.FC<AdvancedRepeatTabProps> = ({}) => {
  const [value, setValue] = useState("daily");
  return (
    <>
      <ThemeText flex={0} size="lg" bold>
        Frequency
      </ThemeText>
      {/* <View style={{ flex: 1 }}> */}
      <Picker
        selectedValue={value}
        style={{ height: 20, width: "100%" }}
        onValueChange={(itemValue, itemIndex) => setValue(itemValue)}
        itemStyle={{ color: "white" }}
      >
        <Picker.Item label="Daily" value="daily" />
        <Picker.Item label="Weekly" value="weekly" />
        <Picker.Item label="Monthly" value="monthly" />
        <Picker.Item label="Yearly" value="yearly" />
      </Picker>
      {/* </View> */}
    </>
  );
};

export default AdvancedRepeatTab;
