import React from "react";
import PropTypes from "prop-types";
import InputFooter from "../container/InputFooter"
import MessageContainer from "../container/MessageContainer"
import ChannelListContainer from "../container/ChannelListContainer"
const Layout = ({ messages, post_message, channels, channels_update }) => (
    <div>
        <div className="row">
            <div className="col-2">
                <h2>Channels</h2>
            </div>
            <div className="col-10">
                <h2>Chat</h2>
            </div>
        </div>
        <div className="row">
            <div className="col-2">
                <ChannelListContainer
                    channels={channels}
                    channels_update={channels_update}
                />
            </div>
            <div className="col-10 p-0 chatbox">
                <MessageContainer
                    messages={messages}
                    channels={channels}
                />
            </div>
        </div>
        <footer className="footer">
            <InputFooter
                post_message={post_message}
                channels={channels}
                channels_update={channels_update}
            />
        </footer>
    </div>
);

export default Layout;