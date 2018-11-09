import React, { Component } from "react";
import ReactDOM from "react-dom";
import ChatInput from "../presentational/ChatInput";
import ChannelInput from "../presentational/ChannelInput";
import Cryptor from "../../lib"
class InputFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            chkey: props.channels[0],
            username: '',
            channels: props.channels,
            channels_update: props.channels_update,
            post_message: props.post_message,
            new_chan: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.postMessage = this.postMessage.bind(this);
        this.addChannel = this.addChannel.bind(this);
        this.addOnEnter = this.addOnEnter.bind(this);
        this.postOnEnter = this.postOnEnter.bind(this);
        this.crypt = new Cryptor();
    }

    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    addChannel(e) {
        var chlist = this.state.channels;
        if (!chlist.includes(this.state.new_chan)) {
            chlist.push(this.state.new_chan);
            this.setState({ channels: chlist, new_chan: '' });
            this.state.channels_update(chlist);
        }
    }

    addOnEnter(e) {
        if (e.key === 'Enter') {
            this.addChannel(e);
        }
    }

    async postMessage(e) {
        const { message, chkey, username } = this.state;
        this.state.post_message(message, chkey, username);
        this.setState({ message: '' });
    }

    postOnEnter(e) {
        if (e.key === 'Enter') {
            this.postMessage(e);
        }
    }

    render() {
        const { message, chkey, username, channels, new_chan } = this.state;
        return <div className="container-fluid">
            <div className="row">
                <div className="col-2">
                    <ChannelInput channel={new_chan}
                        input_change={this.handleChange}
                        on_add={this.addChannel}
                        on_key={this.addOnEnter}
                    />
                </div>
                <div className="col-10">
                    <ChatInput message={message}
                        channel_key={chkey}
                        username={username}
                        input_change={this.handleChange}
                        channels={channels}
                        handle_send={this.postMessage}
                        handle_key={this.postOnEnter}
                    />
                </div>
            </div>
        </div>;
    }
}
export default InputFooter;

const wrapper = document.getElementById("input-footer");
wrapper ? ReactDOM.render(<InputFooter />, wrapper) : false;