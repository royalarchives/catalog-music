module.exports = (library, options) => {
  const track = library.getObject(options.id)
  if (!track) {
    throw new Error('invalid-id')
  }
  return track
}
