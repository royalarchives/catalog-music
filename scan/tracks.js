const MusicMetaData = require('music-metadata')

module.exports = {
  scan: scanTracks
}

async function scanTracks (catalog) {
  catalog.tracks = []
  for (const file of catalog.files) {
    if (file.extension !== 'mp3' && file.extension !== 'flac') {
      continue
    }
    const track = await processTrack(catalog, file)
    if (track) {
      catalog.tracks.push(track)
    }
  }
  catalog.indexArray(catalog.tracks)
}

async function processTrack (catalog, file) {
  let metaData
  try {
    metaData = await MusicMetaData.parseFile(file.path)
  } catch (error) {
    console.error('[music-indexer]', 'error reading meta data', file.path, error)
  }
  const track = {
    id: `track_${catalog.tracks.length + 1}`,
    type: 'track',
    path: file.path
  }
  for (const group of ['common', 'format']) {
    for (const key in metaData[group]) {
      if (metaData[group][key]) {
        if (key === 'picture') {
          track.images = []
          for (const image of metaData[group].picture) {
            track.images.push({
              format: image.format,
              type: image.type,
              size: image.data.length
            })
          }
        } else if (key === 'disk' || key === 'track') {
          const label = key === 'disk' ? 'disc' : 'track'
          track[label] = metaData.common[key].no || 0
          track[`${label}s`] = metaData.common[key].of || 0
        } else {
          track[key] = metaData[group][key]
          if (Array.isArray(track[key])) {
            track[key] = track[key].join(', ')
          } else if (track[key].trim) {
            track[key] = track[key].trim()
          }
        }
      }
    }
  }
  return track
}
