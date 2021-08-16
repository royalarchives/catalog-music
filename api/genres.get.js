module.exports = (library, options) => {
  const genre = library.getObject(options.id)
  if (!genre) {
    throw new Error('invalid-id')
  }
  return genre
}
