# Library: Music

A module for [Library](https://github.com/royalarchives/library) that indexes the files and extracts `MP3` and `FLAC` tracks and uses [Music-MetaData](https://github.com/borewit/music-metadata/) to read embedded information.

Songs, albums, genres, and any persons associated with them are indexed into `library.tracks`, `.library.albums`, `library.genres`, and `library.<persontype>` arrays that can be sorted, filtered and paginated using the API.

### Documentation

- [How to use](#how-to-use)
- [Index data structure](#index-data-structure)
- [Using the API with NodeJS](#using-the-media-index-with-nodejs)

## How to use

First install the module with `NPM`:

    $ npm install @royalarchives/library-music

If you are using [Library](https://github.com/royalarchives/library) from the command-line include the module name in your arguments:

    $ node scanner.js @royalarchives/library-music /path/to-music

If you are using [Library](https://github.com/royalarchives/library) with NodeJS include the module name in the parameters:

    const Library = require('@royalarchives/library')
    await Library.scan('@royalarchives/library-music', [
      '/music-1/music',
      '/music-2/music',
      '/music-3/music'
    ])

## Index data structure

[Top of page](#documentation)

## Using the API with NodeJS

[Top of page](#documentation)


## License

MIT
