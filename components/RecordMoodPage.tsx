import React from "react";
import { View } from "react-native";
import MoodButton from "./MoodButton";

interface Props {
  style: any;
}

export default function RecordMoodPage(props: Props) {
  const { style } = props;
  return (
    <View
      style={{ flexDirection: "column", justifyContent: "center", ...style }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <MoodButton title="Excited" />
        <MoodButton title="Neutral" />
        <MoodButton title="Content" />
        <MoodButton title="Tired" />
        <MoodButton title="Angry" />
        <MoodButton title="Guilty" />
        <MoodButton title="Anxious" />
        <MoodButton title="Depressed" />
      </View>
    </View>
  );
}
