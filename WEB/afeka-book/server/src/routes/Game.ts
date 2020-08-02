import { JWTMiddleware } from "./middleware";
import { Router } from 'express';
import UserDao from '@daos/User/UserDao.mock';
import GameDao from '@daos/Game/GameDao.mock';
import { OK, UNAUTHORIZED, NOT_FOUND } from 'http-status-codes';
import { Game } from '@entities/Game';


const router = Router();
router.use(JWTMiddleware);

const gameDao = new GameDao();
const userDao = new UserDao();

router.get('/', async (req, res) => {
    return res.status(OK).send(await gameDao.getGame());
});

router.post('/', async (req, res) => {
    const invitingUser = req.body.user;
    if (!invitingUser) {
        return res.status(UNAUTHORIZED).json({message: 'You must be logged in to initiate a game'});
    }
    invitingUser.isPlaying = true;
    const invitedFriendEmail: string = req.body.friendEmail;
    const invitedUser = await userDao.getOne(invitedFriendEmail);
    if (!invitedUser) {
        return res.status(NOT_FOUND).json({message: `No user exists for the email - ${invitedFriendEmail}`});
    }
    invitedUser.isPlaying = true;
    await userDao.update(invitingUser);
    await userDao.update(invitedUser);
    const game = new Game(invitingUser, invitedUser);

    gameDao.setGame(game);
    return res.status(OK).end();
})

export default router;