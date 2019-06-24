import React from "react";
import { View, Button, StyleSheet } from "react-native";

import SettingsLayout from "../../components/Settings/SettingsLayout";
import { auth } from "../../firebase";

const AccountSettings = props => {
  const handleSignOut = () => {
    return auth().signOut();
  };
  return (
    <SettingsLayout
      backTo="Settings"
      onClose={() => props.navigation.navigate("Home")}
    >
      <View style={{ alignItems: "flex-start" }}>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </SettingsLayout>
  );
};

const styles = StyleSheet.create({});

export default AccountSettings;
