import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';

import { UserRoles } from '@entities/User';
import { cookieProps } from '@shared/constants';
import { JwtService } from '@shared/JwtService';
import UserDao from '@daos/User/UserDao.mock';



const jwtService = new JwtService();
const userDao = new UserDao();


// Middleware to verify if user is an admin
export const adminMW = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get json-web-token
        const jwt = req.signedCookies[cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        const clientData = await jwtService.decodeJwt(jwt);
        if (clientData.role === UserRoles.Admin) {
            res.locals.userId = clientData.id;
            next();
        } else {
            throw Error('JWT not present in signed cookie.');
        }
    } catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
};

export const JWTMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get json-web-token
        const jwt = req.signedCookies[cookieProps.key];
        if (!jwt) {
            throw Error('JWT not present in signed cookie.');
        }
        // Make sure user role is an admin
        const clientData = await jwtService.decodeJwt(jwt);
        const user = (await userDao.getAll()).find((user) => user.id === clientData.id);
        if (!user) {
            throw Error('USER NOT FOUND');
        }

        req.body.user = user;
        next();
    } catch (err) {
        return res.status(UNAUTHORIZED).json({
            error: err.message,
        });
    }
}
