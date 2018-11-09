import React from "react";
import PropTypes from "prop-types";

const ChatMessage = ({ username, channel, messagebody }) => (
    <div className="card">
        <div className="card-body">
            <h5 className="card-title">
                {username}
            </h5>
            <h6 className="card-subtitle text-muted mb-2">
                {channel}
            </h6>
            {messagebody}
        </div>
    </div>
);

ChatMessage.propTypes = {
    username: PropTypes.string.isRequired,
    channel: PropTypes.string,
    messagebody: PropTypes.string
};
export default ChatMessage;