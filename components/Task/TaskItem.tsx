import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { ThemeText } from "../common";
import { CheckBox } from "react-native-elements";
import { colors } from "../../utils";
import { VibrationContext } from "../../store";

const { white } = colors;

export interface ListtaskProps {
  task: any;
  onCheck: (id) => void;
  onSelect: (task) => void;
}

const Listtask: React.FC<ListtaskProps> = ({ task, onCheck, onSelect }) => {
  const [isChecked, setIsChecked] = useState(task.isCompleted);
  const { vibrate } = useContext(VibrationContext);

  const handleCheck = value => {
    vibrate();
    setIsChecked(v => !v);

    setTimeout(() => {
      onCheck(task);
    }, 500);
  };

  const handleSelect = () => {
    vibrate();
    onSelect(task);
  };
  return (
    <View style={{ flexDirection: "row", alignItems: "center", height: 40 }}>
      <TouchableWithoutFeedback
        style={{ paddingRight: 20 }}
        hitSlop={{ right: 30 }}
        onPress={() =>
          handleCheck({ id: task.id, currentState: task.isCompleted })
        }
      >
        <CheckBox
          onPress={() =>
            handleCheck({ id: task.id, currentState: task.isCompleted })
          }
          checked={isChecked}
          containerStyle={{
            backgroundColor: "transparent",
            borderColor: white,
            padding: 0,
            margin: 0
          }}
        />
      </TouchableWithoutFeedback>
      <View style={{ height: 25 }}>
        <TouchableWithoutFeedback onPress={handleSelect}>
          <ThemeText flex={1} style={{ fontSize: 18 }} numberOfLines={1}>
            {task.title}
          </ThemeText>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Listtask;
