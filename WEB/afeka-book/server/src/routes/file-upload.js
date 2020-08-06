import { Router } from 'express';
import { JWTMiddleware } from './middleware';
import { v4 as uuidV4 } from 'uuid';
import { IMAGES_DIR } from '@server';
import fs from 'fs';
import formData from 'express-form-data';


const router = Router();
router.use(JWTMiddleware);
router.use(formData.parse());

router.post('/', (req, res) => {
    // Generate random id for image
    const imageId = uuidV4();
    // Extract files from request body
    const values = Object.values(req.files);

    const paths = [];
    values.forEach((file) => {
        const extension = file.originalFilename.split('.').reverse()[0];
        // Copy the file to an exposed statics dir
        fs.copyFileSync(file.path, `${IMAGES_DIR}/${imageId}.${extension}`);
        paths.push(`${imageId}.${extension}`);
    })

    // Returned the paths of the uploaded files as an array
    res.json({
        paths
    }).end();
})

export default router;