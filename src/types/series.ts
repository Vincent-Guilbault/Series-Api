export type SerieSummary = {
    title: string;
    year: number;
    id: number;
    slug: string;
    imdb: string;
    poster?: string;
    backdrop?: string;
};

type SerieIds = {
    trakt: number;
    tvdb: number;
    tmdb: number;
    imdb: string;
    tvrage?: number;
    slug: string;
};

type SerieStatusType = 'returning series' | 'continuing' | 'in production' | 'planned' | 'upcoming' | 'pilot' | 'canceled' | 'ended';

export type EpisodesFetched = {
    number: number;
    ids: SerieIds;
    episodes: {
        season: number;
        number: number;
        title: string;
        ids: SerieIds
    }[]
};

export type ExtendedSerie = {
    title: string;
    year: number;
    id: string;
    slug: string;
    imdb: string;
    tagline: string;
    overview: string;
    network: string;
    country: string;
    trailer: string;
    status: SerieStatusType;
    rating: number;
    votes: number;
    language: string;
    genres: string[];
    aired_episodes: number;
    poster: string;
    backdrop: string;
    seasons: EpisodesFetched[];
};

export type SeriesFetched = {
    title: string;
    year: number;
    ids: SerieIds;
};

export type ExtendedSerieFetched = {
    title: string;
    year: number;
    ids: SerieIds;
    tagline: string;
    overview: string;
    network: string;
    country: string;
    trailer: string;
    status: SerieStatusType;
    rating: number;
    votes: number;
    language: string;
    genres: string[];
    aired_episodes: number;
};

export type TrendingSeriesFetched = {
    watcher: number;
    show: SeriesFetched
};

export type SearchedSeries = {
    type: string,
    score: number,
    show: SeriesFetched
};