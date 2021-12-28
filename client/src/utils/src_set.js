/**
 *
 * @param {string} imagePath
 * @returns {Array<string>}
 */
function buildSrcSet(imagePath) {
  return [
    { sizeName: 'small', viewPort: '1080w' },
    { sizeName: 'large', viewPort: '1920w' },
  ].map((size) => {
    return imagePath.replace(/(\.[a-z]+)$/, `-${size.sizeName}$1`) + ' ' + size.viewPort;
  });
}

/**
 *
 * @param {string} imagePath
 * @returns {string}
 */
function buildDefaultSrc(imagePath) {
  return imagePath.replace(/(\.[a-z]+)$/, '-large$1');
}
export { buildDefaultSrc, buildSrcSet };
