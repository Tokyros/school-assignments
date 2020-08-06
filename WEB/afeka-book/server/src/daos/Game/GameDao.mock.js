import { MockDaoMock } from '../MockDb/MockDao.mock';


class GameDao extends MockDaoMock {
    async getGame() {
        try {
            const db = await super.openDb();
            return db.game || null;
        } catch (err) {
            throw err;
        }
    }

    async setGame(game) {
        try {
            const db = await super.openDb();
            db.game = game;
            await super.saveDb(db);
        } catch (err) {
            throw err;
        }
    }
}

export default GameDao;
