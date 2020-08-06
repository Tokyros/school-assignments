import { JWTMiddleware } from './middleware';
import { Router } from 'express';
import UserDao from '@daos/User/UserDao';
import GameDao from '@daos/Game/GameDao';
import { OK, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } from 'http-status-codes';
import { Game } from '@entities/Game';

const router = Router();
router.use(JWTMiddleware);

const gameDao = new GameDao();
const userDao = new UserDao();

// Get current ongoing game
// The game shows which two players are currently playing
router.get('/', async (_, res) => {
    return res.status(OK).send(await gameDao.getGame());
});

// Start a game
// The game is between the authenticated user who issues the request
// and a friend he specified in the request
router.post('/', async (req, res) => {
    const invitingUser = req.body.user;
    if (!invitingUser) {
        return res.status(UNAUTHORIZED).json({message: 'You must be logged in to initiate a game'});
    }
    invitingUser.isPlaying = true;

    // Ensure invited user exists
    const invitedFriendEmail = req.body.friendEmail;
    const invitedUser = await userDao.getOne(invitedFriendEmail);
    if (!invitedUser) {
        return res.status(NOT_FOUND).json({message: `No user exists for the email - ${invitedFriendEmail}`});
    }
    invitedUser.isPlaying = true;
    await userDao.update(invitingUser);
    await userDao.update(invitedUser);

    // Ensure invited user is actually a friend of the inviting user
    if (!invitingUser.friendIds.includes(invitedUser.id)) {
        return res.status(BAD_REQUEST).json({message: `${invitedFriendEmail} is not listed in your list of friends, only friends can be invited to games`});
    }

    console.log(invitedUser);
    console.log(invitingUser);
    const game = new Game(invitingUser, invitedUser);

    await gameDao.setGame(game);
    return res.status(OK).end();
})

export default router;