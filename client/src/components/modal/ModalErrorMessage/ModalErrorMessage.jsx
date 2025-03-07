import classNames from 'classnames';
import React from 'react';
import SvgExclamationCircle from "../../../../assets/icons/font-awesome/solid/exclamation-circle.svg";
import { FontAwesomeIcon } from '../../foundation/FontAwesomeIcon';


/**
 * @typedef {object} Props
 * @property {string | null} children
 */

/** @type {React.VFC<Props>} */
const ModalErrorMessage = ({ children }) => {
  return (
    <span className={classNames('block h-6 text-red-600', { invisible: !children })}>
      <span className="mr-1">
        <FontAwesomeIcon IconSvg={SvgExclamationCircle} />
      </span>
      {children}
    </span>
  );
};

export { ModalErrorMessage };

