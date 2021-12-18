import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { IMAGE_EXTENSION, IMAGE_FIT_STRATEGY, IMAGE_SIZE } from './image_const';
import { PUBLIC_PATH } from './paths';
import { getFiles } from './utils/file_utils';

const imagesPath = path.join(PUBLIC_PATH, '/images');

async function convertAllImage() {
  const imagePaths = getFiles(imagesPath);
  await Promise.all(
    imagePaths
      .filter((path) => path.match(/.jpe?g$/))
      .map((path) => {
        (async (imagePath) => {
          const imageBuffer = await convertImage(imagePath);
          saveConvertedFile(imagePath, imageBuffer);
        })(path);
      }),
  );
}

/**
 * 画像ファイルを変換
 * @param {string} imagePath
 * @returns {Promise<Buffer>}
 */
async function convertImage(imagePath) {
  return sharp(imagePath)
    .resize({
      fit: IMAGE_FIT_STRATEGY,
      height: IMAGE_SIZE.height,
      width: IMAGE_SIZE.width,
    })
    .toFormat(IMAGE_EXTENSION)
    .toBuffer();
}

/**
 * 変換した画像を保存
 * @param {string} imagePath
 * @param {Buffer} imageBuffer
 * @returns {Promise<void>}
 */
async function saveConvertedFile(imagePath, imageBuffer) {
  fs.promises.writeFile(imagePath.replace(/\.[a-z]+$/, `.${IMAGE_EXTENSION}`), imageBuffer);
}

// 実行完了を待たない
convertAllImage();
