import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED, CONFLICT, NOT_FOUND } from 'http-status-codes';

import UserDao from '@daos/User/UserDao.mock';
import { JwtService } from '@shared/JwtService';
import { paramMissingError, loginFailedErr, cookieProps, userExistsError, pwdSaltRounds } from '@shared/constants';
import { User, UserRoles, IUser } from '@entities/User';
import { getRandomInt } from '@shared/functions';
import { JWTMiddleware } from './middleware';


const router = Router();
router.use(JWTMiddleware);

const userDao = new UserDao();
const jwtService = new JwtService();


/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post('/signup', async (req: Request, res: Response) => {
    const {email, password} = req.body as {email: string, password: string};
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const user = (await userDao.getAll()).find((user) => user.email === email);
    if (user) {
        return res.status(CONFLICT).json({
            error: userExistsError
        });
    }

    const passwordHash = bcrypt.hashSync(password, pwdSaltRounds);
    const newUser = new User(email.split('@')[0], email, UserRoles.Standard, passwordHash, getRandomInt());

    await userDao.add(newUser);

    return res.status(OK).end();
})

const getUserWithFriends = (user: IUser, allUsers: IUser[]) => {
    return {
        ...user,
        friends: allUsers.filter((oneUser) => user?.friendIds.includes(oneUser.id))
    }
}

router.get('/me', async (req: Request, res: Response) => {
    if (!req.body.user) {
        return res.status(UNAUTHORIZED).end();
    }
    const userEmail = req.body.user.email;

    const user = await userDao.getOne(userEmail);
    if (!user) {
        return res.status(NOT_FOUND).end();
    }
    const allUsers = await userDao.getAll();
    return res.status(OK).json(getUserWithFriends(user, allUsers));
});

router.post('/login', async (req: Request, res: Response) => {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    // Fetch user
    const user = await userDao.getOne(email);
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    // Check password
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
        id: user.id,
        role: user.role,
    });
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);
    // Return
    return res.status(OK).json(getUserWithFriends(user, await userDao.getAll()));
});


/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get('/logout', async (req: Request, res: Response) => {
    const { key, options } = cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
});


/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
