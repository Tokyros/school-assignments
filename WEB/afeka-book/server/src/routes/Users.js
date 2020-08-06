import { Router } from 'express';
import { OK, UNAUTHORIZED, CONFLICT, NOT_FOUND } from 'http-status-codes';

import UserDao from '@daos/User/UserDao';
import { JWTMiddleware } from './middleware';

// Init shared
const router = Router();
router.use(JWTMiddleware);
const userDao = new UserDao();

// Get all registered users
router.get('/', async (req, res) => {
    if (!req.body.user) {
        return res.status(UNAUTHORIZED).json({error: 'You must login to search users'});
    }

    const users = await userDao.getAll();
    return res.status(OK).json({users});
});

// Add a friend to current logged in user
router.post('/add-friend', async (req, res) => {
    if (!req.body.user) {
        return res.status(UNAUTHORIZED).json({error: 'You must login to add a friend'});
    }

    const friendEmail = req.body.friendEmail;
    const currentUser = req.body.user;
    const friend = await userDao.getOne(friendEmail);

    // Ensure pending friend exists
    if (!friend) {
        return res.status(NOT_FOUND).json({message: `No user exists with email ${friendEmail}`});
    }

    // Ensure friend is not already added
    if (currentUser.friendIds.includes(friend.id)) {
        return res.status(CONFLICT).json({message: 'Friend is already added'});
    }

    // Add friend id to both users
    const updatedUser = { ...currentUser, friendIds: [...currentUser.friendIds, friend.id] };
    const updatedFriend = {...friend, friendIds: [...friend.friendIds, currentUser.id]}
    await userDao.update(updatedUser);
    await userDao.update(updatedFriend);
    // Return the updated list of friend user objects
    res.status(OK).json({friends: (await userDao.getAll()).filter((user) => updatedUser.friendIds.includes(user.id))});
})

export default router;
