import Router from 'express-promise-router';
import { promises as fs } from 'fs';
import httpErrors from 'http-errors';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { convertMovie } from '../../converters/convert_movie';
import { UPLOAD_PATH } from '../../paths';
import { MOVIE_EXTENSION, MOVIE_FRAME_SIZE } from './../../movie_const';

const router = Router();

router.post('/movies', async (req, res) => {
  if (req.session.userId === undefined) {
    throw new httpErrors.Unauthorized();
  }
  if (Buffer.isBuffer(req.body) === false) {
    throw new httpErrors.BadRequest();
  }

  const movieId = uuidv4();

  const converted = await convertMovie(req.body, {
    // 動画の拡張子を指定する
    extension: MOVIE_EXTENSION,
    // 動画の縦横サイズを指定する (undefined は元動画に合わせる)
    size: MOVIE_FRAME_SIZE,
  });

  const filePath = path.resolve(UPLOAD_PATH, `./movies/${movieId}.${MOVIE_EXTENSION}`);
  await fs.writeFile(filePath, converted);

  return res.status(200).type('application/json').send({ id: movieId });
});

export { router as movieRouter };
