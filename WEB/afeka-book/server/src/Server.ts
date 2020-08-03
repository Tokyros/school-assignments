import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import express from 'express';
import 'express-async-errors';

import BaseRouter from './routes';
import { cookieProps } from '@shared/constants';


// Init express
const app = express();

// Setup middleware(s)

// CORS (allow requests from different domains)
app.use(cors({origin: 'http://localhost:3000', credentials: true}));
// Parse post request JSON payloads
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// Allows usage of signed cookies, increases security
app.use(cookieParser(cookieProps.secret));
// Server requests logger
app.use(morgan('dev'));

// Add APIs
app.use('/api', BaseRouter);

// Serve build client bundle files
const staticDir = path.join(__dirname, 'public', 'app');
app.use(express.static(staticDir));

// Serve static images from image-uploads dir
export const IMAGES_DIR = path.join(__dirname, 'public', 'image-uploads');
app.use(express.static(IMAGES_DIR));

// Client entry point
app.get('/', (_, res) => {
    res.sendFile('index.html');
});

export default app;
