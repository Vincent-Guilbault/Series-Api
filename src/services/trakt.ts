import { appConfig } from "../config/appConfig";
import { EpisodesFetched, ExtendedSerie, ExtendedSerieFetched, SearchedSeries, SerieSummary, SeriesFetched, TrendingSeriesFetched } from "../types/series";
import {fetchPoster} from './themoviedb';
import fetch from "node-fetch";

const traktPrefix = 'https://api.trakt.tv';

export const fetchTrending = async () => {
    const {trakt: {apiKey, apiVersion}, theMovieDb: {apiKey: tmdbKey}} = appConfig();
    try {
        const resp = await fetch(`${traktPrefix}/shows/trending`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-key': apiKey,
                'trakt-api-version': apiVersion
            }
        });
        const data = await resp.json() as TrendingSeriesFetched[];

        return await Promise.all(formatSeries(data.map(s => s.show), tmdbKey));

    } catch(err) {
        console.log('[FETCHING TRENDING SHOWS ERROR]', err);
        throw 'Une erreur interne au serveur est survenue';
    }
};

export const fetchShowsByIds = async (ids: string[]) => {
    const {trakt: {apiKey, apiVersion}, theMovieDb: {apiKey: tmdbKey}} = appConfig();
    try {
        const details = await Promise.all(ids.map(id => {
            return fetch(`${traktPrefix}/shows/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-key': apiKey,
                    'trakt-api-version': apiVersion
                }
            }).then(resp => {
                if (resp.status === 404) {
                    throw 'Cette série ne semble pas exister';
                }
                return resp.json() as Promise<SeriesFetched>;
            }, (err) => {
                console.log('[FETCHING SHOW BY ID ERROR', err);
                throw 'Une erreur interne au serveur est survenue';
            });
        }));

        return await Promise.all(details.map(d => {
            return fetchPoster(d.ids.tmdb, tmdbKey).then(imgs => {
                const {title, year, ids} = d;
                return {
                    title,
                    year,
                    id: ids.trakt,
                    imdb: 'https://www.imdb.com/title/' + ids.imdb + '/',
                    poster: imgs?.poster,
                    backdrop: imgs?.backdrop
                } as SerieSummary ;
            });
        }));

    } catch(err) {
        console.log('[FETCHING SHOWS BY IDS', err);
        throw 'Une erreur interne au serveur est survenue';
    }
};

export const fetchExtendedShowById = async (id: string) => {
    const {trakt: {apiKey, apiVersion}, theMovieDb: {apiKey: tmdbKey}} = appConfig();
    try {
        const fetchedDetails = await Promise.all([
            fetch(`${traktPrefix}/shows/${id}?extended=full`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-key': apiKey,
                    'trakt-api-version': apiVersion
                }
            }).then(resp => {
                if (resp.status === 404) {
                    throw 'Cette série ne semble pas exister';
                }
                return resp.json() as Promise<ExtendedSerieFetched>;
            }, (err) => {
                console.log('[FETCHING SHOW BY ID ERROR', err);
                throw 'Une erreur interne au serveur est survenue';
            }),

            fetch(`${traktPrefix}/shows/${id}/seasons?extended=episodes`, {
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-key': apiKey,
                    'trakt-api-version': apiVersion
                }
            }).then(resp => {
                if (resp.status === 404) {
                    throw 'Cette série ne semble pas exister';
                }
                return resp.json() as Promise<EpisodesFetched[]>;
            }, (err) => {
                console.log('[FETCHING SHOW EPISODES ERROR', err);
                throw 'Une erreur interne au serveur est survenue';
            }),
        ]);
        
        const {title,
            year,
            ids,
            tagline,
            overview,
            network,
            country,
            trailer,
            status,
            rating,
            votes,
            language,
            genres,
            aired_episodes} = fetchedDetails[0];

        const imgs = await fetchPoster(ids.tmdb, tmdbKey);
        return {
            title,
            year,
            id,
            slug: ids.slug,
            imdb: 'https://www.imdb.com/title/' + ids.imdb + '/',
            tagline,
            overview,
            network,
            country,
            trailer,
            status,
            rating,
            votes,
            language,
            genres,
            aired_episodes,
            poster: imgs?.poster,
            backdrop: imgs?.backdrop,
            seasons: fetchedDetails[1]
        };
        // const poster = await fetchPoster(data['ids']['imdb']);

    } catch(err) {
        console.log('[FETCHING SHOW BY ID ERROR]', err);
        throw 'Cette série ne semble pas exister ou une erreur est survenue';
    }
};

export const searchShows = async(query: string) => {
    const {trakt: {apiKey, apiVersion}, theMovieDb: {apiKey: tmdbKey}} = appConfig();
    try {
        const resp = await fetch(`${traktPrefix}/search/show?query=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-key': apiKey,
                'trakt-api-version': apiVersion
            }
        });
        const data = await resp.json() as SearchedSeries[];
        return Promise.all(formatSeries(data.map(s => s.show), tmdbKey));

    } catch(err) {
        console.log('[SEARCH SHOW ERROR]', err);
        throw 'Une erreur interne au serveur est survenue';
    }
};

const formatSeries = (showsSummary: SeriesFetched[], tmdbKey: string) => {
    return showsSummary.map(({title, year, ids}) => ({title, year, id: ids.trakt, slug: ids.slug, imdb: 'https://www.imdb.com/title/' + ids.imdb + '/', tmdb: ids.tmdb}))
    .map(({title, year, id, slug, imdb, tmdb}) => {
        return fetchPoster(tmdb, tmdbKey).then(imgs => ({
            title, year, id, slug, imdb, poster: imgs?.poster, backdrop: imgs?.backdrop
        } as SerieSummary));
    });
};