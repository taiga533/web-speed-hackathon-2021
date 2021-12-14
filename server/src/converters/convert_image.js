import sharp from 'sharp';
import { IMAGE_EXTENSION, IMAGE_FIT_STRATEGY, IMAGE_SIZE } from '../image_const';

/**
 * @param {Buffer} buffer
 * @param {object} options
 * @param {number} [options.extension]
 * @param {number} [options.height]
 * @param {number} [options.width]
 * @returns {Promise<Uint8Array>}
 */
async function convertImage(buffer, options) {
  return sharp(buffer)
    .resize({
      fit: IMAGE_FIT_STRATEGY,
      height: options.height ?? IMAGE_SIZE.height,
      width: options.width ?? IMAGE_SIZE.width,
    })
    .toFormat(options.extension ?? IMAGE_EXTENSION)
    .toBuffer();
}

export { convertImage };
