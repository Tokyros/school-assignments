import { getDb } from '..';

class GameDao {
    async getGame() {
        return (await getDb().collection('game').find().toArray())[0]
    }

    async setGame(game) {
        try {
            await getDb().dropCollection('game');
        } catch (e) {

        }
        await getDb().collection('game').insert(game);
    }
}

export default GameDao;
