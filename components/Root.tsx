import React, {useState} from 'react';
import {Button, View, Text} from 'react-native';

export default function Root() {
  const [tab, setTab] = useState(Tabs.NewMood);

  return <View style={{flexDirection: 'column'}}>
    <View>
      {/* Tab content */}
      <Text>Tab content will display here</Text>
    </View>
    <View style={{flexDirection: 'row', height: 50}}>
      <Button title="New mood"></Button>
      <Button title="Mood log"></Button>
      <Button title="Time graph"></Button>
    </View>
  </View>;
  
}

enum Tabs {
  NewMood,
  MoodLog,
  TimeGraph,
}