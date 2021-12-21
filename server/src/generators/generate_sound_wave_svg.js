import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import lodashChunk from 'lodash/chunk';
import lodashMap from 'lodash/map';
import lodashMax from 'lodash/max';
import lodashMean from 'lodash/mean';
import lodashZip from 'lodash/zip';
import { AudioContext } from 'web-audio-api';

/**
 * @param {audioId} string
 * @param {ArrayBuffer} audioData
 * @returns {Promise<string>}
 */
async function generatesoundWaveSvg(audioId, audioData) {
  const resampledAudio = await resampling(audioData);
  const { document } = new JSDOM().window;
  const svg = await buildBaseSvg(document);
  resampledAudio.peaks.map((peak, idx) => {
    const ratio = peak / resampledAudio.max;
    svg
      .append('rect')
      .attr('fill', '#2563EB')
      .attr('height', ratio)
      .attr('width', 1)
      .attr('x', idx)
      .attr('y', 1 - ratio);
  });
  return document.body.innerHTML;
}

/**
 * @param {audioId} string
 * @param {Document} document
 * @returns {d3.Selection<HTMLElement, any, null, undefined>} a
 */
function buildBaseSvg(audioId, document) {
  return d3
    .select(document.body)
    .append('svg')
    .attr('id', audioId)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('preserveAspectRatio', 'none')
    .attr('viewBox', '0 0 100 1');
}

/**
 * オーディオデータをリサンプリングする
 * @param {ArrayBuffer} audioData
 * @returns {Promise<{ max: number, peaks: number[]}>}
 */
async function resampling(audioData) {
  const audioCtx = new AudioContext();

  // 音声をデコードする
  const buffer = await new Promise((resolve, reject) => {
    audioCtx.decodeAudioData(audioData.slice(0), resolve, reject);
  });
  // 左の音声データの絶対値を取る
  const leftData = lodashMap(buffer.getChannelData(0), Math.abs);
  // 右の音声データの絶対値を取る
  const rightData = lodashMap(buffer.getChannelData(1), Math.abs);

  // 左右の音声データの平均を取る
  const normalized = lodashMap(lodashZip(leftData, rightData), lodashMean);
  // 100 個の chunk に分ける
  const chunks = lodashChunk(normalized, Math.ceil(normalized.length / 100));
  // chunk ごとに平均を取る
  const peaks = lodashMap(chunks, lodashMean);
  // chunk の平均の中から最大値を取る
  const max = lodashMax(peaks);

  return { max, peaks };
}

export { generatesoundWaveSvg };
