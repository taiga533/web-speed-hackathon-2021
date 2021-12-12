import React from 'react';

/**
 * @typedef {object} Props
 * @property {React.Element} IconSvg
 */

/** @type {React.VFC<Props>} */
const FontAwesomeIcon = ({ IconSvg }) => {
  return (
    <IconSvg className="font-awesome inline-block leading-none fill-current" />
  );
};

export { FontAwesomeIcon };

