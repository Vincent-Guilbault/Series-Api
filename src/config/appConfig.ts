export const appConfig = ()  => ({
    isOnline: process.env['IS_ONLINE'] == "1",
    trakt: {
        apiKey: process.env['TRAKT_API_KEY'] || '',
        apiVersion: process.env['TRAKT_API_VERSION'] || ''           
    }, 
    theMovieDb: {
        apiKey: process.env['THEMOVIEDB_API_KEY'] || ''
    }
});