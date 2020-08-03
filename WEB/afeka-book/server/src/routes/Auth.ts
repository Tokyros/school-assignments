import bcrypt from 'bcrypt';
import { Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED, CONFLICT } from 'http-status-codes';

import UserDao from '@daos/User/UserDao';
import { JwtService } from '@shared/JwtService';
import { paramMissingError, loginFailedErr, cookieProps, userExistsError, pwdSaltRounds } from '@shared/constants';
import { User, IUser } from '@entities/User';
import { getRandomInt } from '@shared/functions';
import { JWTMiddleware } from './middleware';


const router = Router();
router.use(JWTMiddleware);

const userDao = new UserDao();
const jwtService = new JwtService();

// User is stored in DB with friendIDs
// This converts these IDs to a list of friend User objects
const getUserWithFriends = async (user: IUser) => {
    const allUsers = await userDao.getAll();
    return {
        ...user,
        friends: allUsers.filter((oneUser) => user?.friendIds.includes(oneUser.id))
    }
}

router.post('/sign-up', async (req, res) => {
    const {email, password} = req.body;

    // Email and password are mandatory
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    // Check if email is already in use
    const maybeUser = (await userDao.getOne(email));
    if (maybeUser) {
        return res.status(CONFLICT).json({
            error: userExistsError
        });
    }

    // Encrypt password
    const passwordHash = bcrypt.hashSync(password, pwdSaltRounds);
    const newUser = new User(email.split('@')[0], email, passwordHash, getRandomInt());

    // Save new user in DB
    await userDao.add(newUser);

    return res.status(OK).end();
})

// This endpoint is for getting details about current logged in user
// The user is authenticated via cookie with JWT
router.get('/me', async (req, res) => {
    if (!req.body.user) {
        // This normally means no user is currently logged in
        // Useful for redirecting to login screens
        return res.status(UNAUTHORIZED).end();
    }

    return res.status(OK).json(await getUserWithFriends(req.body.user));
});

router.post('/login', async (req, res) => {
    // Ensure both email and password are provided
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    // Check that user exists for this email
    const user = await userDao.getOne(email);
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }

    // Check password matches email
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }

    // Create user cookie so he can remain signed in between refreshed
    const jwt = await jwtService.getJwt({
        id: user.id,
    });
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);

    return res.status(OK).json(await getUserWithFriends(user));
});


router.get('/logout', async (_, res) => {
    const { key, options } = cookieProps;
    // Remove cookie from user, logging in out of the system
    res.clearCookie(key, options);
    return res.status(OK).end();
});


/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
