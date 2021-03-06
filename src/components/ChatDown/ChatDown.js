import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { LoadingChannels } from '../Loading';
import { TranslationContext } from '../../context';

import placeholder from '../../assets/str-chat__connection-error.svg';

/**
 * ChatDown - Indicator that chat is down or your network isn't working
 *
 * @example ../../docs/ChatDown.md
 */
const ChatDown = ({ image, type, text }) => {
  const { t } = useContext(TranslationContext);

  return (
    <div className="str-chat__down">
      <LoadingChannels />
      <div className="str-chat__down-main">
        <img data-testid="chatdown-img" src={image || placeholder} />
        <h1>{type}</h1>
        <h3>
          {text ||
            t('Error connecting to chat, refresh the page to try again.')}
        </h3>
      </div>
    </div>
  );
};

ChatDown.defaultProps = {
  type: 'Error',
};

ChatDown.propTypes = {
  /** The image url for this error */
  image: PropTypes.string,
  /** The type of error */
  type: PropTypes.string,
  /** The error message to show */
  text: PropTypes.string,
};

export default React.memo(ChatDown);
