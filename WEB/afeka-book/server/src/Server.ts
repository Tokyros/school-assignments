import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';

import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';
import { cookieProps } from '@shared/constants';


// Init express
const app = express();



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});



/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public', 'app');
app.use(express.static(staticDir));
export const IMAGES_DIR = path.join(__dirname, 'public', 'image-uploads');
app.use(express.static(IMAGES_DIR));

app.get('/', (_: Request, res: Response) => {
    res.sendFile('index.html');
});

app.get('/users', (req: Request, res: Response) => {
    console.log(JSON.stringify(req.signedCookies))
    console.log(JSON.stringify(req.cookies))
    const jwt = req.signedCookies[cookieProps.key];
    console.log(jwt);
    if (!jwt) {
        res.status(401);
        res.send();
    } else {
        res.status(200);
        res.send();
    }
});


// Export express instance
export default app;
