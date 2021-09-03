module.exports = (catalog, options) => {
  const person = catalog.getObject(options.id)
  if (!person) {
    throw new Error('invalid-id')
  }
  return person
}
