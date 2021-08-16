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

async function scanGenres (library) {
  const uniqueKeys = []
  library.genres = []
  for (const track of library.tracks) {
    if (!track.genres || !track.genres.length) {
      continue
    }
    const genres = track.genres.split(',')
    for (const i in genres) {
      const name = genres[i]
      const genre = await processGenre(library, name, uniqueKeys)
      if (genre) {
        library.genres.push(genre)
      }
    }
  }
  library.indexArray(library.genres)
}

async function processGenre (library, name, uniqueKeys) {
  const key = normalize(name)
  const existingIndex = uniqueKeys.indexOf(key)
  if (existingIndex === -1) {
    uniqueKeys.push(key)
    return {
      type: 'genre',
      id: `genre_${library.genres.length} + 1`,
      name,
      displayName: name,
      sortName: name
    }
  }
}

async function indexTracks (library) {
  for (const genre of library.genres) {
    genre.tracks = []
    const tracks = library.tracks.filter(track => track.genres && track.genres.indexOf(genre.id) > -1)
    for (const track of tracks) {
      genre.tracks.push(track.id)
    }
  }
}

async function indexCredits (library) {
  for (const genre of library.genres) {
    for (const trackid of genre.tracks) {
      const track = library.getObject(trackid)
      for (const category of library.creditCategories) {
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

async function indexAlbums (library) {
  for (const genre of library.genres) {
    genre.albums = []
    for (const album of library.albums) {
      if (!album.genres || album.genres.indexOf(genre.id) === -1) {
        continue
      }
      genre.albums.push(album.id)
    }
  }
}
