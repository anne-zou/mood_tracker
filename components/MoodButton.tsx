import React from "react";
import { View, Button, StyleSheet, TextProps } from "react-native";

const styles = StyleSheet.create({
  moodButton: {
    padding: 12,
  },
});

interface Props {
  title: string;
}

export default function MoodButton(props: Props) {
  const { title } = props;
  return (
    <View style={styles.moodButton}>
      <Button title={title as string} />
    </View>
  );
}
