const creditCategories = require('./credits.js').creditCategories

module.exports = {
  scan: scanAlbums,
  indexTracks,
  indexGenres,
  indexCredits
}

function normalize (text) {
  return (text || '').toLowerCase().replace(/[\W_]+/g, '')
}

async function scanAlbums (catalog) {
  catalog.albums = []
  const uniqueKeys = []
  for (const track of catalog.tracks) {
    if (!track.artist || !track.album) {
      continue
    }
    const album = await processAlbum(catalog, track, uniqueKeys)
    if (album) {
      catalog.albums.push(album)
    }
  }
  catalog.indexArray(catalog.albums)
}

async function processAlbum (catalog, track, uniqueKeys) {
  const key = normalize(track.artist) + normalize(track.album)
  if (uniqueKeys.indexOf(key) === -1) {
    uniqueKeys.push(key)
    return {
      type: 'album',
      id: `album_${catalog.albums.length + 1}`,
      name: track.album,
      nameSort: track.albumsort || track.album,
      artist: track.albumartist || track.artist,
      year: track.year,
      compilation: track.compilation,
      totaldiscs: track.totaldiscs
    }
  }
}

async function indexTracks (catalog) {
  for (const album of catalog.albums) {
    album.tracks = []
    const albumTracks = catalog.tracks.filter(track => track.albumid === album.id)
    for (const track of albumTracks) {
      album.tracks.push(track.id)
    }
  }
}

async function indexGenres (catalog) {
  for (const album of catalog.albums) {
    album.genres = []
    for (const trackid of album.tracks) {
      const track = catalog.getObject(trackid)
      if (!track.genres) {
        continue
      }
      for (const genreid of track.genres) {
        if (album.genres.indexOf(genreid) === -1) {
          album.genres.push(genreid)
        }
      }
    }
  }
}

async function indexCredits (catalog) {
  for (const album of catalog.albums) {
    for (const type of creditCategories) {
      for (const trackid of album.tracks) {
        const track = catalog.getObject(trackid)
        if (!track[type]) {
          continue
        }
        for (const jj of track[type]) {
          if (!album[type] || album[type].indexOf(composerid) === -1) {
            album[type] = album[type] || []
            album[type].push(composerid)
          }
        }
      }
    }
  }
}
