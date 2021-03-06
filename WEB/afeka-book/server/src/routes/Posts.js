import { Router } from 'express';
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from 'http-status-codes';

import { paramMissingError } from '@shared/constants';
import PostDao from '@daos/Post/PostDao';
import { Post } from '@entities/Post';
import { getRandomInt } from '@shared/functions';
import { JWTMiddleware } from './middleware';

const router = Router();
const postDao = new PostDao();
router.use(JWTMiddleware)

// Get all the posts the current user has access to
router.get('/', async (req, res) => {
    const user = req.body.user;
    // Ensure user is logged in
    if (!user) {
        return res.status(UNAUTHORIZED).end();
    }

    const posts = await postDao.getAll();
    const relevantPosts = posts.filter((post) => {
        const postByCurrentUser = post.author.id === user.id;
        if (postByCurrentUser) {
            return true;
        }
        return !post.isPrivate && user.friendIds.includes(post.author.id);
    });

    return res.status(OK).json({posts: relevantPosts});
});

router.post('/', async (req, res) => {
    // Check parameters
    const { postContent } = req.body;
    if (!postContent) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const newPost = new Post(
        getRandomInt(),
        req.body.user,
        postContent,
        req.body.imageIds || [],
        Date.now(),
        req.body.isPrivate || false,
        []
    );
    // Add new user
    await postDao.add(newPost);
    return res.status(CREATED).json(newPost).end();
});

router.post('/add-comment', async (req, res) => {
    // Check parameters
    const { post, comment } = req.body;
    const user = req.body.user;
    if (!comment || !post) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const updatedPost = {
        ...post,
        comments: [...post.comments, {content: comment, author: user}]
    };

    await postDao.update(updatedPost);
    return res.status(CREATED).json(updatedPost).end();
});

export default router;
