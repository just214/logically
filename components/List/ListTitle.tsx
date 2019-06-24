import React from "react";
import { StyleSheet } from "react-native";
import { AnimatedText } from "../common";

export interface ListTitleProps {
  title: string;
}

const ListTitle: React.SFC<ListTitleProps> = ({ title }) => {
  return <AnimatedText style={styles.title}>{title}</AnimatedText>;
};

const styles = StyleSheet.create({
  title: {
    paddingTop: 20,
    paddingBottom: 28,
    paddingLeft: 10,
    height: 60,
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "center"
  }
});

export default ListTitle;
