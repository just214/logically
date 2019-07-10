import React, { useContext } from "react";
import { View, TouchableOpacity, StyleSheet, Button } from "react-native";
import { ThemeView, ThemeText } from "../../components/common";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { colors } from "../../utils";
import { VibrationContext } from "../../store";

const { lightGray } = colors;

interface SettingsLayoutProps {
  onClose: () => void;
  title?: string;
  backTo?: string;
  navigation: any;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  children,
  onClose,
  backTo,
  navigation,
  title
}) => {
  const { vibrate } = useContext(VibrationContext);
  const handleGoBack = () => {
    vibrate();
    navigation.navigate(backTo);
  };

  const handleDone = () => {
    vibrate();
    onClose();
  };
  return (
    <View style={styles.container}>
      <ThemeView animate style={styles.innerContainer}>
        <View style={styles.topRow}>
          <View style={{ justifyContent: "center" }}>
            {backTo && (
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={handleGoBack}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={25}
                  color={lightGray}
                />
                <Button title={backTo} onPress={handleGoBack} />
              </TouchableOpacity>
            )}
          </View>

          <Button title="Done" onPress={handleDone} />
        </View>
        <View>
          {title && (
            <ThemeText
              style={{
                position: "relative",
                top: -20,
                fontSize: 20,
                fontWeight: "bold",
                alignSelf: "center"
              }}
            >
              {title}
            </ThemeText>
          )}
        </View>

        <View style={{ padding: 12, paddingTop: 20 }}>{children}</View>
      </ThemeView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end"
  },
  innerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,

    paddingTop: 50
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10
  }
});

export default withNavigation(SettingsLayout);
