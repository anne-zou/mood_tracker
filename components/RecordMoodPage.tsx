import React from "react";
import { View, StyleSheet } from "react-native";
import MoodButton from "./MoodButton";

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});

interface Props {
  style: any;
}

export default function RecordMoodPage(props: Props) {
  const { style } = props;
  return (
    <View style={{ ...styles.root, ...style }}>
      <View style={styles.row}>
        <MoodButton title="Manic" />
        <MoodButton title="Happy" />
        <MoodButton title="Neutral" />
        <MoodButton title="Depressed" />
        <MoodButton title="Angry" />
        <MoodButton title="Tired" />
      </View>
    </View>
  );
}
