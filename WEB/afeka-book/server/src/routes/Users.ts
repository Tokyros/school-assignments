import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED, CONFLICT, NOT_FOUND } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import UserDao from '@daos/User/UserDao.mock';
import { paramMissingError, pwdSaltRounds, userExistsError } from '@shared/constants';
import { adminMW, JWTMiddleware } from './middleware';
import { UserRoles, User, IUser } from '@entities/User';
import bcrypt from 'bcrypt';
import { NOTFOUND } from 'dns';


// Init shared
const router = Router();
router.use(JWTMiddleware);
const userDao = new UserDao();


/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    if (!req.body.user) {
        return res.status(UNAUTHORIZED).json({error: 'You must login to search users'});
    }
    const users = await userDao.getAll();
    return res.status(OK).json({users});
});

router.post('/add-friend', async (req: Request, res: Response) => {
    if (!req.body.user) {
        return res.status(UNAUTHORIZED).json({error: 'You must login to add a friend'});
    }

    const friendEmail = req.body.friendEmail;
    const currentUser: IUser = req.body.user;
    const friend = await userDao.getOne(friendEmail);

    if (friend) {
        const friendAlreadyAdded = currentUser.friendIds.includes(friend.id);
        if (friendAlreadyAdded) {
            return res.status(CONFLICT).json({message: 'Friend is already added'});
        }

        const updatedUser = { ...currentUser, friendIds: [...currentUser.friendIds, friend.id] };
        const updatedFriend = {...friend, friendIds: [...friend.friendIds, currentUser.id]}
        await userDao.update(updatedUser);
        await userDao.update(updatedFriend);
        res.status(OK).json({friends: (await userDao.getAll()).filter((user) => updatedUser.friendIds.includes(user.id))});
    } else {
        return res.status(NOT_FOUND).json({message: `No user exists with email ${friendEmail}`});
    }
})

router.get('/friends', async (req: Request, res: Response) => {
    if (!req.body.user) {
        return res.status(UNAUTHORIZED).json({error: 'You must login to get friends list'});
    }

    const currentUser: IUser = req.body.user;
    const allFriends = (await userDao.getAll()).filter((user) => currentUser.friendIds.includes(user.id));
    return res.status(200).json(allFriends);
})


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    // Check parameters
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Add new user
    user.role = UserRoles.Standard;
    const hashedUser: User = {...user, pwdHash: bcrypt.hashSync(user.password, pwdSaltRounds)}
    await userDao.add(hashedUser);
    return res.status(CREATED).end();
});


/******************************************************************************
 *                       Update - "PUT /api/users/update"
 ******************************************************************************/

router.put('/update', async (req: Request, res: Response) => {
    // Check Parameters
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Update user
    user.id = Number(user.id);
    await userDao.update(user);
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await userDao.delete(Number(id));
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
