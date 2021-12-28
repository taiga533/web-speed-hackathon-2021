import classNames from 'classnames';
import React from 'react';


/**
 * @typedef {object} Props
 * @property {string} alt
 * @property {string} src
 */

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように画像を拡大縮小します
 * @type {React.VFC<Props>}
 */
const CoveredImage = ({ alt, src, imageRatio }) => {

  const [containerSize, setContainerSize] = React.useState({ height: 0, width: 0 });
  /** @type {React.RefCallback<HTMLDivElement>} */
  console.log(imageRatio)
  const callbackRef = React.useCallback((el) => {
    setContainerSize({
      height: el?.clientHeight ?? 0,
      width: el?.clientWidth ?? 0,
    });
  }, []);

  const containerRatio = containerSize.height / containerSize.width;

  return (
    <div ref={callbackRef} className="relative w-full h-full overflow-hidden">
      <picture
        >
        <source media="(max-width: 799px)" srcset={src.replace(/(\.[a-z]+)$/, "-small$1")}/>
        <source media="(min-width: 800px)" srcset={src.replace(/(\.[a-z]+)$/, "-large$1")} />
        <img className={classNames('absolute left-1/2 top-1/2 max-w-none transform -translate-x-1/2 -translate-y-1/2', {
          'w-auto h-full': containerRatio > imageRatio,
          'w-full h-auto': containerRatio <= imageRatio,
        })} src={src.replace(/(\.[a-z]+)$/, "-large$1")} alt={alt} />
      </picture>
    </div>
  );
};

export { CoveredImage };

