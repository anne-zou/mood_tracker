import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { GRAY_TEXT } from '../../styles/colors';
import { createDimmedStyle } from '../../styles/dimming';

type DateSeparatorProps = {
  timestamp: number;
  dimmed?: boolean;
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export default function DateSeparator({ timestamp, dimmed = false }: DateSeparatorProps) {
  return (
    <View style={[styles.container, dimmed && styles.dimmed]}>
      <View style={styles.line} />
      <Text style={styles.text}>{formatDate(timestamp)}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: GRAY_TEXT,
    opacity: 0.35,
  },
  text: {
    color: GRAY_TEXT,
    fontSize: 12,
  },
  dimmed: createDimmedStyle(),
});
