import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { apiRouter } from './api';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*'
}));

app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.status(404);
    return res.json({success: false, erreur: 'Route inexistante'});
});

app.listen(port, () => {
    console.log(`Serveur à l'écoute sur http://localhost:${port}`);
});