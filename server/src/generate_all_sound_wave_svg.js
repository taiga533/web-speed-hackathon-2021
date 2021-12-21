import fs from 'fs';
import path from 'path';
import { generatesoundWaveSvg } from './generators/generate_sound_wave_svg';
import { PUBLIC_PATH } from './paths';
import { MUSIC_EXTENSION } from './sound_const';
import { getFiles } from './utils/file_utils';

const soundPath = path.join(PUBLIC_PATH, '/sounds');
const wavespath = path.join(PUBLIC_PATH, '/svg/waves');

async function generateAllsoundWaveSvg() {
  const soundPaths = getFiles(soundPath);
  const svgGeneratePromises = soundPaths
    .filter((filePath) => filePath.match(String.raw`\.${MUSIC_EXTENSION}$`))
    .map(async (filePath) => {
      const fileName = path.basename(filePath, `.${MUSIC_EXTENSION}`);
      const sound = await fs.promises.readFile(fileName, filePath);

      const waveSvg = await generatesoundWaveSvg(fileName, sound);
      fs.promises.writeFile(path.join(wavespath, `${fileName}.svg`), waveSvg);
    });
  Promise.all(svgGeneratePromises);
}
generateAllsoundWaveSvg();
