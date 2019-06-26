import React, { useRef, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheet, AnimatedView } from "./common";
import { CheckListItem } from "../components/common";
import { ThemeContext } from "../store";
import { colors } from "../utils";
const { darkestGray, white } = colors;
export interface ListsBottomSheetProps {
  onClose: () => void;
  onSelection: (selection: string) => void;
  selected: string;
}

const ListsBottomSheet: React.FC<ListsBottomSheetProps> = ({
  onClose,
  onSelection,
  selected
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  useEffect(() => {
    ref.current.open();
  }, []);
  const ref = useRef(null);
  const handleClose = () => {
    ref.current.close();
  };

  const options = [
    // "All",
    "Scheduled",
    "Unscheduled",
    "Shared",
    "Repeating",
    "Completed",
    "Overdue"
  ];
  return (
    <>
      <BottomSheet ref={ref} onClose={onClose}>
        <AnimatedView style={styles.buttonGroup}>
          {options.map(option => {
            const isSelected = selected === option;
            return (
              <CheckListItem
                key={option}
                onSelection={() => onSelection(option)}
                title={option}
                isSelected={isSelected}
              />
            );
          })}
        </AnimatedView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    padding: 12
  },
  buttonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20
  }
});

export default ListsBottomSheet;
