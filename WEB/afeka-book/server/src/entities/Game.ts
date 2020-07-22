import { User } from './User';

export interface IGame {
    player1: User;
    player2: User;
}

export class Game implements IGame {
    constructor(
        public player1: User,
        public player2: User,
    ) {}
}
