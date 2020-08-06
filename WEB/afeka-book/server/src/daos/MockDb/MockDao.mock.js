import jsonfile from 'jsonfile';


export class MockDaoMock {

    dbFilePath = 'src/daos/MockDb/MockDb.json';


    openDb() {
        return jsonfile.readFile(this.dbFilePath);
    }


    saveDb(db) {
        return jsonfile.writeFile(this.dbFilePath, db);
    }
}
