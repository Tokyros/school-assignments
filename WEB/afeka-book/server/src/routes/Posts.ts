import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import { paramMissingError, pwdSaltRounds, cookieProps } from '@shared/constants';
import { UserRoles, User } from '@entities/User';
import bcrypt from 'bcrypt';
import PostDao from '@daos/Post/PostDao.mock';
import { JwtService } from '@shared/JwtService';
import { Post } from '@entities/Post';
import UserDao from '@daos/User/UserDao.mock';
import { getRandomInt } from '@shared/functions';
import { JWTMiddleware } from './middleware';


// Init shared
const router = Router();
const postDao = new PostDao();
router.use(JWTMiddleware)

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get('/all', async (req: Request, res: Response) => {
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
        return res.status(UNAUTHORIZED).end();
    }

    const userId = req.body.user.id;
    
    const posts = await postDao.getAll();
    const relevantPosts = posts.filter((post) => post.author.id === userId);
    return res.status(OK).json({posts: relevantPosts});
});


/******************************************************************************
 *                       Add One - "POST /api/users/add"
 ******************************************************************************/

router.post('/add', async (req: Request, res: Response) => {
    // Check parameters
    const { postContent } = req.body;
    if (!postContent) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    console.log(req.body);
    const newPost = new Post(getRandomInt(), req.body.user, postContent, req.body.imageIds, Date.now());
    // Add new user
    await postDao.add(newPost);
    return res.status(CREATED).json(newPost).end();
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
    await postDao.update(user);
    return res.status(OK).end();
});


/******************************************************************************
 *                    Delete - "DELETE /api/users/delete/:id"
 ******************************************************************************/

router.delete('/delete/:id', async (req: Request, res: Response) => {
    const { id } = req.params as ParamsDictionary;
    await postDao.delete(Number(id));
    return res.status(OK).end();
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
