import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import PostsRouter from './Posts';
import { JWTMiddleware } from './middleware';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/feed', PostsRouter);
router.use('/auth', AuthRouter);

// Export the base-router
export default router;
