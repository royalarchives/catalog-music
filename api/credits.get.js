module.exports = (library, options) => {
  const person = library.getObject(options.id)
  if (!person) {
    throw new Error('invalid-id')
  }
  return person
}
