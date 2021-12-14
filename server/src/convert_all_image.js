import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { IMAGE_EXTENSION, IMAGE_SIZE } from './image_const';
import { PUBLIC_PATH } from './paths';
import { getFiles } from './utils/file_utils';

const imagesPath = path.join(PUBLIC_PATH, '/images');

async function convertAllImage() {
  const imagePaths = getFiles(imagesPath);
  console.log(imagePaths);
  await Promise.all(
    imagePaths.map((path) => {
      convertImage(path);
    }),
  );
}

/**
 *
 * @param {string} imagePath
 * @returns {Promise<void>}
 */
async function convertImage(imagePath) {
  const imageBuffer = await sharp(imagePath)
    .resize({
      fit: IMAGE_FIT_STRATEGY,
      height: IMAGE_SIZE.height,
      width: IMAGE_SIZE.width,
    })
    .toFormat(IMAGE_EXTENSION)
    .toBuffer();
  return resolve(await fs.promises.writeFile(imagePath.replace(/\.[a-z]+$/, `.${IMAGE_EXTENSION}`), imageBuffer));
}

// 実行完了を待たない
convertAllImage();
