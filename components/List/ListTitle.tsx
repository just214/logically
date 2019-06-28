import React from "react";
import { StyleSheet } from "react-native";
import { ThemeText } from "../common";

export interface ListTitleProps {
  title: string;
}

const ListTitle: React.SFC<ListTitleProps> = ({ title }) => {
  return <ThemeText style={styles.title}>{title}</ThemeText>;
};

const styles = StyleSheet.create({
  title: {
    paddingTop: 20,
    marginBottom: 18,
    paddingLeft: 12,
    fontSize: 33,
    fontWeight: "bold",
    alignSelf: "flex-start"
  }
});

export default ListTitle;
