module.exports = (catalog, options) => {
  const genre = catalog.getObject(options.id)
  if (!genre) {
    throw new Error('invalid-id')
  }
  return genre
}
