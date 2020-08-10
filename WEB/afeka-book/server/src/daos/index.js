import { MongoClient } from 'mongodb';
import { initDb } from './seed';

let dbo;


MongoClient.connect('mongodb://localhost:27017', (err, openDb) => {
  if(!err) {
    // tslint:disable-next-line: no-console
    console.log('DB connection established');
    dbo = openDb.db('afeka-book');
    dbo.dropDatabase().then(() => {
      initDb();
    });
  }
});

export const getDb = () => {
    return dbo;
}