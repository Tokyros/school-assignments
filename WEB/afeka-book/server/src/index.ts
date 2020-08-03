import { MongoClient, Db } from 'mongodb';
import app from '@server';

// Start the server
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.info('Express server started on port: ' + port);
});
