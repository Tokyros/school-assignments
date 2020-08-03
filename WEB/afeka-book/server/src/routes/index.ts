import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import PostsRouter from './Posts';
import GameRouter from './Game';
import FileUploadRouter from './file-upload';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/feed', PostsRouter);
router.use('/file-upload', FileUploadRouter)
router.use('/game', GameRouter);

export default router;
