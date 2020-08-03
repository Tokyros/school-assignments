import { MongoClient, Db } from 'mongodb';

let dbo: Db;

MongoClient.connect('mongodb://localhost:27017', (err, openDb) => {
  if(!err) {
    // tslint:disable-next-line: no-console
    console.log('DB connection established');
    dbo = openDb.db('afeka-book');
  }
});

export const getDb = () => {
    return dbo;
}