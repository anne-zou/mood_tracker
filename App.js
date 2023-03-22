// @flow
declare var emit: (key: any, value?: any) => void;
import React, { useEffect } from "react";
import Layout from "./components/Layout";
import db from "./database/db";

type MoodEntry = {
  _id: number,
  timestamp: number,
  mood: string,
  intensity: number,
};

export default function App(): React$Node {
  useEffect(() => {
    // Create a design document for querying MoodEntry objects by timestamp
    const createDesignDocument = async () => {
      try {
        await db.put({
          _id: "_design/mood_entry_by_timestamp",
          views: {
            "mood_entry_by_timestamp": {
              map: function (moodEntry: MoodEntry) {
                if (moodEntry.timestamp) {
                  emit(moodEntry.timestamp);
                }
              }.toString(),
            },
          },
        });
      } catch (error) {
        if (error.name !== "conflict") {
          console.error("Error creating design document:", error);
        }
      }
    };

    createDesignDocument();
  }, []);

  return (
    <Layout />
  );
}
