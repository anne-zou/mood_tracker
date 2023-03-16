import React from "react";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import store from "./store/redux_store";
import Realm from "realm";
import {
  MoodEntrySchema,
  MOOD_ENTRY_SCHEMA_KEY,
} from "./database/realm_schemas";

const realmConfig = {
  path: "./database/data.realm",
  schema: [MoodEntrySchema],
  schemaVersion: 0,
};

export default function App() {
  useEffect(async () => {
    await Realm.open(realmConfig);
  }, []);
  return <Provider store={store}>
    <Layout />
  </Provider>;
}
