import React, { useState } from "react";
import { Button, View, Text, StyleSheet, ButtonProps } from "react-native";
import RecordMoodPage from "./RecordMoodPage";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  body: {
    backgroundColor: "lightgreen",
    flex: 7,
  },
  page: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    backgroundColor: "green",
    flex: 1,
    flexDirection: "row",
    height: 50,
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    paddingTop: 12,
  },
});

enum Tab {
  RecordMood,
  MoodLog,
  MoodGraph,
}

export default function Layout() {
  const [tab, setTab] = useState(Tab.RecordMood);

  const TabItem = (props: { title: string; tab: Tab }) => {
    const { title, tab } = props;
    return (
      <View style={styles.tabItem}>
        <Button color="white" title={title} onPress={() => setTab(tab)} />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <View style={styles.body}>
        {tab == Tab.RecordMood ? (
          <RecordMoodPage style={styles.page} />
        ) : (
          <View style={styles.page}>
            <Text>{"Under construction :)"}</Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <TabItem title="Record Mood" tab={Tab.RecordMood} />
        <TabItem title="Mood Log" tab={Tab.MoodLog} />
        <TabItem title="Mood Graph" tab={Tab.MoodGraph} />
      </View>
    </View>
  );
}
