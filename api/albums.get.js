module.exports = (catalog, options) => {
  const album = catalog.getObject(options.id)
  if (!album) {
    throw new Error('invalid-id')
  }
  return album
}
