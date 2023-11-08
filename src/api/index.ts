import {Router} from 'express';
import { seriesRouter } from './series';

export const apiRouter = Router();

apiRouter.use('/series', seriesRouter);
