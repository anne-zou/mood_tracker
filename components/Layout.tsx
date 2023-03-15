import React, { useState } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import RecordMoodPage from "./RecordMoodPage";

const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    flex: 1,
    paddingTop: 12,
  },
});

export default function Layout() {
  const [tab, setTab] = useState(Tabs.RecordMood);

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View style={{ flex: 7, backgroundColor: "lightgreen" }}>
        {tab == Tabs.RecordMood ? (
          <RecordMoodPage style={{ flex: 1 }} />
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>Under construction :)</Text>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "green",
          flexDirection: "row",
          height: 50,
        }}
      >
        <View style={styles.tab}>
          <Button
            color="white"
            title="Record Mood"
            onPress={() => setTab(Tabs.RecordMood)}
          />
          {/* <Text>New Mood</Text> */}
        </View>
        <View style={styles.tab}>
          <Button
            color="white"
            title="Mood Log"
            onPress={() => setTab(Tabs.MoodLog)}
          />
          {/* <Text>Mood Log</Text> */}
        </View>
        <View style={styles.tab}>
          <Button
            color="white"
            title="Mood Graph"
            onPress={() => setTab(Tabs.MoodGraph)}
          />
          {/* <Text>Time Graph</Text> */}
        </View>
      </View>
    </View>
  );
}

enum Tabs {
  RecordMood,
  MoodLog,
  MoodGraph,
}
