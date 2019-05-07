import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ChannelPreviewLastMessage } from './ChannelPreviewLastMessage';
import { ChannelPreview } from './ChannelPreview';
import { LoadingIndicator } from './LoadingIndicator';
import { LoadMorePaginator } from './LoadMorePaginator';
import { withChatContext } from '../context';
import { ChannelListTeam } from './ChannelListTeam';
import { smartRender } from '../utils';

/**
 * ChannelList - A preview list of channels, allowing you to select the channel you want to open
 * @extends PureComponent
 * @example ./docs/ChannelList.md
 */

class ChannelList extends PureComponent {
  static propTypes = {
    /** Channels can be either an array of channels or a promise which resolves to an array of channels */
    channels: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.objectOf({
        then: PropTypes.func,
      }),
      PropTypes.object,
    ]).isRequired,
    /** The Preview to use, defaults to ChannelPreviewLastMessage */
    Preview: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

    /** The loading indicator to use */
    LoadingIndicator: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    List: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    Paginator: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    Preview: ChannelPreviewLastMessage,
    LoadingIndicator,
    List: ChannelListTeam,
    Paginator: LoadMorePaginator,
  };

  constructor(props) {
    super(props);
    this.state = { error: false };

    this.menuButton = React.createRef();
  }

  // async componentDidMount() {
  //   await this.queryChannels();
  // }

  // queryChannels = async () => {
  //   try {
  //     let channelQueryResponse = this.props.channels;
  //     if (isPromise(channelQueryResponse)) {
  //       channelQueryResponse = await this.props.channels;
  //       if (channelQueryResponse.length >= 1) {
  //         this.props.setActiveChannel(channelQueryResponse[0]);
  //       }
  //     }
  //     this.setState({ loading: false, channels: channelQueryResponse });
  //   } catch (e) {
  //     console.log(e);
  //     this.setState({ error: true });
  //   }
  // };

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(error, info) {
    console.warn(error, info);
  }

  closeMenu = () => {
    this.menuButton.current.checked = false;
  };

  // new channel list // *********************************

  _renderChannel = (item) => {
    const { Preview, setActiveChannel, channel } = this.props;

    const args = {
      channel: item,
      activeChannel: channel,
      closeMenu: this.closeMenu,
      Preview,
      setActiveChannel,
      key: item.id,
    };
    return smartRender(ChannelPreview, { ...args });
  };

  render() {
    const {
      List,
      Paginator,
      loadNextPage,
      refreshing,
      hasNextPage,
      channels,
      loadingChannels,
    } = this.props;
    return (
      <React.Fragment>
        <input
          type="checkbox"
          id="str-chat-channel-checkbox"
          ref={this.menuButton}
          className="str-chat-channel-checkbox"
        />
        <label
          htmlFor="str-chat-channel-checkbox"
          className="str-chat-channel-list-burger"
        >
          <div />
        </label>
        <div
          className={`str-chat str-chat-channel-list ${this.props.theme} ${
            this.props.open ? 'str-chat-channel-list--open' : ''
          }`}
          ref={this.channelList}
        >
          {/* <List {...this.props} {...this.state} {...context} /> */}
          <List loading={loadingChannels} error={this.state.error}>
            {smartRender(Paginator, {
              loadNextPage,
              hasNextPage,
              refreshing,
              children: channels.map((item) => this._renderChannel(item)),
            })}
          </List>
        </div>
      </React.Fragment>
    );
  }
}

ChannelList = withChatContext(ChannelList);
export { ChannelList };
