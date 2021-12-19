import classNames from 'classnames';
import React from 'react';
import SvgPause from "../../../../assets/icons/font-awesome/solid/pause.svg";
import SvgPlay from "../../../../assets/icons/font-awesome/solid/play.svg";
import { AspectRatioBox } from '../AspectRatioBox';
import { FontAwesomeIcon } from '../FontAwesomeIcon';

/**
 * @typedef {object} Props
 * @property {string} src
 */

/**
 * クリックすると再生・一時停止を切り替えます。
 * @type {React.VFC<Props>}
 */
const PausableMovie = ({ src }) => {
  
  /** @type {React.RefObject<HTMLVideoElement>} */
  const videoElem = React.useRef(null);
  /** @type {React.RefCallback<HTMLVideoElement>} */
  const videoRef = React.useCallback((elm) => {
    if (elm === null) {
      return;
    }
    videoElem.current = elm;

    elm.play();
  }, []);

  const [isPlaying, setIsPlaying] = React.useState(true);
  const handleClick = React.useCallback(() => {
    setIsPlaying((isPlaying) => {
      if (isPlaying) {
        videoElem.current?.pause();
      } else {
        videoElem.current?.play();
      }
      return !isPlaying;
    });
  }, []);

  return (
    <AspectRatioBox aspectHeight={1} aspectWidth={1}>
      <button className="group relative block w-full h-full" onClick={handleClick} type="button">
        <video ref={videoRef} muted src={src} loop preload='none' className='w-full' />
        <div
          className={classNames(
            'absolute left-1/2 top-1/2 flex items-center justify-center w-16 h-16 text-white text-3xl bg-black bg-opacity-50 rounded-full transform -translate-x-1/2 -translate-y-1/2',
            {
              'opacity-0 group-hover:opacity-100': isPlaying,
            },
          )}
        >
          <FontAwesomeIcon IconSvg={isPlaying ? SvgPause : SvgPlay} />
        </div>
      </button>
    </AspectRatioBox>
  );
};

export { PausableMovie };

