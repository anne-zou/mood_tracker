export const MOOD_ENTRY_SCHEMA_KEY = 'mood_entry'

export const MoodEntrySchema = {
    name: "MoodEntry",
    properties: {
      _id: "int",
      intensity: "int",
      mood: "int",
      timestamp: "long",
    },
    primaryKey: "_id",
  };