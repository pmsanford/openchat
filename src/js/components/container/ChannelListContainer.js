import React, { Component } from "react";
import ReactDOM from "react-dom";
import ChannelList from "../presentational/ChannelList";
class ChannelListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: props.channels,
      channels_update: props.channels_update
    };
    this.removeChannel = this.removeChannel.bind(this);
  }

  removeChannel(e) {
    var chanName = e.target.id.substring("close_chan_".length);
    var channels = this.state.channels;
    if (chanName == "public") {
      return;
    }
    if (this.state.channels.indexOf(chanName) >= 0) {
      channels.splice(channels.indexOf(chanName), 1);
    }
    this.setState({ channels: channels });
    this.state.channels_update(channels);
  }

  render() {
    return <ChannelList
      channels={this.state.channels}
      delete_channel={this.removeChannel}
    />;
  }
};

export default ChannelListContainer;

const wrapper = document.getElementById("channel-list");
wrapper ? ReactDOM.render(<ChannelListContainer />, wrapper) : false;