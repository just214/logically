import React from "react";
import { StyleSheet } from "react-native";
import { Input } from "../common";

type AdvancedTextTabProps = {
  title: string;
  onTitleChange: (text: string) => void;
  notes: string;
  onNotesChange: (text: string) => void;
  onSubmit: (text: string) => void;
};

export const AdvancedTextTab: React.FC<AdvancedTextTabProps> = ({
  title,
  onTitleChange,
  notes,
  onNotesChange,
  onSubmit
}) => {
  return (
    <>
      <Input
        placeholder="New Task"
        autoFocus
        style={styles.largeInput}
        onChangeText={onTitleChange}
        value={title}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
      <Input
        placeholder="Details"
        style={styles.input}
        onChangeText={onNotesChange}
        value={notes}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 16
  },
  largeInput: {
    height: 50,
    fontSize: 18
  }
});

export default AdvancedTextTab;
