import {Router} from 'express';
import expressListRoutes from 'express-list-routes';
import * as trakt from '../services/trakt';
import { appConfig } from '../config/appConfig';
import offlineTrending from '../data/trending_list.json';
import offlineDetails from '../data/series_details.json';



export const seriesRouter = Router();

seriesRouter.get('/trending', async (req, res) => {
    const {isOnline} = appConfig();

    if (!isOnline) {
        res.status(200);
        return res.json({success: true, series: offlineTrending});
    }


    try {
        const trendingSeries = await trakt.fetchTrending();
        res.status(200);
        return res.json({success: true, series: trendingSeries});
    } catch(err) {
        res.status(500);
        return res.json({success: false, erreur: err});
    }
});

seriesRouter.get('/search', async (req, res) => {
    const query = req.query['q'] as string;

    if (!query) {
        res.status(400);
        return res.json({success: false, erreur: 'Un paramètre de requête "q" est nécessaire à la recherche.'});
    }

    const {isOnline} = appConfig();
    if (!isOnline) {
        const series = offlineTrending.filter(({title}) => title.includes(query));
        res.status(200);
        return res.json({success: true, series: series});
    }


    try {
        const foundShows = await trakt.searchShows(query);
        res.status(200);
        return res.json({success: true, series: foundShows});
    } catch(err) {
        res.status(500);
        return res.json({success: false, erreur: err});
    }
});

seriesRouter.get('/favorites', async (req, res) => {
    const query = req.query['id'] as string | string[];
    if (!query) {
        res.status(400);
        return res.json({success: false, erreur: 'Des paramètres de requête "id" sont nécessaires.'});
    }
    const ids = typeof query === 'string' ? [query] : query;

    const {isOnline} = appConfig();
    if (!isOnline) {
        const series = offlineTrending.filter(({id}) => ids.map(i => +i).indexOf(id) !== -1);
        res.status(200);
        return res.json({success: true, series: series});
    }


    try {
        const favoriteShows = await trakt.fetchShowsByIds(ids);
        res.status(200);
        return res.json({success: true, series: favoriteShows});
    } catch(err) {
        res.status(500);
        return res.json({success: false, erreur: err});
    }
});

seriesRouter.get('/:serieId', async (req, res) => {
    const {isOnline} = appConfig();

    const serieId = req.params.serieId;

    if (!isOnline) {
        const serie = offlineDetails.find(({id, slug}) => id == +serieId || slug == serieId);
        if (!serie) {
            res.status(500);
            return res.json({success: false, erreur: "Cette série ne semble pas exister ou une erreur est survenue"});
        }
        res.status(200);
        return res.json({success: true, serie});
    }


    try {
        const serie = await trakt.fetchExtendedShowById(serieId);
        res.status(200);
        return res.json({success: true, serie});
    } catch(err) {
        res.status(500);
        return res.json({success: false, erreur: err});
    }
});


//@ts-ignore
expressListRoutes(seriesRouter, {prefix: '/api/series'});