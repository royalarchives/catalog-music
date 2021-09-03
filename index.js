const albums = require('./scan/albums.js')
const genres = require('./scan/genres.js')
const credits = require('./scan/credits.js')
const tracks = require('./scan/tracks.js')

module.exports = {
  scan: async (catalog) => {
    console.log('[music-indexer]', 'scanning tracks')
    await tracks.scan(catalog)
    if (!catalog.tracks.length) {
      return console.log('[indexer]', 'no tracks in catalog')
    }
    console.log('[music-indexer]', 'scanning albums')
    await albums.scan(catalog)
    console.log('[music-indexer]', 'scanning genres')
    await genres.scan(catalog)
    console.log('[music-indexer]', 'scanning credits')
    await credits.scan(catalog)
  },
  load: async (catalog) => {
    if (!catalog.tracks) {
      return console.log('[indexer]', 'no tracks in catalog')
    }
    console.log('[indexer]', 'indexing album information')
    await albums.indexTracks(catalog)
    await albums.indexGenres(catalog)
    await albums.indexCredits(catalog)
    console.log('[indexer]', 'indexing genre information')
    await genres.indexAlbums(catalog)
    await genres.indexTracks(catalog)
    await genres.indexCredits(catalog)
    console.log('[indexer]', 'indexing credit information')
    await credits.indexTracks(catalog)
    await credits.indexGenres(catalog)
    await credits.indexAlbums(catalog)
    catalog.api.music = {
      albums: {
        get: require('./api/albums.get.js'),
        list: require('./api/albums.list.js')
      },
      tracks: {
        get: require('./api/tracks.get.js'),
        list: require('./api/tracks.list.js')
      },
      genres: {
        get: require('./api/genres.get.js'),
        list: require('./api/genres.list.js')
      },
      persons: {
        get: require('./api/credits.get.js'),
        list: require('./api/credits.list.js')
      }
    }
    return catalog
  }
}
