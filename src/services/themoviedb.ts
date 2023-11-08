import fetch from 'node-fetch';
const theMovieDbPrefix = `https://api.themoviedb.org/3/tv`;

export const fetchPoster = async (themovieDbId: number, apiKey: string, type: 'poster' = 'poster') => {
    try {
        const resp = await fetch(`${theMovieDbPrefix}/${themovieDbId}/images?api_key=${apiKey}`);
        const data = await resp.json();
        //@ts-ignore
        return {poster:`https://image.tmdb.org/t/p/w500` + data.posters[0].file_path, backdrop: `https://image.tmdb.org/t/p/original` + data.backdrops[0].file_path};
    } catch(err) {
        console.log('[FETCHING SERIE POSTER]', err);
        return null;
    }
};

