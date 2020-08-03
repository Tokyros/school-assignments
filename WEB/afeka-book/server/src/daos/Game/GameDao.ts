import { IGame } from '@entities/Game';
import { getDb } from '..';


export interface IGameDao {
    getGame: () => Promise<IGame | null>;
    setGame: (game: IGame | null) => Promise<void>;
}

class GameDao implements IGameDao {


    public async getGame(): Promise<IGame | null> {
        return (await getDb().collection('game').find().toArray())[0]
    }


    public async setGame(game: IGame | null): Promise<void> {
        await getDb().collection('game').insert(game);
    }
}

export default GameDao;
