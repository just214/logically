import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type ClosableTagProps = {
  onClose: () => void;
};
export const ClosableTag: React.FC<ClosableTagProps> = ({
  children,
  onClose
}) => {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{children}</Text>
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={onClose}
        hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <MaterialCommunityIcons
          name={"close"}
          size={20}
          color={colors.lightestGray}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 25,
    backgroundColor: colors.blue,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    alignSelf: "flex-start"
  },
  text: {
    fontSize: 14
  }
});

export default ClosableTag;
