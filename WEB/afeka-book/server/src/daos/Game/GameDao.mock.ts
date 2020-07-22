import { MockDaoMock } from '../MockDb/MockDao.mock';
import { IGameDao } from './GameDao';
import { IGame } from '@entities/Game';


class GameDao extends MockDaoMock implements IGameDao {
    public async getGame(): Promise<IGame | null> {
        try {
            const db = await super.openDb();
            return db.game || null;
        } catch (err) {
            throw err;
        }
    }


    public async setGame(game: IGame | null): Promise<void> {
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
