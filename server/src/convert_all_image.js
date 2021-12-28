import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { IMAGE_EXTENSION, LARGE_IMAGE_SIZE, SMALL_IMAGE_SIZE } from './image_const';
import { PUBLIC_PATH } from './paths';
import { getFiles } from './utils/file_utils';

const imagesPath = path.join(PUBLIC_PATH, '/images');

async function convertAllImage() {
  const imagePaths = getFiles(imagesPath, false);
  await Promise.all(
    imagePaths
      .filter((path) => path.match(/.webp$/))
      .map(async (imagePath) => {
        const largeImageBuffer = await convertImage(imagePath, 'large');
        saveConvertedFile(imagePath, largeImageBuffer, 'large');
        const smallImageBuffer = await convertImage(imagePath, 'small');
        saveConvertedFile(imagePath, smallImageBuffer, 'small');
      }),
  );
}

/**
 * 画像ファイルを変換
 * @param {string} imagePath
 * @param {"large" | "small"} sizeName
 * @returns {Promise<Buffer>}
 */
async function convertImage(imagePath, sizeName) {
  return (
    sharp(imagePath)
      .resize({
        position: 'center',
        ...(sizeName === 'large' ? LARGE_IMAGE_SIZE : SMALL_IMAGE_SIZE),
      })
      // .toFormat(IMAGE_EXTENSION)
      .toBuffer()
  );
}

/**
 * 変換した画像を保存
 * @param {string} imagePath
 * @param {Buffer} imageBuffer
 * @param {"large" | "small"} sizeName
 * @returns {Promise<void>}
 */
async function saveConvertedFile(imagePath, imageBuffer, sizeName) {
  fs.promises.writeFile(imagePath.replace(/(-[a-zA-Z]+)?\.[a-z]+$/, `-${sizeName}.${IMAGE_EXTENSION}`), imageBuffer);
}

// 実行完了を待たない
convertAllImage();
