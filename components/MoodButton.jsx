// @flow
import React from "react";
import { View, Button, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: {
    padding: 12,
  },
});

interface Props {
  title: string;
}

export default function MoodButton(props: Props): React$Node {
  const { title } = props;
  return (
    <View style={styles.root}>
      <Button title={(title: string)} onPress={() => {}}/>
    </View>
  );
}
