import Router from 'express-promise-router';
import { promises as fs } from 'fs';
import httpErrors from 'http-errors';
import imageSize from 'image-size';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { convertImage } from '../../converters/convert_image';
import { IMAGE_EXTENSION, LARGE_IMAGE_SIZE, SMALL_IMAGE_SIZE } from '../../image_const';
import { UPLOAD_PATH } from '../../paths';

const router = Router();

router.post('/images', async (req, res) => {
  if (req.session.userId === undefined) {
    throw new httpErrors.Unauthorized();
  }
  if (Buffer.isBuffer(req.body) === false) {
    throw new httpErrors.BadRequest();
  }

  const imageId = uuidv4();

  await Promise.all(
    ['large', 'small'].map(async (sizeName) => {
      const converted = await convertImage(req.body, {
        // 画像の拡張子を指定する
        extension: IMAGE_EXTENSION,
        ...(sizeName === 'large' ? LARGE_IMAGE_SIZE : SMALL_IMAGE_SIZE),
      });
      const filePath = path.resolve(UPLOAD_PATH, `./images/${imageId}-${sizeName}.${IMAGE_EXTENSION}`);
      await fs.writeFile(filePath, converted);
    }),
  );
  const imageInfo = imageSize(req.body);

  return res
    .status(200)
    .type('application/json')
    .send({ id: imageId, imageRatio: imageInfo.height / imageInfo.width });
});

export { router as imageRouter };
