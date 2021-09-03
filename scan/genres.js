const creditCategories = require('./credits.js').creditCategories

module.exports = {
  scan: scanGenres,
  indexAlbums,
  indexCredits,
  indexTracks
}

function normalize (text) {
  return text.toLowerCase().replace(/[\W_]+/g, '').trim()
}

async function scanGenres (catalog) {
  const uniqueKeys = []
  catalog.genres = []
  for (const track of catalog.tracks) {
    if (!track.genres || !track.genres.length) {
      continue
    }
    const genres = track.genres.split(',')
    for (const i in genres) {
      const name = genres[i]
      const genre = await processGenre(catalog, name, uniqueKeys)
      if (genre) {
        catalog.genres.push(genre)
      }
    }
  }
  catalog.indexArray(catalog.genres)
}

async function processGenre (catalog, name, uniqueKeys) {
  const key = normalize(name)
  const existingIndex = uniqueKeys.indexOf(key)
  if (existingIndex === -1) {
    uniqueKeys.push(key)
    return {
      type: 'genre',
      id: `genre_${catalog.genres.length} + 1`,
      name,
      displayName: name,
      sortName: name
    }
  }
}

async function indexTracks (catalog) {
  for (const genre of catalog.genres) {
    genre.tracks = []
    const tracks = catalog.tracks.filter(track => track.genres && track.genres.indexOf(genre.id) > -1)
    for (const track of tracks) {
      genre.tracks.push(track.id)
    }
  }
}

async function indexCredits (catalog) {
  for (const genre of catalog.genres) {
    for (const trackid of genre.tracks) {
      const track = catalog.getObject(trackid)
      for (const category of catalog.creditCategories) {
        if (!track[category]) {
          continue
        }
        for (const id of track[category]) {
          genre[category] = genre[category] || []
          if (genre[category].indexOf(id) === -1) {
            genre[category].push(id)
          }
        }
      }
    }
  }
}

async function indexAlbums (catalog) {
  for (const genre of catalog.genres) {
    genre.albums = []
    for (const album of catalog.albums) {
      if (!album.genres || album.genres.indexOf(genre.id) === -1) {
        continue
      }
      genre.albums.push(album.id)
    }
  }
}
