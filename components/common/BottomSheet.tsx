import React, { useRef, useEffect, useContext } from "react";
import RBSheet from "./BS";
import { View } from "react-native";
import { colors } from "../../utils";
import { ThemeContext } from "../../store";

const { darkBlueGray, white } = colors;

export interface BottomSheetProps {
  ref: any;
  onClose: () => void;
  children: any;
}

const BottomSheet = React.forwardRef<any, BottomSheetProps>(
  ({ onClose, children }, ref) => {
    useEffect(() => {
      // TODO- FIX THESE TYPES
      ref.current.open();
    }, []);

    const { isDarkMode } = useContext(ThemeContext);

    const bgColor = isDarkMode ? darkBlueGray : white;
    return (
      <RBSheet
        ref={ref}
        height={400}
        onClose={onClose}
        closeOnDragDown={false}
        closeOnPressMask={true}
        duration={300}
        customStyles={{
          container: {
            // justifyContent: "center",
            // alignItems: "center",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 20,
            backgroundColor: bgColor
            // minHeight: 400
          }
        }}
      >
        <View
          style={{
            width: 40,
            backgroundColor: isDarkMode ? darkBlueGray : white,
            borderRadius: 4,
            borderColor: colors.lightGray,
            alignSelf: "center",
            position: "relative",
            top: -25,
            height: 4
          }}
        />
        <View
          style={{
            flex: 1,
            // Dont set padding here or it will mess up the calendar.
            backgroundColor: isDarkMode ? darkBlueGray : white
          }}
        >
          {children}
        </View>
      </RBSheet>
    );
  }
);

export default BottomSheet;
