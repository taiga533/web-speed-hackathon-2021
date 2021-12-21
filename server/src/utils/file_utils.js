import fs from 'fs';
import path from 'path';

/**
 * ファイル一覧を取得する
 * @param {string} searchTargetPath
 * @param {boolean} [isRecursive=true]
 * @returns {Array<string>}
 */
export function getFiles(searchTargetPath, isRecursive = true) {
  return fs.readdirSync(searchTargetPath, { withFileTypes: true }).flatMap((content) => {
    const childPath = path.join(searchTargetPath, content.name);
    return isRecursive && content.isDirectory() ? getFiles(childPath) : childPath;
  });
}
