import fs from 'fs';
import imageSize from 'image-size';
import path from 'path';
import imagesJson from '../seeds/images.json';
import { PUBLIC_PATH } from './paths';
import { getFiles } from './utils/file_utils';
const imagesPath = path.join(PUBLIC_PATH, '/images');
const imageJsonPath = path.resolve(__dirname, './../seeds/images.json');

async function modifyImageModelSeeds() {
  const uploadedImages = getFiles(imagesPath, false);
  fs.promises.writeFile(
    imageJsonPath,
    JSON.stringify(
      imagesJson.map((json) => {
        const imagePath = uploadedImages.find((path) => path.includes(json.id) && path.match(/-small\.[a-z]+$/));
        const imageInfo = imageSize(imagePath);
        json.imageRatio = imageInfo.height / imageInfo.width;
        return json;
      }),
      null,
      2,
    ),
  );
}

// 実行完了を待たない
modifyImageModelSeeds();
