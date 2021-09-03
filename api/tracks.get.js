module.exports = (catalog, options) => {
  const track = catalog.getObject(options.id)
  if (!track) {
    throw new Error('invalid-id')
  }
  return track
}
