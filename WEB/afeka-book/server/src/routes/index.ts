import { Router } from 'express';
import UserRouter from './Users';
import AuthRouter from './Auth';
import PostsRouter from './Posts';
import GameRouter from './Game';
import formData from 'express-form-data';
import fs from 'fs';
import {v4 as uuidV4} from 'uuid';
import { IMAGES_DIR } from '@server';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);
router.use('/feed', PostsRouter);
router.use('/auth', AuthRouter);
router.use('/game', GameRouter);
router.use(formData.parse());
router.post('/file-upload', (req: any, res) => {
    const imageId = uuidV4();
    const values: any[] = Object.values(req.files);
    const paths: string[] = [];
    values.forEach((file) => {
        const extension = file.originalFilename.split('.').reverse()[0];
        fs.copyFileSync(file.path, `${IMAGES_DIR}/${imageId}.${extension}`);
        paths.push(`${imageId}.${extension}`);
    })
    res.json({
        paths
    }).end();
})

// Export the base-router
export default router;
