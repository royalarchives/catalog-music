module.exports = (library, options) => {
  const album = library.getObject(options.id)
  if (!album) {
    throw new Error('invalid-id')
  }
  return album
}
