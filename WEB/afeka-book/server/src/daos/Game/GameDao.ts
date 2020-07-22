import { IGame } from '@entities/Game';


export interface IGameDao {
    getGame: () => Promise<IGame | null>;
    setGame: (game: IGame | null) => Promise<void>;
}

class GameDao implements IGameDao {


    /**
     * @param email
     */
    public async getGame(): Promise<IGame | null> {
        // TODO
        return [] as any;
    }


    /**
     *
     */
    public async setGame(game: IGame | null): Promise<void> {
        // TODO
        return [] as any;
    }
}

export default GameDao;
