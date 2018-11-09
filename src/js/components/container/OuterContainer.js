import React, { Component } from "react";
import ReactDOM from "react-dom";
import Layout from "../presentational/Layout";
import Cryptor from "../../lib";

class OuterContainer extends Component {
    constructor() {
        super();
        var ch_list = JSON.parse(localStorage.getItem('openchat-channels'));
        if (ch_list === undefined || ch_list === null) {
            ch_list = [];
        }
        if (!ch_list.includes('public')) {
            ch_list.push('public');
        }
        this.state = { channels: ch_list, messages: [] };
        this.channelsUpdate = this.channelsUpdate.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.fetchMessages();
        this.crypt = new Cryptor();
        this.postSource = null;
    }

    fetchMessages() {
        fetch('/r/messages')
            .then(function (data) {
                return data.json();
            })
            .then(this.storeMessages.bind(this)).then(function (lastid) {
                this.postSource = new EventSource('/r/stream?start_after=' + lastid);
                this.postSource.onmessage = function (e) {
                    this.storeMessages(JSON.parse(e.data), true);
                }.bind(this);
            }.bind(this));
    }

    async storeMessages(messagesJson, append) {
        var messages = [];
        var highest_seen = -1
        for (var i = 0; i < messagesJson.length; i++) {
            if (Number(messagesJson[i].msg_id) <= highest_seen) {
                continue;
            }
            var added = false;
            for (var m = 0; m < this.state.channels.length; m++) {
                var de = await this.crypt.decrypt(JSON.parse(messagesJson[i].payload), this.state.channels[m]);
                if (de != null) {
                    messages.push({
                        'msg_id': messagesJson[i].msg_id,
                        'username': messagesJson[i].username,
                        'channel': this.state.channels[m],
                        'payload': de
                    });
                    added = true;
                    break;
                }
            }
            if (!added) {
                messages.push({
                    'msg_id': messagesJson[i].msg_id,
                    'username': messagesJson[i].username,
                    'channel': 'unknown',
                    'payload': btoa(JSON.stringify(messagesJson[i].payload))
                });
            }
            if (Number(messagesJson[i].msg_id) > highest_seen) {
                highest_seen = Number(messagesJson[i].msg_id);
            }
        }
        if (append === true) {
            messages = this.state.messages.concat(messages);
        }
        this.setState({
            messages: messages
        });
        return messages.slice(-1)[0].msg_id;
    }

    async postMessage(message, chkey, username) {
        var payload = await this.crypt.encrypt(message, chkey);
        fetch('/r/messages', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                payload: payload
            })
        });
    }

    channelsUpdate(new_list) {
        localStorage.setItem('openchat-channels', JSON.stringify(new_list));
        this.setState({ channels: new_list });
        this.postSource.close();
        this.fetchMessages();
    }

    render() {
        const { channels, messages } = this.state;
        return <Layout
            messages={messages}
            post_message={this.postMessage.bind(this)}
            channels={channels}
            channels_update={this.channelsUpdate}
        />
    }
}

export default Layout;

const wrapper = document.getElementById("outer-container");
wrapper ? ReactDOM.render(<OuterContainer />, wrapper) : false;