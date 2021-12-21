import fs from 'fs';
import path from 'path';
import { convertMovie } from './converters/convert_movie';
import { MOVIE_EXTENSION, MOVIE_FRAME_SIZE } from './movie_const';
import { PUBLIC_PATH } from './paths';
import { getFiles } from './utils/file_utils';

const moviesPath = path.join(PUBLIC_PATH, '/movies');

async function convertAllMovie() {
  const moviePaths = getFiles(moviesPath);
  moviePaths
    .filter((path) => path.match(/\.gif$/))
    .reduce((promise, path) => {
      return promise.then(async () => {
        const movieBuffer = await fs.promises.readFile(path);
        const convertedMovieBuffer = await convertMovie(movieBuffer, {
          extension: MOVIE_EXTENSION,
          size: MOVIE_FRAME_SIZE,
        });
        await saveConvertedFile(path, convertedMovieBuffer);
      });
    }, Promise.resolve());
}

/**
 * 変換した動画を保存
 * @param {string} moviePath
 * @param {Buffer} movieBuffer
 * @returns {Promise<void>}
 */
async function saveConvertedFile(moviePath, movieBuffer) {
  fs.promises.writeFile(moviePath.replace(/\.[a-z]+$/, `.${MOVIE_EXTENSION}`), movieBuffer);
}

// 実行完了を待たない
convertAllMovie();
