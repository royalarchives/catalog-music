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

async function scanAlbums (library) {
  library.albums = []
  const uniqueKeys = []
  for (const track of library.tracks) {
    if (!track.artist || !track.album) {
      continue
    }
    const album = await processAlbum(library, track, uniqueKeys)
    if (album) {
      library.albums.push(album)
    }
  }
  library.indexArray(library.albums)
}

async function processAlbum (library, track, uniqueKeys) {
  const key = normalize(track.artist) + normalize(track.album)
  if (uniqueKeys.indexOf(key) === -1) {
    uniqueKeys.push(key)
    return {
      type: 'album',
      id: `album_${library.albums.length + 1}`,
      name: track.album,
      nameSort: track.albumsort || track.album,
      artist: track.albumartist || track.artist,
      year: track.year,
      compilation: track.compilation,
      totaldiscs: track.totaldiscs
    }
  }
}

async function indexTracks (library) {
  for (const album of library.albums) {
    album.tracks = []
    const albumTracks = library.tracks.filter(track => track.albumid === album.id)
    for (const track of albumTracks) {
      album.tracks.push(track.id)
    }
  }
}

async function indexGenres (library) {
  for (const album of library.albums) {
    album.genres = []
    for (const trackid of album.tracks) {
      const track = library.getObject(trackid)
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

async function indexCredits (library) {
  for (const album of library.albums) {
    for (const type of creditCategories) {
      for (const trackid of album.tracks) {
        const track = library.getObject(trackid)
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
