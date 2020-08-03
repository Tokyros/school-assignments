import { Request, Response, NextFunction } from 'express';
import { cookieProps } from '@shared/constants';
import { JwtService } from '@shared/JwtService';
import UserDao from '@daos/User/UserDao';

const jwtService = new JwtService();
const userDao = new UserDao();

// Custom middleware that adds the signed in user to requests
export const JWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Get json-web-token
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
        next();
        return;
    }

    const clientData = await jwtService.decodeJwt(jwt)
    const user = (await userDao.getAll()).find((oneUser) => {
        return oneUser.id === clientData.id;
    });

    req.body.user = user;
    next();
}
