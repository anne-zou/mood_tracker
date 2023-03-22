// db.js
import PouchDB from 'pouchdb-core';
import AsyncStorageAdapter from 'pouchdb-adapter-asyncstorage';
import PouchDBFind from 'pouchdb-find';
import PouchDBMapReduce from 'pouchdb-mapreduce';
import PouchDBReplication from 'pouchdb-replication';
import PouchDBUpsert from 'pouchdb-upsert';
import AsyncStorage from 'asyncstorage-down';

PouchDB.plugin(AsyncStorageAdapter);
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBMapReduce);
PouchDB.plugin(PouchDBReplication);
PouchDB.plugin(PouchDBUpsert);

const db = new PouchDB('moodtrackerdb', { adapter: 'asyncstorage', db: AsyncStorage });

export default db;
